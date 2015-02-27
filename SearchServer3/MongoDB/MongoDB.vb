Imports MongoDB.Driver
Imports MongoDB.Bson
Imports MongoDB.Driver.Builders

Namespace CLS
    Class DBS
        Public Class MongoDB
            Event Status(Message As String)
            Sub Startmongo()
                Dim AppPath As String = Environment.CurrentDirectory & "\Bins\"
                Dim MongoD As String = "Mongod_3.0_RC11.exe"

                RaiseEvent Status(".DBS: Start MongoDB Server")
                Dim PStart As New ProcessStartInfo
                PStart.WindowStyle = ProcessWindowStyle.Hidden
                PStart.FileName = AppPath & MongoD
                PStart.Arguments = "--dbpath data\db --nojournal --quiet" '  --httpinterface --rest --jsonp
                PStart.WorkingDirectory = AppPath
                Dim PRC As Process = Process.Start(PStart)
                RaiseEvent Status(".DBS: ProcessID: " & PRC.Id)
                RaiseEvent Status(".DBS: MongoPath: " & MongoD)
                RaiseEvent Status(".DBS: Arguments: " & PRC.StartInfo.Arguments)
            End Sub
            Shared Function QueryFull(DB As MongoCollection) As String
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
            Shared Function QueryText(ByVal DB As MongoCollection, ByVal Search As String(), Optional MaxResults As Integer = 30, Optional StartAt As Integer = 0) As List(Of Dictionary(Of String, String))
                If IsNothing(DB) Then Return Nothing

                Dim QL As New List(Of IMongoQuery)
                For Each Eintrag In Split(Search(0), "+")
                    Dim Q As IMongoQuery = Query.Matches("objName", "/" & Eintrag & "/i") : QL.Add(Q)
                Next
                Dim Q2 As IMongoQuery = Query.And(QL)
                Dim R As MongoCursor(Of BsonDocument) = DB.FindAs(Of BsonDocument)(Q2).SetLimit(MaxResults)

                Dim D As New List(Of Dictionary(Of String, String))
                For Each Eintrag In R
                    Dim D2 As New Dictionary(Of String, String)
                    For Each Field In Eintrag
                        D2.Add(Field.Name, Field.Value.ToString)
                    Next
                    If Eintrag.Contains("ContentPost") Then
                        D2.Add("ContentType", MimeTypes.GetPlayerFor(Eintrag("ContentPost")))
                        D2.Add("ContentMime", MimeTypes.GetMimeFor(Eintrag("ContentPost")))
                        D2.Add("ContentCache", MimeTypes.GetCacheFor(Eintrag("ContentPost")))
                    End If
                    D.Add(D2)
                Next
                Return D

            End Function

        End Class
    End Class
End Namespace

