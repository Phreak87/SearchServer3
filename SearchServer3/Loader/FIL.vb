Imports MongoDB.Bson
Imports MongoDB.Driver
Imports System.Threading

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

            Console.WriteLine("#FIL: Init von " & Name)
            Dim DoFile As New CLS_Fil(Path) : Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFile, DoFile)
        End Sub


        Sub IndexFile(ByVal _obj As CLS_Fil)
            Dim Res As New List(Of DOC)
            Dim i As Integer = 1
            If My.Computer.FileSystem.FileExists(_obj._Path) = False Then
                Console.WriteLine("#FIL: Datei nicht gefunden: " & _obj._Path)
                Exit Sub
            End If
            For Each Line In Split(My.Computer.FileSystem.ReadAllText(_obj._Path), vbLf)
                Dim SepAll As String = Line.Replace(vbTab, "<BR>").Replace("|", "<BR>").Replace(";", "<BR>").Replace(",", "<BR>")
                Do Until SepAll.Contains("<BR><BR>") = False : SepAll = SepAll.Replace("<BR><BR>", "<BR>") : Loop
                Dim DOC As New DOC(_ClassName, "FIL", _ClassGroup, "Zeile " & i & " " & Mid(Line, 1, 200), _obj._Path, SepAll, "NoPost", Now)
                Res.Add(DOC)
                i = i + 1
            Next

            If Res.Count > 0 Then
                Dim Remove As New QueryDocument
                Remove.Add("Cont_Link", _obj._Path)
                _Collect.Remove(Remove)
                _Collect.InsertBatch(Res)
            End If
            Res = Nothing
            _obj = Nothing
        End Sub
    End Class
End Namespace

