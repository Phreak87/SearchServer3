Imports Newtonsoft.Json

Public Class Helper
    Public Shared Function XMLToJSONArray(ByVal XML As System.Xml.XmlNode) As String
        Return JsonConvert.SerializeXmlNode(XML)
    End Function

    Overloads Shared Function XMLToListofStringDictionary(ByVal XML As System.Xml.XmlDocument, ByVal XPath As String, ByVal Fields As String())
        Dim Nodes As System.Xml.XmlNodeList = XML.SelectNodes(XPath)
        Dim Result As New List(Of Dictionary(Of String, String))
        If Nodes.Count = 0 Then Return New List(Of Dictionary(Of String, String))
        For Each Node As System.Xml.XmlNode In Nodes
            Dim Entry As New Dictionary(Of String, String)
            For Each Eintrag In Fields
                If IsNothing(Node.Attributes(Eintrag)) Then
                    Entry.Add(Eintrag, Node.InnerText)
                Else
                    Entry.Add(Eintrag, Node.Attributes(Eintrag).Value)
                End If
            Next
            Result.Add(Entry)
        Next
        Return Result
    End Function
    Overloads Shared Function XMLNodeToStringDictionary(ByVal XML As System.Xml.XmlNode)
        Dim Result As New Dictionary(Of String, String)
        If XML.Attributes.Count = 0 Then Return New List(Of Dictionary(Of String, String))
        Dim Entry As New Dictionary(Of String, String)
        For Each Attribute As System.Xml.XmlAttribute In XML.Attributes
            Result.Add(Attribute.Name, Attribute.Value)
        Next
        Return Result
    End Function

End Class
