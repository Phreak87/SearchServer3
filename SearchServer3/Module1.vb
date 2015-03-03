Imports System.Xml
Imports System.Threading
Imports MongoDB.Bson
Imports MongoDB.Driver
Imports MongoDB.Driver.Builders
Imports System.Net.Sockets
Imports SearchServer3.CLS.WBS.JSONEncoder

Module Module1

    Dim DBClient As New MongoClient
    Dim DBServer As MongoServer
    Dim DBMongo As MongoDatabase

    ' --------------------------------------------------------
    ' Mongo Ergebnis-Collections
    ' --------------------------------------------------------
    Dim DIR As MongoCollection      ' Abzufragende Dirs
    Dim RSS As MongoCollection      ' Abzufragende Rss
    Dim FIL As MongoCollection      ' Abzufragende Fils

    Dim TDIR As MongoCollection     ' Temporär f. DIR Updates
    Dim TRSS As MongoCollection     ' Temporär f. RSS Updates
    Dim TFIL As MongoCollection     ' Temporär f. FIL Updates
    Dim TWEB As MongoCollection     ' Temporär f. WEB Results

    Dim QRY As MongoCollection      ' Suchanfragen
    Dim MRK As MongoCollection      ' Merker für Suchbegriffe
    Dim MSG As MongoCollection      ' Systemnachrichten (Debug)
    Public IDX As MongoCollection   ' Indexe

    Dim WebServer As CLS.WBS.Server

    Dim DIRLIST As New List(Of CLS.DIR)
    Dim FILLIST As New List(Of CLS.FIL)
    Dim RSSLIST As New List(Of CLS.RSS)
    Dim WEBLIST As New List(Of CLS.WEB)
    Dim WEBINCL As New System.Text.StringBuilder

    Public MimeTypes As Mimes

    Sub Main()

        ' Initial-Config
        Dim StartPostClean As Boolean = False
        Dim CollectGarbage As Boolean = True

        Console.WriteLine("Starte SearchServer V3")
        MimeTypes = New Mimes
        ' --------------------------------------------
        ' Startargumente
        ' --------------------------------------------
        Dim ConfFile As String = "Config.xml"
        Dim InitFetch As Boolean = True
        Dim CleanDBS As Boolean = False
        Dim Args As String() = Environment.GetCommandLineArgs
        If Args.Count = 1 Then Exit Sub
        For i As Integer = 1 To Args.Count - 1
            Console.WriteLine(".SYS: Arguments: " & Args(i))
            Select Case LCase(Split(Args(i), "=")(0))
                Case "--config" : ConfFile = Split(Args(i), "=")(1)
                Case "--noinit" : InitFetch = False
                Case "--clean" : CleanDBS = True
            End Select
        Next

        ' --------------------------------------------
        ' Config in Dictionarys laden
        ' --------------------------------------------
        Dim Config As New XmlDocument
        Console.WriteLine(".SYS: Lade Config für RSS, DIR, FIL, WEB")
        Config.Load("Config\" & ConfFile)
        Dim DIRDICT As List(Of Dictionary(Of String, String)) = Helper.XMLToListofStringDictionary(Config, "WebSearch/Fetcher[@Group='DIR']/Searcher", {"Name", "Category", "URL", "Watch", "Refresh"})
        Dim FILDICT As List(Of Dictionary(Of String, String)) = Helper.XMLToListofStringDictionary(Config, "WebSearch/Fetcher[@Group='FIL']/Searcher", {"Name", "Category", "URL", "Refresh"})
        Dim WEBDICT As List(Of Dictionary(Of String, String)) = Helper.XMLToListofStringDictionary(Config, "WebSearch/Fetcher[@Group='WEB']/Searcher", {"Name", "Category", "URL", "Type", "Path", "RelTitle", "RelLink", "RelCont"})
        Dim RSSDICT As List(Of Dictionary(Of String, String)) = Helper.XMLToListofStringDictionary(Config, "WebSearch/Fetcher[@Group='RSS']/Searcher", {"Name", "Category", "URL", "Refresh"})
        WEBINCL.Append(Helper.XMLToJSONArray(Config.SelectSingleNode("WebSearch/Fetcher[@Type='Page']")).Replace("@", "").Replace("#cdata-section", "cdata"))
        Config = Nothing

        Dim DBApp As New CLS.DBS.MongoDB
        AddHandler DBApp.Status, AddressOf LogStatus
        DBApp.Startmongo()

        DBServer = DBClient.GetServer
        Dim iConCount As Integer = 1
        Do
            Try : DBServer.Connect() : Catch ex As Exception
                Console.WriteLine(".SYS: Datenbankverbindung - Connection Loop (1000 ms) Versuch#: " & iConCount)
                Threading.Thread.Sleep(1000) : iConCount = iConCount + 1
            End Try
            If iConCount = 10 Then
                Console.WriteLine("###########################################")
                Console.WriteLine("Datenbank ist beschädigt und wird repariert")
                Console.WriteLine("###########################################")
                DBApp.Rapairmongo()
                DBApp.Startmongo()
                iConCount = 0
            End If
        Loop Until DBServer.State = MongoServerState.Connected
        Console.WriteLine(".DBS: Datenbankverbindung zu MongoDB hergestellt.")

        DBMongo = DBServer.GetDatabase("SEARCHSERVER")
        ' --------------------------------------------
        ' Init Hauptdatenbanken
        ' --------------------------------------------
        DIR = DBMongo.GetCollection("DIR") : RSS = DBMongo.GetCollection("RSS") : FIL = DBMongo.GetCollection("FIL")
        If CleanDBS = True Then Console.WriteLine(".DBS: Drop Database RSS,DIR,FIL") : DIR.Drop() : RSS.Drop() : FIL.Drop()
        DIR.CreateIndex({"objName", "ContentPost"}) : RSS.CreateIndex({"Data"}) : FIL.CreateIndex({"Data"})
        ' --------------------------------------------
        ' Init Temp.Datenbanken
        ' --------------------------------------------
        TDIR = DBMongo.GetCollection("TDIR") : TRSS = DBMongo.GetCollection("TRSS")
        TFIL = DBMongo.GetCollection("TFIL") : TWEB = DBMongo.GetCollection("TWEB")
        TDIR.Drop() : TRSS.Drop() : TFIL.Drop() : TWEB.Drop()
        TDIR.CreateIndex({"_id"}) : TRSS.CreateIndex({"_id"})
        TFIL.CreateIndex({"_id"}) : TWEB.CreateIndex({"_id"})
        ' --------------------------------------------
        ' Init Manage Datenbanken
        ' --------------------------------------------
        MRK = DBMongo.GetCollection("MRK") : QRY = DBMongo.GetCollection("QRY")
        MSG = DBMongo.GetCollection("MSG") : IDX = DBMongo.GetCollection("IDX")
        QRY.Drop() : MSG.Drop() : IDX.Drop()
        MSG.CreateIndex({"_id"}) : QRY.CreateIndex({"_id"})
        MRK.CreateIndex({"_id"}) : IDX.CreateIndex({"_id"})

        Console.WriteLine(".SYS: Initialisiere Threadpool mit 25/5000 Threads")
        System.Threading.ThreadPool.SetMaxThreads(25, 5000)
        System.Threading.ThreadPool.SetMinThreads(25, 5000)

        ' ------------------------------------------------------------
        ' Webserver starten
        ' ------------------------------------------------------------
        WebServer = New CLS.WBS.Server(9090, MimeTypes)
        AddHandler WebServer.Received, AddressOf GetWebs
        AddHandler WebServer.StatusMsg, AddressOf LogStatus
        WebServer.StartServer()

        If InitFetch = True Then
            For Each Eintrag In WEBDICT
                Dim MsgDoc As New BsonDocument : MsgDoc.Add("Type", "WEB") : MsgDoc.Add("Name", Eintrag("Name")) : MsgDoc.Add("Status", "Unknown") : IDX.Insert(MsgDoc)
                Dim Web As New CLS.WEB(Eintrag("URL"), Eintrag("Name"), "", Eintrag("Path"), Eintrag("RelTitle"), Eintrag("RelLink"), Eintrag("RelCont"), Eintrag("Type"), TWEB)
                WEBLIST.Add(Web)
            Next

            For Each Eintrag In FILDICT
                Dim MsgDoc As New BsonDocument : MsgDoc.Add("Type", "FIL") : MsgDoc.Add("Name", Eintrag("Name")) : MsgDoc.Add("Status", "Unknown") : IDX.Insert(MsgDoc)
                Dim FIL_New As New CLS.FIL(Eintrag("Name"), Eintrag("Category"), Eintrag("URL"), FIL)
                FILLIST.Add(FIL_New)
            Next

            For Each Eintrag In RSSDICT
                Dim MsgDoc As New BsonDocument : MsgDoc.Add("Type", "DIR") : MsgDoc.Add("Name", Eintrag("Name")) : MsgDoc.Add("Status", "Unknown") : IDX.Insert(MsgDoc)
                Dim RSS_New As New CLS.RSS(Eintrag("Name"), Eintrag("Category"), Eintrag("URL"), Eintrag("Refresh"), RSS)
                RSSLIST.Add(RSS_New)
            Next

            For Each Eintrag In DIRDICT
                Dim MsgDoc As New BsonDocument : MsgDoc.Add("Type", "DIR") : MsgDoc.Add("Name", Eintrag("Name")) : MsgDoc.Add("Status", "Unknown") : IDX.Insert(MsgDoc)
                Dim DIR_New As New CLS.DIR(Eintrag("Name"), Eintrag("Category"), Eintrag("URL"), Eintrag("Refresh"), Eintrag("Watch"), DIR, TDIR, MsgDoc)
                AddHandler DIR_New.Initialized, AddressOf DIRNextInit : DIRLIST.Add(DIR_New)
            Next
            DIRNextInit()
        End If

        ' -------------------------------------------------------
        ' Bereinige alle unnötigen Postfixe
        ' -------------------------------------------------------
        If StartPostClean = True Then
            Console.WriteLine("#DIR: Entferne ungültige Postfixe")
            Dim DBPre As Integer = DIR.Count
            Dim N As New List(Of IMongoQuery)
            For Each eintrag In MimeTypes.RemoTypes : N.Add(Query.EQ(eintrag("Field"), eintrag("Value"))) : Next
            DIR.Remove(Query.Or(N))
            Dim DBAft As Integer = DIR.Count
            Console.WriteLine("#DIR: {0} von {1} Einträgen gelöscht (Postfixe)", DBPre - DBAft, DBPre)
        End If

        ' ------------------------------------------------------------
        ' System Trigger für CleanUp (Minuten)
        ' ------------------------------------------------------------
        If CollectGarbage = True Then
            Dim GCCTrigger As New System.Timers.Timer : GCCTrigger.Interval = 10 * 60 * 1000 : AddHandler GCCTrigger.Elapsed, AddressOf gccCollect : GCCTrigger.Start()
        End If

        Do : Thread.Sleep(60 * 1000) : Loop

    End Sub

    Private Sub gccCollect(ByVal sender As Object, ByVal e As Timers.ElapsedEventArgs)
        Dim Watch As New Stopwatch : Watch.Start()
        System.GC.Collect()
        Console.WriteLine(".SYS: Garbage Collection ausgeführt")
    End Sub

    Public Sub LogStatus(ByVal Text As String)
        Console.WriteLine(Text)
        If IsNothing(MSG) Then Exit Sub
        Dim MsgDoc As New BsonDocument
        MsgDoc.Add("Type", "STAT")
        MsgDoc.Add("Status", Text)
        MsgDoc.Add("Time", New BsonDateTime(Now))
        MsgDoc.Add("Name", "System")
        MSG.Insert(MsgDoc)
    End Sub

    Public Sub GetWebs(ByVal RawData As CLS.WBS.Server.MessageDecoder, ByVal Connection As Net.Sockets.Socket)

        Dim Cont As String = ""     ' Zu sendender Inhalt
        Dim SuTE As String = "0"    ' Such ID (Parameter oder Neu)
        Dim SuID As String = 0
        Dim NewS As Boolean = False ' Neue Suche gestartet ?
        Dim Resu As New List(Of Dictionary(Of String, String))

        ' ###############################################################
        ' Vorbereitung
        ' ###############################################################
        If RawData.ReqURLPath.Contains("api\query") Then
            Cont = "{""sid""" & ":" & """" & 0 & """}"
            If RawData.ReqURLGets.Count > 0 Then
                If RawData.ReqURLGets.ContainsKey("sid") = True Then
                    If RawData.ReqURLGets("sid") <> "" Then
                        Dim QRYDoc As BsonDocument = QRY.FindOneByIdAs(Of BsonDocument)(New BsonObjectId(New ObjectId(RawData.ReqURLGets("sid"))))
                        If IsNothing(QRYDoc) Then
                            ' ---------------------------------
                            ' Neue Such-ID
                            ' ---------------------------------
                            Cont = "{""sid""" & ":" & """" & 0 & """}"
                            NewS = True
                        Else
                            ' ---------------------------------
                            ' bekannte Such-ID
                            ' ---------------------------------
                            SuTE = QRYDoc("Query").ToString()
                            NewS = False
                        End If
                    End If
                End If
            End If

            ' ###############################################################
            ' Hauptaufgabe
            ' ###############################################################
            Select Case RawData.ReqURLPath
                Case "api\query\msg" : Cont = CLS.DBS.MongoDB.QueryFull(MSG) : LogStatus(".WEB: " & RawData.ReqURLPath)
                Case "api\query\mrk" : Cont = CLS.DBS.MongoDB.QueryFull(MRK) : LogStatus(".WEB: " & RawData.ReqURLPath)
                Case "api\query\qry" : Cont = CLS.DBS.MongoDB.QueryFull(QRY) : LogStatus(".WEB: " & RawData.ReqURLPath)
                Case "api\query\idx" : Cont = CLS.DBS.MongoDB.QueryFull(IDX) : LogStatus(".WEB: " & RawData.ReqURLPath)

                Case "api\query\dir"
                    Dim DBTimer As New System.Diagnostics.Stopwatch : DBTimer.Start() : Dim IElem As Integer = 30
                    Dim CResults As Integer = CLS.DBS.MongoDB.QueryTextCount(DIR, {SuTE})
                    Resu = CLS.DBS.MongoDB.QueryText(DIR, {SuTE}, IElem, RawData.ReqURLGets("pid"))
                    Dim Info As New Dictionary(Of String, String)
                    Info.Add("Start", RawData.ReqURLGets("pid") * IElem)
                    Info.Add("Page", RawData.ReqURLGets("pid"))
                    Info.Add("Pages", Math.Round(CResults / IElem, 0))
                    Info.Add("Count", CResults)
                    Info.Add("DBTime", Math.Round(DBTimer.Elapsed.TotalSeconds, 0).ToString) : DBTimer.Stop()
                    Cont = JSONArray2("Messages", Info, Resu) : LogStatus(".DIR: " & SuTE)
                    LogStatus(".DIR: " & SuTE)

                Case "api\query\fil"
                    Dim DBTimer As New System.Diagnostics.Stopwatch : DBTimer.Start() : Dim IElem As Integer = 30
                    Dim CResults As Integer = CLS.DBS.MongoDB.QueryTextCount(FIL, {SuTE})
                    Resu = CLS.DBS.MongoDB.QueryText(FIL, {SuTE})
                    Dim Info As New Dictionary(Of String, String)
                    Info.Add("Start", RawData.ReqURLGets("pid") * IElem)
                    Info.Add("Page", RawData.ReqURLGets("pid"))
                    Info.Add("Pages", Math.Round(CResults / IElem, 0))
                    Info.Add("Count", CResults)
                    Info.Add("DBTime", Math.Round(DBTimer.Elapsed.TotalSeconds, 0).ToString) : DBTimer.Stop()
                    Cont = JSONArray2("Messages", Info, Resu)
                    LogStatus(".FIL: " & SuTE)

                Case "api\query\rss"
                    Dim DBTimer As New System.Diagnostics.Stopwatch : DBTimer.Start() : Dim IElem As Integer = 30
                    Dim CResults As Integer = CLS.DBS.MongoDB.QueryTextCount(RSS, {SuTE})
                    Resu = CLS.DBS.MongoDB.QueryText(RSS, {SuTE})
                    Dim Info As New Dictionary(Of String, String)
                    Info.Add("Start", RawData.ReqURLGets("pid") * IElem)
                    Info.Add("Page", RawData.ReqURLGets("pid"))
                    Info.Add("Pages", Math.Round(CResults / IElem, 0))
                    Info.Add("Count", CResults)
                    Info.Add("DBTime", Math.Round(DBTimer.Elapsed.TotalSeconds, 0).ToString) : DBTimer.Stop()
                    Cont = JSONArray2("Messages", Info, Resu)
                    LogStatus(".RSS: " & SuTE)

                Case "api\query\web"
                    Dim DBTimer As New System.Diagnostics.Stopwatch : DBTimer.Start() : Dim IElem As Integer = 50
                    Dim CResults As Integer = CLS.DBS.MongoDB.QueryTextCount(TWEB, {SuTE})
                    Resu = CLS.DBS.MongoDB.QueryText(TWEB, {SuTE})
                    Dim Info As New Dictionary(Of String, String)
                    Info.Add("Start", RawData.ReqURLGets("pid") * IElem)
                    Info.Add("Page", RawData.ReqURLGets("pid"))
                    Info.Add("Pages", Math.Round(CResults / IElem, 0))
                    Info.Add("Count", CResults)
                    Info.Add("DBTime", Math.Round(DBTimer.Elapsed.TotalSeconds, 0).ToString) : DBTimer.Stop()
                    Cont = JSONArray2("Messages", Info, Resu)
                    LogStatus(".WEB: " & SuTE)

                    ' --------------------------------------------------------------------
                    ' Hier die Setter aus der Datenbank
                    ' --------------------------------------------------------------------
                Case "api\query\save"
                    Dim Doc As New BsonDocument("Save", RawData.ReqContent("Data"))
                    Dim Res As WriteConcernResult = MRK.Insert(Of BsonDocument)(Doc)
                    Cont = "{""sid""" & ":" & """" & Doc("_id").ToString & """}"
                    LogStatus(".WEB: " & Cont)

                Case "api\query\search"
                    Dim Doc As New BsonDocument("Query", RawData.ReqContent("Data"))
                    Dim Res As WriteConcernResult = QRY.Insert(Of BsonDocument)(Doc)
                    Cont = "{""sid""" & ":" & """" & Doc("_id").ToString & """}"
                    NewS = True : SuTE = RawData.ReqContent("Data") : SuID = Doc("_id").ToString
                    LogStatus(".WEB: " & Cont)

                    ' ----------------------------------------------------
                    ' Datei öffnen
                    ' ----------------------------------------------------
                Case "api\query\start"
                    Dim Doc As String = RawData.ReqContent("Data").Replace("+", " ")
                    If My.Computer.FileSystem.FileExists(Doc) Then
                        Dim PRC As New ProcessStartInfo
                        PRC.UseShellExecute = True
                        PRC.FileName = Doc
                        PRC.WindowStyle = ProcessWindowStyle.Maximized
                        Process.Start(PRC)
                    End If

                    ' ----------------------------------------------------
                    ' Ordner der Datei im Windows-Explorer öffnen
                    ' ----------------------------------------------------
                Case "api\query\openf"
                    Dim Doc As String = RawData.ReqContent("Data").Replace("+", " ")
                    If My.Computer.FileSystem.FileExists(Doc) Then
                        Dim PRC As New ProcessStartInfo
                        PRC.UseShellExecute = True
                        PRC.FileName = "Explorer.exe "
                        PRC.Arguments = Mid(Doc, 1, InStrRev(Doc, "\") - 1)
                        PRC.WindowStyle = ProcessWindowStyle.Maximized
                        Process.Start(PRC)
                    End If

                Case "api\query\webpages" : Cont = WEBINCL.ToString
                Case "api\query\overview" : Cont = My.Computer.FileSystem.ReadAllText(Environment.CurrentDirectory & "\WebContent\" & "JsonTest\Overview.json")
                Case "api\query\bookmarks" : Cont = My.Computer.FileSystem.ReadAllText(Environment.CurrentDirectory & "\WebContent\" & "JsonTest\Merker.json")
                Case "api\query\creators" : Cont = My.Computer.FileSystem.ReadAllText(Environment.CurrentDirectory & "\WebContent\" & "JsonTest\Creators.json")

            End Select
        End If

        Dim WebRes As New CLS.WBS.Server.AsyncSender(Connection, Cont, RawData)
        Dim THRes As New Threading.Thread(AddressOf WebRes.SendContent) : THRes.Start()

        ' ###############################################################
        ' Nacharbeit
        ' ###############################################################
        Select Case RawData.ReqURLPath
            Case "api\query\dir"
                For Each Eintrag In Resu
                    If Eintrag("ContentThumb") <> "" Then
                        If My.Computer.FileSystem.FileExists(Environment.CurrentDirectory & "\WebContent\" & Eintrag("ContentThumb")) = False Then
                            Dim TPath As String = Environment.CurrentDirectory & "\WebContent\" & Eintrag("ContentThumb")
                            Dim t As New Filetypes2.ThumbCreator(Eintrag("objLink").Replace("http://localhost:9090/", ""), TPath)
                            Console.WriteLine(".THB: Erstelle Thumb für " & Eintrag("objName"))
                            t.CreateThumb() ' Dim TH As New Thread(AddressOf t.CreateThumb) : TH.Start()
                            Console.WriteLine(".THB: Thumb erstellt: " & Eintrag("ContentThumb"))
                        End If
                    End If
                Next

            Case "api\query\search"
                If NewS = True Then
                    TWEB.RemoveAll()
                    For Each WebPre In WEBLIST
                        WebPre.Search(SuTE, SuID)
                    Next
                End If
        End Select

    End Sub

    Private Sub DIRNextInit()
        Dim DIRInits As List(Of CLS.DIR) = DIRLIST.FindAll(Function(s) s._IsInitializing = True)
        If DIRInits.Count > 0 Then Console.WriteLine(".DIR: (Refresh, Watch) Es wird auf Initialisierungsfertigstellung gewartet") : Exit Sub

        Dim DIRNext As List(Of CLS.DIR) = DIRLIST.FindAll(Function(s) s._IsInitDone = False)
        If DIRNext.Count > 0 Then DIRNext(0).Init_Empty() : Exit Sub

        Dim DIRWatches As List(Of CLS.DIR) = DIRLIST.FindAll(Function(s) s._IsWatching = False)
        For Each eintrag In DIRWatches : eintrag.Init_Watch() : Next

        Dim DIRRefreshes As List(Of CLS.DIR) = DIRLIST.FindAll(Function(s) s._IsRefreshing = False)
        For Each eintrag In DIRWatches : eintrag.Init_Refresh() : Next
    End Sub

End Module
