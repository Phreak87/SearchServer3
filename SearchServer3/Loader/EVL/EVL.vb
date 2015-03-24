

Public Class EVL

    Function MathResult(ByVal Query As String) As String

        ' ----------------------------------------------------------------------------
        ' Query bereinigen 
        ' ----------------------------------------------------------------------------
        Console.WriteLine(".EVL: Vor Cleanup: " & Query)
        Do Until Query.Contains("++") = False : Query = Query.Replace("++", "+") : Loop
        Do Until Query.Contains("  ") = False : Query = Query.Replace("  ", " ") : Loop
        Do Until System.Text.RegularExpressions.Regex.Matches(Query, "([0-9])+(\+)([0-9]+)").Count = 0
            Dim RGX As System.Text.RegularExpressions.MatchCollection = System.Text.RegularExpressions.Regex.Matches(Query, "([0-9])+(\+)([0-9]+)")
            If RGX.Count > 0 Then Query = Mid(Query, 1, RGX(0).Groups(2).Index) & " [plus] " & Mid(Query, RGX(0).Groups(2).Index + 2)
        Loop
        Query = Query.Replace("+*", "*")
        Query = Query.Replace("*+", "*")
        Query = Query.Replace("/*", "/")
        Query = Query.Replace("*/", "/")
        Query = Query.Replace("-*", "-")
        Query = Query.Replace("*-", "-")
        Query = Query.Replace("[plus]", "+")
        Console.WriteLine(".EVL: Nach Cleanup: " & Query)

        Dim RES As String = ""

        Try
            If RES = "" Then RES = RES & MimeTypes.Info(Query)
            If RES = "" Then RES = RES & New DTE(Query)._Result
            If RES = "" Then RES = RES & New COL(Query)._Result
            If RES = "" Then RES = RES & New UCL().ParseQuery(Query)
        Catch
        End Try

        Return (RES)

    End Function

    

End Class