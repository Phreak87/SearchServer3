Imports MongoDB.Driver
Imports MongoDB.Bson
Imports MongoDB.Driver.Builders
Imports Newtonsoft.Json.Linq
Imports Newtonsoft.Json
Imports System.IO
Imports System.Text

Namespace CLS
    Class DBS
        Public Class DBResult
            Dim _Results As List(Of DOC)
            Dim _Raw As WBS.Server.MessageDecoder
            Dim _SQuery As String = ""
            Dim _StartEntry As Integer = 0 '    Starteintrag (1)
            Dim _StopEntry As Integer = 0 '     Endeintrag (30)
            Dim _DBEntrys As Integer = 0 '      Datenbankeinträge Gesamt
            Dim _QRYEntrys As Integer = 0 '     Datenbankeinträge Abfrage
            Dim _StartPage As Integer = 0 '     Startseite (1)
            Dim _StopPage As Integer = 0 '      Endseite (50)

            Dim _DBTimeGes As Integer = 0 '     Gesamter Abfragezeitraum
            Dim _DBTimeQry As Integer = 0 '     Abfragezeitraum bis MaxEntry
            Dim _DBTimeQryC As Integer = 0 '    Abfragezeitraum Max. Sucheinträge
            Dim _DBTimeGesC As Integer = 0 '    Abfragezeitraum Max. Datenbankeinträge

            Sub New()

            End Sub
            Sub New(ByVal Results As List(Of DOC), ByVal Eintrag_von As Integer, ByVal Eintrag_bis As Integer, ByVal Einträge_DB As Integer, ByVal Einträge_Suche As Integer, ByVal Seite_Aktuell As Integer, ByVal Seite_Ende As Integer, ByVal Abfragezeitraum As Integer, SQuery As String, Raw As WBS.Server.MessageDecoder)
                _Results = Results
                _StartEntry = Eintrag_von
                _StopEntry = Eintrag_bis
                _DBEntrys = Einträge_DB
                _QRYEntrys = Einträge_Suche
                _StartPage = Seite_Aktuell
                _StopPage = Seite_Ende
                _DBTimeGes = Abfragezeitraum
                _SQuery = SQuery
                _Raw = Raw
            End Sub

            Function ToJson() As String
                Dim i As Integer = 0
                Dim SB As New StringBuilder
                Dim SW As New StringWriter(SB)
                Dim D As New JsonTextWriter(SW)
                Dim Eval As New EVL

                D.Formatting = Formatting.None
                D.WriteStartObject()
                D.WritePropertyName("SQuery") : D.WriteValue(_SQuery)
                ' D.WritePropertyName("RawReq") : D.WriteValue(Newtonsoft.Json.JsonConvert.SerializeObject(_Raw))
                D.WritePropertyName("EntryFrom") : D.WriteValue(_StartEntry)
                D.WritePropertyName("EntryTo") : D.WriteValue(_StopEntry)
                D.WritePropertyName("EntryCount") : D.WriteValue(_QRYEntrys)
                D.WritePropertyName("EntryDB") : D.WriteValue(_DBEntrys)
                D.WritePropertyName("Page") : D.WriteValue(_StartPage)
                D.WritePropertyName("Pages") : D.WriteValue(_StopPage)
                D.WritePropertyName("DBTime") : D.WriteValue(_DBTimeGes)
                D.WritePropertyName("Messages")
                D.WriteStartArray()
                If Eval.MathResult(_SQuery) <> "" Then
                    _Results.Insert(0, New DOC("Math", "Math", "Math", "Evaluation: " & _SQuery, "", Eval.MathResult(_SQuery), ".", Now))
                End If
                For Each Eintrag In _Results
                    i = i + 1
                    If Eintrag.Class_Type = "DIR" Then Eintrag.Cont_Link = _Raw.ReqReferrer & Eintrag.Cont_Link
                    Eintrag.Cont_Thumb = _Raw.ReqReferrer & Eintrag.Cont_Thumb
                    D.WriteRaw(Newtonsoft.Json.JsonConvert.SerializeObject(Eintrag))
                    If i < _Results.Count Then D.WriteRaw(",")
                Next
                D.WriteEndArray()
                D.WriteEndObject()
                Return SB.ToString
            End Function

            Public Property GetCollection
                Get
                    Return _Results
                End Get
                Set(ByVal value)
                    _Results = value
                End Set
            End Property
        End Class

        Public Class MongoDB
            Event Status(ByVal Message As String)
            Sub Startmongo(WiredTiger As Boolean)
                Dim AppPath As String = Environment.CurrentDirectory & "\Bins\"
                Dim MongoD As String = "Mongod.exe"

                Dim PRCL As Process() = Process.GetProcessesByName(MongoD.Replace(".exe", ""))
                If PRCL.Count = 0 Then
                    RaiseEvent Status(".DBS: Start MongoDB Server")
                    Dim PStart As New ProcessStartInfo
                    PStart.WindowStyle = ProcessWindowStyle.Hidden
                    PStart.FileName = AppPath & MongoD
                    PStart.Arguments = "--dbpath data\db --nojournal --quiet --rest --jsonp " & IIf(WiredTiger = True, "--storageEngine wiredTiger", "") '  --rest --jsonp
                    PStart.WorkingDirectory = AppPath
                    Dim PRC As Process = Process.Start(PStart)
                    RaiseEvent Status(".DBS: ProcessID: " & PRC.Id)
                    RaiseEvent Status(".DBS: MongoPath: " & MongoD)
                    RaiseEvent Status(".DBS: Arguments: " & PRC.StartInfo.Arguments)
                Else
                    Console.WriteLine(".DBS: Mongo instance running at PID: {0}", PRCL(0).Id)
                    Console.WriteLine(".DBS: using running Mongo instance")
                End If
            End Sub
            Sub Stopmongo()
                Dim AppPath As String = Environment.CurrentDirectory & "\Bins\"
                Dim MongoD As String = "Mongod.exe"

                Console.WriteLine(".DBS: Stopping all running Mongo instances")
                Dim PRCL As Process() = Process.GetProcessesByName(MongoD.Replace(".exe", ""))
                If PRCL.Count > 0 Then
                    PRCL(0).Kill()
                    Do Until PRCL(0).HasExited = True : Threading.Thread.Sleep(1000) : Loop
                End If
                Threading.Thread.Sleep(500)
            End Sub
            Sub KillmongoDBS()
                Console.WriteLine(".DBS: Deleting all database contents")

                If My.Computer.FileSystem.DirectoryExists(Environment.CurrentDirectory & "\bins\data\db") Then
                    Console.WriteLine("Deleting data directory")
                    My.Computer.FileSystem.DeleteDirectory(Environment.CurrentDirectory & "\bins\data\db", FileIO.DeleteDirectoryOption.DeleteAllContents)
                    Do Until My.Computer.FileSystem.DirectoryExists(Environment.CurrentDirectory & "\bins\data\db") = False : Loop
                End If

                If My.Computer.FileSystem.DirectoryExists(Environment.CurrentDirectory & "\Webcontent\Thimage") Then
                    Console.WriteLine("Deleting image directory")
                    My.Computer.FileSystem.DeleteDirectory(Environment.CurrentDirectory & "\Webcontent\Thimage", FileIO.DeleteDirectoryOption.DeleteAllContents)
                    Do Until My.Computer.FileSystem.DirectoryExists(Environment.CurrentDirectory & "\Webcontent\Thimage") = False : Loop
                End If

                My.Computer.FileSystem.CreateDirectory(Environment.CurrentDirectory & "\bins\data\db")
                Console.WriteLine("Waiting for data directory")
                Do Until My.Computer.FileSystem.DirectoryExists(Environment.CurrentDirectory & "\bins\data\db") = True : Loop

                My.Computer.FileSystem.CreateDirectory(Environment.CurrentDirectory & "\Webcontent\Thimage")
                Console.WriteLine("Waiting for image directory")
                Do Until My.Computer.FileSystem.DirectoryExists(Environment.CurrentDirectory & "\Webcontent\Thimage") = True : Loop

                Threading.Thread.Sleep(500)
            End Sub
            Sub Rapairmongo()
                Dim AppPath As String = Environment.CurrentDirectory & "\Bins\"
                Dim MongoD As String = "Mongod.exe"

                RaiseEvent Status(".DBS: Start MongoDB Server in repair mode")
                Dim PStart As New ProcessStartInfo
                PStart.WindowStyle = ProcessWindowStyle.Hidden
                PStart.FileName = AppPath & MongoD
                PStart.Arguments = "--dbpath data\db --repair" '  --httpinterface --rest --jsonp
                PStart.WorkingDirectory = AppPath
                Dim PRC As Process = Process.Start(PStart)
                RaiseEvent Status(".DBS: ProcessID: " & PRC.Id)
                RaiseEvent Status(".DBS: MongoPath: " & MongoD)
                RaiseEvent Status(".DBS: Arguments: " & PRC.StartInfo.Arguments)
                Do Until PRC.HasExited = True : Console.Write(".") : Loop
            End Sub
            Shared Function QueryFull(ByVal DB As MongoCollection) As String
                If IsNothing(DB) Then Return ""
                Dim R As MongoCursor(Of BsonDocument) = DB.FindAllAs(Of BsonDocument)().SetLimit(20).SetSortOrder(SortBy.Descending("Time"))
                Dim D As New List(Of Dictionary(Of String, String))
                For Each Eintrag In R
                    Dim D2 As New Dictionary(Of String, String)
                    For Each Field In Eintrag
                        D2.Add(Field.Name, Field.Value.ToString)
                    Next
                    D.Add(D2)
                Next
                Return CLS.WBS.JSONEncoder.JSONArray("Messages", D)
            End Function

            Shared Function QueryText(ByVal DB As MongoCollection,
                                      ByVal Search As String(),
                                      ByVal MaxResults As Integer,
                                      ByVal StartAt As Integer,
                                      Field As String, _
                                      Raw As WBS.Server.MessageDecoder,
                                      Optional Order As String = "") _
                                      As DBResult

                If IsNothing(DB) Then Return Nothing

                Dim QL As New List(Of IMongoQuery)
                For Each Eintrag In Split(Search(0), " ")
                    Dim Q As IMongoQuery = Query.Matches(Field, "/" & Eintrag & "/i") : QL.Add(Q)
                Next
                Dim Q2 As IMongoQuery = Query.And(QL)
                Dim Skip As Integer = StartAt * MaxResults : If Skip < 0 Then Skip = 0

                Dim _DBTimeGes As Integer = 0 '     Gesamter Abfragezeitraum
                Dim _DBTimeQry As Integer = 0 '     Abfragezeitraum bis MaxEntry
                Dim _DBTimeQryC As Integer = 0 '    Abfragezeitraum Max. Sucheinträge
                Dim _DBTimeGesC As Integer = 0 '    Abfragezeitraum Max. Datenbankeinträge

                Dim StopGes As New System.Diagnostics.Stopwatch : StopGes.Start()

                Dim R As MongoCursor(Of DOC) = DB.FindAs(Of DOC)(Q2).SetLimit(MaxResults).SetSkip(Skip).SetSortOrder(SortBy.Descending("Cont_Name"))
                _DBTimeQry = StopGes.Elapsed.TotalSeconds.ToString : StopGes.Restart()

                Dim CGes As Integer = DB.Count(Q2)
                Dim CQry As Integer = IIf(CGes > MaxResults, MaxResults, CGes)
                _DBTimeQryC = StopGes.Elapsed.TotalSeconds.ToString : StopGes.Restart()

                Dim CDbs As Integer = DB.Count
                _DBTimeGesC = StopGes.Elapsed.TotalSeconds.ToString : StopGes.Restart()
                _DBTimeGes = _DBTimeGesC + _DBTimeQry + _DBTimeQryC

                Dim R2 As New List(Of DOC) : For Each Eintrag In R : R2.Add(Eintrag) : Next
                Dim RE As New DBResult(R2, StartAt * CQry, (StartAt * CQry) + CQry, CDbs, CGes, StartAt, Math.Ceiling(CGes / MaxResults) - 1, _DBTimeGes, Search(0), Raw)
                Return RE

            End Function


        End Class
    End Class
End Namespace

