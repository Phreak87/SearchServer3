Imports System.Net
Imports System.Text
Imports MongoDB.Bson
Imports MongoDB.Driver
Imports MongoDB.Driver.Builders

Namespace CLS

    Public Class RSS

        Public _This = "RSS"
        Public _ClassName As String = "Directory"
        Public _ClassGroup As String = "Allgemein"
        Public _ClassRoot As String = ""

        Public _Count As Integer
        Public _Collection As MongoCollection

        Public _Refresh As Integer = 0
        Private DateTime As Date = Now
        Private _Timer As Timers.Timer

        Public _DataStore As Object

        Sub New(ByVal Name As String, ByVal Group As String, ByVal Path As String, ByVal Refresh As Integer, ByVal Collection As MongoCollection)
            _ClassName = Name
            _ClassGroup = Group
            _ClassRoot = Path
            _Collection = Collection
            _Refresh = Refresh

            ' ----------------------------------------------
            ' Time based init
            ' ----------------------------------------------
            If _Refresh > 0 Then
                Console.WriteLine("#RSS: RSS-Update wird eingerichtet für " & _ClassName)
                Dim Starts As New System.Timers.Timer
                Starts.Interval = Refresh * 60 * 1000
                AddHandler Starts.Elapsed, AddressOf Start
                Starts.Start()
            End If

            ' ----------------------------------------------
            ' Empty Init
            ' ----------------------------------------------
            Dim Check As New QueryDocument
            Check.Add("Class_Name", _ClassName)
            If Collection.Count(Check) = 0 Then
                Console.WriteLine("#RSS: Keine Einträge für {0} - Erstelle Index", _ClassName)
                Start()
            End If
        End Sub

        Public Sub Start()
            Dim RSSResults As List(Of String()) = IndexRSS(_ClassRoot)

            If RSSResults.Count = 0 Then Exit Sub
            Dim DBPre As Integer = _Collection.Count
            Dim N As New List(Of IMongoQuery)
            For Each eintrag In RSSResults : N.Add(Query.EQ("Cont_Name", eintrag(0))) : Next
            _Collection.Remove(Query.Or(N))
            Dim DBAft As Integer = _Collection.Count
            Console.WriteLine("#RSS: Neue Feeds von {0} : {1} => {2}", _ClassName, DBPre, DBAft)

            For Each News In RSSResults
                Dim DOC As New DOC(_ClassName, "RSS", _ClassGroup, News(1), News(0), News(2), "Link", Now)
                _Collection.Insert(DOC)
            Next
            RSSResults = Nothing
        End Sub

        Private Sub Elapsed(sender As Object, e As Timers.ElapsedEventArgs)
            Start()
        End Sub

#Region "Indizierung"
        Private Function IndexRSS(URL As String) As List(Of String())
            Dim Res As New List(Of String())
            Dim WEB As New System.Net.WebClient
            Dim STR As String = ""
            Dim XML As New Xml.XmlDocument

            Try
                STR = WEB.DownloadString(URL)
                XML.LoadXml(STR.Replace("xmlns=""http://www.w3.org/2005/Atom""", ""))
            Catch ex As Exception
                Console.WriteLine(".RSS: " & ex.Message)
            End Try

            Dim RSSList As Xml.XmlNodeList = XML.SelectNodes("/rss/channel/item")
            If RSSList.Count = 0 Then RSSList = XML.SelectNodes("/feed/entry")

            For Each Eintrag As Xml.XmlNode In RSSList
                Dim Link As String = "" : If Not IsNothing(Eintrag.SelectSingleNode("link")) Then Link = Eintrag.SelectSingleNode("link").InnerText
                Dim Title As String = "" : If Not IsNothing(Eintrag.SelectSingleNode("title")) Then Title = Eintrag.SelectSingleNode("title").InnerText
                Dim Descr As String = "" : If Not IsNothing(Eintrag.SelectSingleNode("description")) Then Descr = Eintrag.SelectSingleNode("description").InnerText
                Dim PubDate As String = "" : If Not IsNothing(Eintrag.SelectSingleNode("pubdate")) Then PubDate = Eintrag.SelectSingleNode("pubdate").InnerText
                Dim Summary As String = "" : If Not IsNothing(Eintrag.SelectSingleNode("summary")) Then Summary = Eintrag.SelectSingleNode("summary").InnerText
                Res.Add({Link, Title, Descr, PubDate})
            Next

            Return Res
        End Function
#End Region

    End Class

End Namespace
