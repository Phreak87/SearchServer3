﻿
Class COL
    Dim _Query As String
    Public _Result As String
    Sub New(Query As String)
        _Query = Query
        Calculate()
    End Sub
    Sub Calculate()
        Dim Color As Drawing.Color
        For Each eintrag In EvalTypes.Konverter
            If LCase(Trim(_Query)) = LCase(eintrag.Key) Then _Query = eintrag.Value
        Next
        If IsNumeric(_Query) Then Exit Sub
        Try : Color = Drawing.ColorTranslator.FromHtml(_Query) : Catch : Exit Sub : End Try
        If Color.R & Color.G & Color.B <> "000" Then
            _Result = _Result & "<Div Style='Background-color:rgb(" & Color.R & "," & Color.G & "," & Color.B & ");Height:40px;Width:80px;'></Div>" & _
                       "R: " & Color.R & "<BR>G: " & Color.G & "<BR>B: " & Color.B & "<BR>A: " & Color.A & "<BR>" & _
                       System.Drawing.ColorTranslator.ToHtml(Color)
        End If
    End Sub
End Class