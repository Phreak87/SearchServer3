Imports Microsoft.Win32

Public Class Mimes
    Private MimeTypes As New List(Of Dictionary(Of String, String))
    Public RemoTypes As New List(Of Dictionary(Of String, String))
    Private URLTypes As New List(Of Dictionary(Of String, String))

    Sub New()
        If My.Computer.FileSystem.FileExists("Config\Mimes.xml") Then
            Dim XMLMime As New Xml.XmlDocument : XMLMime.Load("Config\Mimes.xml")
            MimeTypes = ListofStringDictionary(XMLMime, "WebSearch/MimeTypes/MimeType", {"Postfix", "Mimetype", "Player", "Show", "CacheSec", "CreateThumb", "Description"})
            XMLMime = Nothing
        End If

        If My.Computer.FileSystem.FileExists("Config\Cleaner.xml") Then
            Dim XMLRemo As New Xml.XmlDocument : XMLRemo.Load("Config\Cleaner.xml")
            RemoTypes = ListofStringDictionary(XMLRemo, "WebSearch/Clean", {"Collection", "Field", "Value", "Description"})
        End If

        If My.Computer.FileSystem.FileExists("Config\urlconf.xml") Then
            Dim XMLURLs As New Xml.XmlDocument : XMLURLs.Load("Config\urlconf.xml")
            URLTypes = ListofStringDictionary(XMLURLs, "WebSearch/URLParts/URLPart", {"Text", "Player"})
            XMLURLs = Nothing
        End If
    End Sub

    Sub SaveRemo()
        Dim XMLRemo As New Xml.XmlDocument
        Dim Union As New List(Of String)
        Dim Root As Xml.XmlNode = XMLRemo.AppendChild(XMLRemo.CreateElement("WebSearch"))
        For Each Eintrag In RemoTypes
            Dim Find As String = Eintrag("Value")
            If Union.FindAll(Function(s) s = Find).Count >= 1 Then Continue For
            Dim Attc As Xml.XmlAttribute = XMLRemo.CreateAttribute("Collection") : Attc.Value = "DIR"
            Dim AttF As Xml.XmlAttribute = XMLRemo.CreateAttribute("Field") : AttF.Value = "Cont_Post"
            Dim AttP As Xml.XmlAttribute = XMLRemo.CreateAttribute("Value") : AttP.Value = Eintrag("Value")
            Dim AttD As Xml.XmlAttribute = XMLRemo.CreateAttribute("Description") : AttD.Value = Eintrag("Description")
            Dim APP As Xml.XmlNode = Root.AppendChild(XMLRemo.CreateElement("Clean"))
            APP.Attributes.Append(Attc)
            APP.Attributes.Append(AttF)
            APP.Attributes.Append(AttP)
            APP.Attributes.Append(AttD)
            Union.Add(Eintrag("Value"))
        Next
        XMLRemo.Save("Config\Cleaner.xml")
    End Sub

    Function Info(ByVal Query As String)
        Dim Out As String = ""
        Dim REG As String = "unbekannt"
        Dim Q1 As String = Query.ToLower
        Dim Q2 As String = ("." & Query).Replace("..", ".")
        If Query = "" Then Return ""
        If IsNumeric(Query) Then Return ""

        If Not IsNothing(MimeFromRegistry(Q2)) Then REG = "registriert als " & MimeFromRegistry(Q2)

        Dim LSTDESC As List(Of Dictionary(Of String, String)) = MimeTypes.FindAll(Function(s) s("Description") = (Q1))
        Dim LSTPOST As List(Of Dictionary(Of String, String)) = MimeTypes.FindAll(Function(s) s("Postfix") = (Q2))
        Dim LSTMIME As List(Of Dictionary(Of String, String)) = MimeTypes.FindAll(Function(s) s("Mimetype") = (Q1))

        If LSTDESC.Count > 0 Then
            For Each eintrag In LSTDESC
                Out = Out & "Postfix: " & eintrag("Postfix") & " " & REG & "<BR>"
                Out = Out & "Beschreibung: " & eintrag("Description") & "<BR>"
                Out = Out & "Mimetype: " & eintrag("Mimetype") & "<BR>"
                Out = Out & "Player: " & eintrag("Player") & "<BR>"
                Out = Out & "Thumbnails: " & eintrag("CreateThumb") & "<BR>"
                Out = Out & "Caching: " & eintrag("CacheSec") & "<BR><HR>"
            Next
        ElseIf LSTPOST.Count > 0 Then
            For Each eintrag In LSTPOST
                Out = Out & "Postfix: " & eintrag("Postfix") & " " & REG & "<BR>"
                Out = Out & "Beschreibung: " & eintrag("Description") & "<BR>"
                Out = Out & "Mimetype: " & eintrag("Mimetype") & "<BR>"
                Out = Out & "Player: " & eintrag("Player") & "<BR>"
                Out = Out & "Thumbnails: " & eintrag("CreateThumb") & "<BR>"
                Out = Out & "Caching: " & eintrag("CacheSec") & "<BR><HR>"
            Next
        ElseIf LSTMIME.Count > 0 Then
            For Each eintrag In LSTMIME
                Out = Out & "Postfix: " & eintrag("Postfix") & " " & REG & "<BR>"
                Out = Out & "Beschreibung: " & eintrag("Description") & "<BR>"
                Out = Out & "Mimetype: " & eintrag("Mimetype") & "<BR>"
                Out = Out & "Player: " & eintrag("Player") & "<BR>"
                Out = Out & "Thumbnails: " & eintrag("CreateThumb") & "<BR>"
                Out = Out & "Caching: " & eintrag("CacheSec") & "<BR><HR>"
            Next
        ElseIf Not IsNothing(MimeFromRegistry(Q2)) Then
            Out = Out & MimeFromRegistry(Q2)
        End If
        If Out = "" Then Return Out

        If RemoTypes.FindAll(Function(s) s("Value") = Q2).Count > 0 Then
            Out = Out & "Dieses Postfix ist Blacklisted"
        Else
            Out = Out & "Dieses Postfix ist zugelassen"
        End If

        Return Out
    End Function

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
                OUT.Add("Show", "None")
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
