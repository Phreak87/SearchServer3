Imports MongoDB.Driver
Imports MongoDB.Bson

Namespace CLS
    Public Class WEB

        Public _This = "WEB"
        Public _ClassName As String = "Google"
        Public _ClassGroup As String = "Allgemein"
        Public _ClassType As String = "JSON"
        Event _Received(Liste As List(Of Dictionary(Of String, String)), Klasse As WEB)

        Public _XPath As String = "/XMLRoot"
        Public _RelTitle As String = "/Title"
        Public _RelURL As String = "/Url"
        Public _RelCon As String = "/Description"
        Public _Datenbank As MongoDB.Driver.MongoCollection(Of MongoDB.Bson.BsonDocument)

        Public _SourcePath As String

        Sub New(ByVal URL As String, ByVal Name As String, ByVal Gruppe As String, XPath As String, RelT As String, RelL As String, RELC As String, Type As String, Coll As MongoDB.Driver.MongoCollection)
            _SourcePath = URL
            _ClassName = Name
            _ClassGroup = Gruppe
            _XPath = XPath
            _RelTitle = RelT
            _RelURL = RelL
            _RelCon = RELC
            _ClassType = Type
            _Datenbank = Coll
        End Sub

        Sub Search(KeyWords As String, SID As String)
            Dim Rec As New WebSearch(KeyWords, Me, SID)
            AddHandler Rec.ReceivedEvent, AddressOf Received
            Dim THRec As New Threading.Thread(AddressOf Rec.Search)
            THRec.Start()
        End Sub

        Private Sub Received(Liste As List(Of Dictionary(Of String, String)), Klasse As WEB, SID As String)
            If Liste.Count = 0 Then Exit Sub
            Dim MSGs As New List(Of BsonDocument)

            For Each eintrag In Liste
                Dim F As New BsonDocument
                F.Add("_SID", New ObjectId(SID))
                F.Add("SourceClassType", "WEB")
                F.Add("SourceClassName", Klasse._ClassName)
                F.Add("SourceClassGroup", Klasse._ClassGroup)
                F.Add("objName", eintrag("Titel"))
                F.Add("objLink", eintrag("URL"))
                F.Add("objContent", eintrag("Inhalt"))
                F.Add("SourceFileType", "Link")
                F.Add("ContentTime", New BsonDateTime(Now))
                F.Add("ContentThumb", "No_Thumb (WEB)")
                F.Add("ContentType", MimeTypes.GetOnlinePlayerFor(eintrag("URL")))
                MSGs.Add(F)
            Next

            _Datenbank.InsertBatch(MSGs)
            Console.WriteLine(".WEB: Written {0} Web Search Results from {1} to TMP", Liste.Count, Klasse._ClassName)

        End Sub

        Class WebSearch
            Dim _KeyWords As String
            Dim _SID As String = ""
            Dim _CLS As WEB
            Event ReceivedEvent(Liste As List(Of Dictionary(Of String, String)), Klasse As WEB, SID As String)

            Sub New(Keywords As String, Klasse As WEB, SID As String)
                _KeyWords = Keywords
                _CLS = Klasse
                : _SID = SID
            End Sub

            Public Sub Search()
                ' -------------------------------------------------------------------
                ' NewFrame  Seiten, die in einem extra Fenster geöffnet werden
                ' SameFrame Seiten, die im aktuellen Frame dargestellt werden
                ' PFrame    Frames, die an den Parser (XPath) weitergeleitet werden
                ' DFrame    Frames, die nicht an den Parser weitergeleitet werden
                ' JSON      JSON-Responses des Webservers
                ' XML       XML-Responses des Webservers
                ' -------------------------------------------------------------------
                If IsNothing(_CLS) Then Exit Sub
                If IsNothing(_CLS._ClassType) Then Exit Sub

                Dim Res As New List(Of Dictionary(Of String, String))
                Dim URL As String = _CLS._SourcePath
                URL = URL.Replace("{query}", _KeyWords)
                URL = URL.Replace("{index}", "1")

                Dim n As New Net.WebClient
                Dim sw As New Stopwatch : sw.Start()

                ' -----------------------------------------
                ' Result in String kapseln
                ' -----------------------------------------
                Dim resSTR As String = ""
                Try
                    resSTR = n.DownloadString(URL)
                Catch ex As Exception
                    Console.WriteLine("#WEB: {0} mit Fehler: {1}", _CLS._ClassName, ex.Message)
                    Exit Sub
                End Try

                ' -----------------------------------------
                ' Zu XML konvertieren
                ' -----------------------------------------
                Dim XMLNode As New Xml.XmlDocument
                Try
                    Select Case _CLS._ClassType
                        Case "JSON" : XMLNode = Newtonsoft.Json.JsonConvert.DeserializeXmlNode(resSTR.Replace("$", "").Replace("*", ""), "xmlns")
                        Case "XML" : XMLNode.LoadXml(resSTR)
                    End Select
                Catch ex As Exception
                    Console.WriteLine(ex.Message)
                    Console.WriteLine(resSTR)
                    Exit Sub
                End Try

                ' -----------------------------------------
                ' Loader 
                ' -----------------------------------------
                If _CLS._ClassType <> "HTML" Then
                    Try
                        For Each Eintrag As Xml.XmlNode In XMLNode.SelectNodes(_CLS._XPath)
                            Dim THRes As New Dictionary(Of String, String)
                            THRes.Add("URL", GetATT(Eintrag, _CLS._RelURL))
                            THRes.Add("Titel", GetATT(Eintrag, _CLS._RelTitle))
                            THRes.Add("Inhalt", GetATT(Eintrag, _CLS._RelCon))
                            Res.Add(THRes)
                        Next
                    Catch ex As Exception
                        Console.WriteLine("#WEB: {0} : Fehler {1}", _CLS._ClassName, ex.Message)
                    End Try
                Else
                    Dim HTMLDoc As New HtmlAgilityPack.HtmlDocument
                    HTMLDoc.LoadHtml(resSTR)
                End If

                RaiseEvent ReceivedEvent(Res, _CLS, _SID)
            End Sub

            Public Function GetATT(Eintrag As Xml.XmlNode, XPath As String) As String
                    If Not IsNothing(Eintrag.SelectSingleNode(XPath)) Then
                        Return Eintrag.SelectSingleNode(XPath).InnerText()
                    Else
                        Return ""
                    End If
            End Function
        End Class


    End Class
End Namespace

