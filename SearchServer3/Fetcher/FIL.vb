Imports MongoDB.Bson
Imports MongoDB.Driver
Imports System.Threading

Namespace CLS
    Public Class FIL
        Dim _Name As String = ""
        Dim _File As String = ""
        Dim _Group As String = ""
        Dim _Files As Double = 0
        Dim _Todos As Integer = 0
        Dim _Status As New System.Timers.Timer
        Dim _Timer As New Stopwatch
        Dim _Folders As Double = 0
        Dim _Collect As MongoCollection

        Class CLS_Fil
            Public _Path As String
            Sub New(Path As String)
                _Path = Path
            End Sub
        End Class

        Sub New(Name As String, Group As String, Path As String, Collection As MongoCollection)
            _Name = Name
            _Group = Group
            _Collect = Collection

            Dim Remove As New QueryDocument
            Remove.Add("SourceClassName", Name)
            Collection.Remove(Remove)

            Dim DoFile As New CLS_Fil(Path)
            Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFile, DoFile)
        End Sub


        Sub IndexFile(ByVal _obj As CLS_Fil)
            Dim Res As New List(Of BsonDocument)
            Dim i As Integer = 1
            If My.Computer.FileSystem.FileExists(_obj._Path) = False Then
                Console.WriteLine("#FIL: Datei nicht gefunden: " & _obj._Path)
                Exit Sub
            End If
            For Each Line In Split(My.Computer.FileSystem.ReadAllText(_obj._Path), vbCrLf)
                Dim F As New BsonDocument
                F.Add("SourceClassType", "FIL")
                F.Add("SourceClassName", _Name)
                F.Add("SourceClassGroup", _Group)
                F.Add("objName", Line)
                F.Add("objLink", Line)
                F.Add("SourceFileType", "Line: " & i)
                F.Add("ContentTime", New BsonDateTime(Now))
                F.Add("ContentThumb", "No_Thumb (FIL)")
                F.Add("ContentType", "No_Type (FIL)")
                Res.Add(F)
                i = i + 1
            Next

            If Res.Count > 0 Then
                Dim Remove As New QueryDocument
                Remove.Add("Name", _obj._Path)
                _Collect.Remove(Remove)
                _Collect.InsertBatch(Res)
            End If
            Res = Nothing
            _obj = Nothing
        End Sub
    End Class
End Namespace

