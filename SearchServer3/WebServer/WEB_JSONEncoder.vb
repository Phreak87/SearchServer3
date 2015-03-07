Namespace CLS
    Partial Public Class WBS
        Class JSONEncoder
            Public Shared Function JSONArray2(ByVal PName As String, NameValuePair As Dictionary(Of String, String), ByVal Werte As List(Of Dictionary(Of String, String))) As String
                '-----------------------------------------
                'Baut Json-String:
                '-----------------------------------------
                '{"Name2": "Value2", "PName":[{
                '{"Names0":"Liste0,0", "Names1":"Liste0,1"},
                '{"Names0":"Liste1,0", "Names1":"Liste1,1"}
                '}]}
                '-----------------------------------------

                Dim Resul As New System.Text.StringBuilder
                Dim Objects As New List(Of String)
                For I = 0 To Werte.Count - 1 : Objects.Add(JSONObject(Werte(I))) : Next

                Resul.AppendLine("{" & KeyValuePairs(NameValuePair) & "," & """" & PName & """" & ":[")
                Resul.AppendLine(JSONVerketten(Objects.ToArray))
                Resul.AppendLine("]}")

                Return Resul.ToString
            End Function
            Public Shared Function JSONArray(ByVal PName As String, ByVal Werte As List(Of Dictionary(Of String, String))) As String
                '-----------------------------------------
                'Baut Json-String:
                '-----------------------------------------
                '{"PName":[{
                '{"Names0":"Liste0,0", "Names1":"Liste0,1"},
                '{"Names0":"Liste1,0", "Names1":"Liste1,1"}
                '}]}
                '-----------------------------------------

                Dim Resul As New System.Text.StringBuilder
                Dim Objects As New List(Of String)
                For I = 0 To Werte.Count - 1 : Objects.Add(JSONObject(Werte(I))) : Next

                Resul.AppendLine("{" & """" & PName & """" & ":[")
                Resul.AppendLine(JSONVerketten(Objects.ToArray))
                Resul.AppendLine("]}")

                Return Resul.ToString
            End Function
            Public Shared Function JSONArray(ByVal PName As String, ByVal Werte As Dictionary(Of String, String)) As String
                '-----------------------------------------
                'Baut Json-String:
                '-----------------------------------------
                '{"PName":[{
                '{"Names0":"Liste0,0", "Names1":"Liste0,1"}
                '}]}
                '-----------------------------------------

                Dim Resul As New System.Text.StringBuilder
                Dim Objects As New List(Of String)
                Objects.Add(JSONObject(Werte))

                Resul.AppendLine("{" & """" & PName & """" & ":[")
                Resul.AppendLine(JSONVerketten(Objects.ToArray))
                Resul.AppendLine("]}")

                Return Resul.ToString
            End Function
            Public Shared Function KeyValuePairs(Dictionary As Dictionary(Of String, String)) As String
                Dim Out As New System.Text.StringBuilder
                For Each eintrag In Dictionary
                    Out.Append("""" & eintrag.Key & """" & ":" & """" & eintrag.Value & """" & ",")
                Next
                Return Out.Remove(Out.Length - 1, 1).ToString
            End Function
            Public Shared Function JSONAttribute(ByVal Name As String, ByVal Value As String) As String
                Value = Value.Replace("\", "\\")
                Value = Value.Replace("#", "")
                Value = Value.Replace("{", "")
                Value = Value.Replace("}", "")
                Value = Value.Replace("""", "")
                Value = Value.Replace(vbCr, "")
                Value = Value.Replace(vbLf, "")
                Return """" & Name & """" & ":" & """" & Value & """"
            End Function
            Private Shared Function JSONObject(ByVal Liste As Dictionary(Of String, String)) As String
                ' -------------------------------------------------------
                ' Generiert eine gültige Darstellung eines JSON Objekts
                ' "Type" : "1"
                ' "Wert" : "2"
                ' => {"Type":"1", "Wert":"2"}
                ' -------------------------------------------------------
                Dim Result As New System.Text.StringBuilder
                Dim Listen As New List(Of String)
                For Each Eintrag In Liste : Listen.Add(JSONAttribute(Eintrag.Key, Eintrag.Value)) : Next

                Result.Append("{")
                Result.Append(JSONVerketten(Listen.ToArray))
                Result.Append("}")

                Return Result.ToString
            End Function
            Private Shared Function JSONVerketten(ByVal Werte As String()) As String
                If Werte.Count = 0 Then Return ""
                Dim Result As New System.Text.StringBuilder
                For i As Integer = 0 To Werte.Count - 1
                    Result.Append(Werte(i) & ", ")
                Next
                Result.Remove(Result.Length - 2, 2)
                Return Result.ToString
            End Function
        End Class
    End Class
End Namespace

