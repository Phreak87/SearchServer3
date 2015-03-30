

Public Class EVL

    Function MathResult(ByVal Query As String) As String

        Dim _Query As String = New Reduce(Query)._Result
        Dim Res As String = ""

        Try
            If Res = "" Then Res = Res & MimeTypes.Info(_Query)
            If Res = "" Then Res = Res & New DTE(_Query)._Result
            If Res = "" Then Res = Res & New COL(_Query)._Result
            If Res = "" Then Res = Res & New UCL().ParseQuery(_Query)
        Catch
            Res = Query
        End Try
        If Res = "" Then Res = _Query

        Return (RES)

    End Function

End Class