

Public Class EVL

    Sub Test()
        Console.WriteLine("## EVAL TESTS ##")

        Console.WriteLine(MathResult("1.2.1987"))
        Console.WriteLine(MathResult("01.02.1987"))

        Console.WriteLine(MathResult("Blau"))
        Console.WriteLine(MathResult("Blue"))

        Console.WriteLine(MathResult("mp3"))
        Console.WriteLine(MathResult(".mp3"))

        Console.WriteLine(MathResult("pi"))
        Console.WriteLine(MathResult("pi * 2"))
        Console.WriteLine(MathResult("5 + 5"))
        Console.WriteLine(MathResult("5 plus 5"))
        Console.WriteLine(MathResult("5 m in cm"))
        Console.WriteLine(MathResult("5 meter in cm"))
    End Sub

    Function MathResult(ByVal Query As String) As String

        Dim Res As String = ""

        Try
            Query = EvalTypes.Reduzieren(Trim(Query))
            If Res = "" Then Res = Res & MimeTypes.Info(Query)
            If Res = "" Then Res = Res & New DTE(Query)._Result
            If Res = "" Then Res = Res & New COL(Query)._Result
            If Res = "" Then Res = Res & New UCL().ParseQuery(Query)
        Catch
            Res = Query
        End Try
        If Res = "" Then Res = Query

        Return (RES)

    End Function

End Class