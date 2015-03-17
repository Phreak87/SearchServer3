Imports MongoDB.Bson
Imports MongoDB.Driver
Imports System.Threading
Imports Microsoft.VisualBasic.FileIO

Namespace CLS
    Public Class FIL
        Dim _ClassName As String = ""
        Dim _ClassGroup As String = ""
        Dim _Collect As MongoCollection

        Class CLS_Fil
            Public _Path As String
            Sub New(Path As String)
                _Path = Path
            End Sub
        End Class

        Sub New(Name As String, Group As String, Path As String, Collection As MongoCollection)
            _ClassName = Name
            _ClassGroup = Group
            _Collect = Collection

            Dim Remove As New QueryDocument
            Remove.Add("Class_Name", Name)
            Collection.Remove(Remove)

            Dim DoFile As New CLS_Fil(Path) : Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFile, DoFile)
        End Sub

        Sub IndexFile(ByVal _obj As CLS_Fil)
            Dim Res As New List(Of DOC)
            Dim i As Integer = 1
            If My.Computer.FileSystem.FileExists(_obj._Path) = False Then
                Console.WriteLine("#FIL: Datei nicht gefunden: " & _obj._Path)
                Exit Sub
            End If

            Console.WriteLine(".FIL: Interpretieren von " & _ClassName)
            Dim TFP1 As New TextFieldParser(_obj._Path)
            TFP1.Delimiters = {vbTab, "|", ";"}
            TFP1.HasFieldsEnclosedInQuotes = True
            While Not TFP1.EndOfData
                Dim Line As String = TFP1.ReadLine
                Dim DOC As New DOC(_ClassName, "FIL", _ClassGroup, "Zeile " & i & " " & Mid(Line, 1, 150), _obj._Path, PrePareLine(Line), "NoPost", Now)
                Res.Add(DOC)
            End While

            If Res.Count > 0 Then
                Dim Remove As New QueryDocument
                Remove.Add("Cont_Link", _obj._Path)
                _Collect.Remove(Remove)
                _Collect.InsertBatch(Res)
            End If
            Res = Nothing
            _obj = Nothing
            Console.WriteLine(".FIL: Interpretieren von " & _ClassName & " abgeschlossen")
        End Sub

        Function PrePareLine(Line As String) As String
            If IsNothing(Line) Then Return ""
            Line = Line.Replace(",", "<BR>")
            Line = Line.Replace("|", "<BR>")
            Line = Line.Replace(vbTab, "<BR>")
            Line = Line.Replace(";", "<BR>")
            Dim Mails As System.Text.RegularExpressions.MatchCollection = System.Text.RegularExpressions.Regex.Matches(Line, "(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3})")
            If Mails.Count > 0 Then Line = Line.Replace(Mails(0).Value, "<a href='Mailto://" & Mails(0).Value & "'>" & Mails(0).Value & "</a>")
            Do Until Line.Contains("<BR><BR>") = False : Line = Line.Replace("<BR><BR>", "<BR>") : Loop
            Return Mid(Line, 1, 300)
        End Function

    End Class
End Namespace

