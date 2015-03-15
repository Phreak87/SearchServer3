Imports Microsoft.Win32

Public Class Mimes
    Private MimeTypes As New List(Of Dictionary(Of String, String))
    Public RemoTypes As New List(Of Dictionary(Of String, String))
    Private URLTypes As New List(Of Dictionary(Of String, String))

    Sub New()
        If My.Computer.FileSystem.FileExists("Config\Mimes.xml") Then
            Dim XMLMime As New Xml.XmlDocument : XMLMime.Load("Config\Mimes.xml")
            MimeTypes = ListofStringDictionary(XMLMime, "WebSearch/MimeTypes/MimeType", {"Postfix", "Mimetype", "Player", "CacheSec", "CreateThumb", "Description"})
            XMLMime = Nothing
        End If

        If My.Computer.FileSystem.FileExists("Config\Cleaner.xml") Then
            Dim XMLRemo As New Xml.XmlDocument : XMLRemo.Load("Config\Cleaner.xml")
            RemoTypes = ListofStringDictionary(XMLRemo, "WebSearch/Clean", {"Collection", "Field", "Value"})
            XMLRemo = Nothing
        End If

        If My.Computer.FileSystem.FileExists("Config\urlconf.xml") Then
            Dim XMLURLs As New Xml.XmlDocument : XMLURLs.Load("Config\urlconf.xml")
            URLTypes = ListofStringDictionary(XMLURLs, "WebSearch/URLParts/URLPart", {"Text", "Player"})
            XMLURLs = Nothing
        End If
    End Sub

    Function GetAllFor(ByVal Postfix As String) As Dictionary(Of String, String)
        Return FindOne(Postfix)
    End Function
    Function GetPlayerFor(ByVal Postfix As String) As String
        Return FindOne(Postfix)("Player")
    End Function
    Function GetOnlinePlayerFor(ByVal URLStart As String) As String
        Return FindOneOnline(URLStart)("Player")
    End Function
    Function GetMimeFor(ByVal Postfix As String) As String
        Return FindOne(Postfix)("Mimetype")
    End Function
    Function GetCacheFor(ByVal Postfix As String) As String
        Return FindOne(Postfix)("CacheSec")
    End Function
    Function GetThumbFor(ByVal Postfix As String) As String
        Return FindOne(Postfix)("CreateThumb")
    End Function

    Private Function FindOneOnline(ByVal URLStart As String) As Dictionary(Of String, String)
        URLStart = URLStart.ToLower

        Dim OUT As New Dictionary(Of String, String)
        Dim LST As List(Of Dictionary(Of String, String)) = URLTypes.FindAll(Function(S) URLStart.StartsWith(S("Text").ToLower))
        Select Case LST.Count
            Case 0
                OUT.Add("URL", URLStart)
                OUT.Add("Player", "NoPlayer")
                Return OUT
            Case 1
                Return LST(0)
            Case Is > 1
                Console.WriteLine("#MIM: Duplikate in Mimetypes für " & URLStart)
                Return LST(0)
        End Select
        Return Nothing
    End Function
    Private Function FindOne(ByVal Postfix As String) As Dictionary(Of String, String)
        If Postfix.StartsWith(".") = False Then Postfix = "." & Postfix : Postfix = Postfix.ToLower

        Dim OUT As New Dictionary(Of String, String)
        Dim LST As List(Of Dictionary(Of String, String)) = MimeTypes.FindAll(Function(S) S("Postfix").ToLower = Postfix.ToLower)
        Select Case LST.Count
            Case 0
                If IsNothing(MimeFromRegistry(Postfix)) Then
                    OUT.Add("Mimetype", "Application/octet-stream")
                Else
                    OUT.Add("Mimetype", MimeFromRegistry(Postfix))
                End If
                OUT.Add("Postfix", Postfix)
                OUT.Add("Player", "NoPlayer")
                OUT.Add("CacheSec", "0")
                OUT.Add("CreateThumb", "False")
                OUT.Add("Description", "None")
                Return OUT
            Case 1
                Return LST(0)
            Case Is > 1
                Console.WriteLine("#MIM: Duplikate in Mimetypes für " & Postfix)
                Return LST(0)
        End Select
        Return Nothing
    End Function
    Private Function MimeFromRegistry(ByVal extension As String) As String
        Dim classroot As RegistryKey = Registry.ClassesRoot
        Dim extkey As RegistryKey = classroot.OpenSubKey(extension, False)
        If Not IsNothing(extkey) Then
            Dim Type As Object = extkey.GetValue("Content Type")
            If Not IsNothing(Type) Then
                Return Type.ToString
            End If
            Return Nothing
        End If
        Return Nothing
    End Function
    Public Shared Function ListofStringDictionary(ByVal XML As System.Xml.XmlDocument, ByVal XPath As String, ByVal Fields As String())
        Dim Nodes As System.Xml.XmlNodeList = XML.SelectNodes(XPath)
        Dim Result As New List(Of Dictionary(Of String, String))
        If Nodes.Count = 0 Then Return New List(Of Dictionary(Of String, String))
        For Each Node As System.Xml.XmlNode In Nodes
            Dim Entry As New Dictionary(Of String, String)
            For Each Eintrag In Fields
                If IsNothing(Node.Attributes(Eintrag)) Then
                    Entry.Add(Eintrag, "")
                Else
                    Entry.Add(Eintrag, Node.Attributes(Eintrag).Value)
                End If
            Next
            Result.Add(Entry)
        Next
        Return Result
    End Function
End Class
