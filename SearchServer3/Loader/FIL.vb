﻿Imports MongoDB.Bson
Imports MongoDB.Driver
Imports System.Threading
Imports Microsoft.VisualBasic.FileIO

Namespace CLS
    Public Class FIL
        Dim _ClassName As String = ""
        Dim _ClassGroup As String = ""
        Dim _UseHead As Boolean = False

        Dim _Collect As MongoCollection

        Class CLS_Fil
            Public _Path As String
            Sub New(Path As String)
                _Path = Path
            End Sub
        End Class

        Sub New(ByVal Name As String, ByVal Group As String, ByVal Path As String, ByVal Collection As MongoCollection, ByVal Head As Boolean)
            _ClassName = Name
            _ClassGroup = Group
            _Collect = Collection
            _UseHead = Head

            Dim Remove As New QueryDocument
            Remove.Add("Class_Name", Name)
            Collection.Remove(Remove)

            If My.Computer.FileSystem.FileExists(Path) Then
                Dim DoFile As New CLS_Fil(Path) : Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFile, DoFile)
            Else
                If My.Computer.FileSystem.DirectoryExists(Path) Then
                    For Each Datei In My.Computer.FileSystem.GetFiles(Path)
                        Dim Post As String = MimeTypes.GetPlayerFor(Mid(Datei, InStrRev(Datei, ".")))
                        If LCase(Post) <> "text" Then Console.WriteLine(".FIL: Non Text Content " & Datei) : Continue For
                        Dim DoFile As New CLS_Fil(Datei) : Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFile, DoFile)
                    Next
                Else
                    Console.WriteLine("#FIL: Datei bzw. Ordner nicht gefunden: " & Path)
                End If
            End If
        End Sub

        Sub IndexFile(ByVal _obj As CLS_Fil)
            Dim Res As New List(Of DOC)
            Dim Head As String() = {}
            Dim i As Integer = 1

            Dim Remove As New QueryDocument : Remove.Add("Cont_Link", _obj._Path) : _Collect.Remove(Remove)
            Dim Datei As String = _obj._Path : If Datei.Contains("\") Then Datei = Mid(Datei, InStrRev(Datei, "\") + 1)
            Dim Postf As String = _obj._Path : If Datei.Contains("\") Then Postf = Mid(Datei, InStrRev(Datei, ".") + 1)
            If System.Text.RegularExpressions.Regex.IsMatch(Postf, "(txt|csv|log)") = False Then Exit Sub

            Dim TFP1 As New TextFieldParser(_obj._Path)
            TFP1.Delimiters = {vbTab, "|", ";", ","}
            TFP1.HasFieldsEnclosedInQuotes = True
            While Not TFP1.EndOfData
                If i = 1 AndAlso _UseHead = True Then
                    Head = TFP1.ReadFields
                    i = i + 1
                Else
                    Try
                        Dim Data As String() = TFP1.ReadFields()
                        Dim DOC As New DOC(_ClassName, "FIL", _ClassGroup, Datei & " Zeile " & i & " " & StringArrayLine(Data), _obj._Path, Datei & "<BR>" & PrepareLine(Data, Head, _obj), "NoPost", Now) : Res.Add(DOC)
                        If i Mod 10000 = 0 Then
                            Console.WriteLine(".FIL: {0} Save next 10000 lines ... {1} lines already saved", Datei, i)
                            _Collect.InsertBatch(Res) : Res.Clear() : System.GC.Collect()
                        End If
                        i = i + 1
                    Catch ex As Exception
                        ' Console.WriteLine(ex.Message)
                    End Try
                End If
            End While

            If Res.Count > 0 Then _Collect.InsertBatch(Res)
            Res.Clear() : Res = Nothing : _obj = Nothing
            Console.WriteLine(".FIL: Interpretieren von " & Datei & " aus " & _ClassName & " abgeschlossen")
        End Sub

        Function StringArrayLine(ByVal Line As String()) As String
            Dim SS As New System.Text.StringBuilder
            For Each eintrag In Line.Distinct.ToArray
                If SS.Length > 200 Then Return SS.ToString
                If IsDate(eintrag) Then eintrag = CDate(eintrag).Date
                SS.Append(System.Text.RegularExpressions.Regex.Replace(eintrag, "<img.*>", "Image", Text.RegularExpressions.RegexOptions.IgnoreCase) & "|")
            Next
            Return SS.ToString
        End Function

        Function PrepareLine(ByVal Line As String(), ByVal Head As String(), ByVal CLS As CLS_Fil) As String
            Dim Out As New System.Text.StringBuilder
            For I As Integer = 0 To Line.Count - 1
                If Line(I) <> "" Then
                    Dim Data As String = Line(I)
                    If Data.Contains("@") Then
                        Dim Mails As System.Text.RegularExpressions.MatchCollection = System.Text.RegularExpressions.Regex.Matches(Data, "([0-9a-zA-Z_\-\.]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3})")
                        For Each Eintrag As System.Text.RegularExpressions.Match In Mails
                            Data = Data.Replace(Eintrag.Value, "<a class='hvr-glow' href='Mailto://" & Mails(0).Value & "'>" & Eintrag.Value & "</a>")
                        Next
                    End If
                    If Data.ToLower.Contains("www.") Then
                        Dim Pages As System.Text.RegularExpressions.MatchCollection = System.Text.RegularExpressions.Regex.Matches(Data, "(www(\.\w+(\-?\w+)?)?\.[a-zA-Z]{2,4}([/A-Za-z0-9\.]+)+?)")
                        For Each Eintrag As System.Text.RegularExpressions.Match In Pages
                            Data = Data.Replace(Eintrag.Value, "<a class='hvr-glow' href='http://" & Eintrag.Value & "'>" & Eintrag.Value & "</a>")
                        Next
                    End If
                    If Data.ToLower.Contains("img") Then
                        If Data.ToLower.Contains("http") = False Then
                            Dim SRC As String = System.Text.RegularExpressions.Regex.Match(Data, "src=""(.*)""", Text.RegularExpressions.RegexOptions.IgnoreCase).Groups(1).Value
                            Data = "<img src=""" & "http://localhost:9090/" & System.Text.RegularExpressions.Regex.Replace(Data, "<img.*>", Mid(CLS._Path, 1, InStrRev(CLS._Path, "\")) & SRC, Text.RegularExpressions.RegexOptions.IgnoreCase) & """>"
                        End If
                    End If
                    If IsDate(Data) Then
                        Dim n As New DTE(CDate(Data))
                        If n._Result <> "" Then
                            Data = n._Result
                        Else
                            Data = CDate(Data).ToShortDateString
                        End If
                    End If
                    If Out.Length > 1024 Then Return Out.ToString
                    If _UseHead = True Then Out.Append(Head(I) & ": " & Data & "<BR>")
                    If _UseHead = False Then Out.Append(Data & "<BR>")
                End If
            Next
            Return Out.ToString
        End Function
    End Class
End Namespace

