﻿Public Class UCL

    Dim Grundtype As New List(Of Dictionary(Of String, String))
    Dim Konverter As New Dictionary(Of String, String)
    Dim Konstanten As New Dictionary(Of String, String)
    Dim KonstantenWert As New Dictionary(Of String, String)
    Dim Operatoren As New Dictionary(Of String, String)
    Dim OperatorenWert As New Dictionary(Of String, String)
    Dim Ausgaben As New Dictionary(Of String, String)
    Dim AusgabenWert As New Dictionary(Of String, String)

    Sub New()
        Dim XMLTypes As New Xml.XmlDocument : XMLTypes.Load(Environment.CurrentDirectory & "\Config\Units.xml")
        Dim GTN As New Dictionary(Of String, String)
        GTN.Add("Name", "[Number]")
        GTN.Add("Formel", "1")
        Grundtype.Add(GTN)
        For Each Type As Xml.XmlNode In XMLTypes.SelectNodes("WebSearch/Units/Unit")
            Dim GT As New Dictionary(Of String, String)
            GT.Add("Name", Type.Attributes("Name").Value)
            GT.Add("Formel", Type.Attributes("Calc").Value)
            Grundtype.Add(GT)
            For Each SubType As String In Split(Type.Attributes("Aliasses").Value, ",")
                Konverter.Add(SubType, Type.Attributes("Name").Value)
            Next
        Next
        For Each Type As Xml.XmlNode In XMLTypes.SelectNodes("WebSearch/Operators/Operator")
            OperatorenWert.Add(Type.Attributes("Name").Value, Type.Attributes("Calc").Value)
            For Each SubType As String In Split(Type.Attributes("Aliasses").Value, ",")
                Dim GT As New Dictionary(Of String, String)
                Operatoren.Add(SubType, Type.Attributes("Name").Value)
            Next
        Next
        For Each Type As Xml.XmlNode In XMLTypes.SelectNodes("WebSearch/Constants/Constant")
            KonstantenWert.Add(Type.Attributes("Name").Value, Type.Attributes("Calc").Value)
            For Each SubType As String In Split(Type.Attributes("Aliasses").Value, ",")
                Dim GT As New Dictionary(Of String, String)
                Konstanten.Add(SubType, Type.Attributes("Name").Value)
            Next
        Next
        For Each Type As Xml.XmlNode In XMLTypes.SelectNodes("WebSearch/Outputs/Output")
            AusgabenWert.Add(Type.Attributes("Name").Value, Type.Attributes("Calc").Value)
            For Each SubType As String In Split(Type.Attributes("Aliasses").Value, ",")
                Dim GT As New Dictionary(Of String, String)
                Ausgaben.Add(SubType, Type.Attributes("Name").Value)
            Next
        Next
        Grundtype = Grundtype.Distinct.ToList
    End Sub

    Function ParseQuery(ByVal Query As String) As String

        Dim Quelleinheit As String = ""
        Dim Quellwert As String = ""
        Dim Zieleinheit As String = ""
        Dim Zielwert As String = ""
        Dim Operatorwert As String = ""
        Dim Ausgabeeinheit As String = ""
        Dim Ausgabe As String = ""

        Dim RES1 As List(Of String) = SplitQuery(Query)
        Dim RES2 As List(Of String) = RES1

        Try : Dim n As New NCalc.Expression(Query)
            Return Query & " = " & n.Evaluate()
        Catch : End Try

        Dim RES3 As List(Of String) = Simplyfy(RES2)


        Try
            Quelleinheit = "[" & RES3(1) & "]"
            Zieleinheit = "[" & RES3(3) & "]"
            Ausgabeeinheit = "[" & RES3(5) & "]"
            Operatorwert = RES3(4)
            Quellwert = RES3(0)
            Zielwert = RES3(2)
            'Console.WriteLine("Normalisiert auf: " & Quellwert & " " & Quelleinheit & " " & Operatorwert & " " & Zielwert & " " & Zieleinheit & " als " & Ausgabeeinheit)

            Do
                Dim StepOne As List(Of String) = ReadReplaces(Quelleinheit) : If StepOne.Count = 0 Then Exit Do
                For Each eintrag In StepOne
                    Dim SelStep As String = eintrag
                    If eintrag = Zieleinheit Then
                        Quellwert = Quellwert & Quelleinheit.Replace(eintrag, "")
                        Zielwert = Zielwert & Zieleinheit.Replace(eintrag, "")
                        Ausgabe = Ausgabe & ("Normalisiert auf: " & Quellwert & Operatorwert & Zielwert) & "<br>"
                        Return Ausgabe & New NCalc.Expression(Quellwert.Replace(",", ".") & Operatorwert & Zielwert).Evaluate
                    Else
                        Dim Redu As Dictionary(Of String, String) = Grundtype.Find(Function(S) S("Name") = Mid(SelStep, 2, Len(SelStep) - 2))
                        Quelleinheit = Quelleinheit.Replace(eintrag, Redu("Formel"))
                        If ReadReplaces(Quelleinheit).Count = 0 Then
                            Quellwert = New NCalc.Expression(Quellwert & " " & Quelleinheit).Evaluate
                            Quelleinheit = "[" & Redu("Name") & "]"
                            'Console.WriteLine("Quelle reduziert auf: " & Quellwert & " " & Quelleinheit)
                            Exit Do
                        End If
                    End If
                Next
            Loop

            Do
                Dim StepOne As List(Of String) = ReadReplaces(Zieleinheit) : If StepOne.Count = 0 Then Exit Do
                For Each eintrag In StepOne
                    Dim SelStep As String = eintrag
                    Dim Redu As Dictionary(Of String, String) = Grundtype.Find(Function(S) S("Name") = Mid(SelStep, 2, Len(SelStep) - 2))
                    Zieleinheit = Zieleinheit.Replace(eintrag, Redu("Formel"))
                    If ReadReplaces(Zieleinheit).Count = 0 Then
                        Zielwert = New NCalc.Expression(Zielwert & Zieleinheit).Evaluate
                        Ausgabe = Ausgabe & ("Ziel reduziert auf: " & Quellwert & " zu " & Zielwert) & "<br>"
                        Return Ausgabe & Quellwert / Zielwert : Exit For
                    End If
                Next
            Loop

        Catch ex As Exception
            Return ""
        End Try
        Return Ausgabe
    End Function

    Function ReduceQuery(ByVal Querys As List(Of String)) As List(Of String)
        For i As Integer = 0 To Querys.Count - 1
            If IsNumeric(Querys(i)) Then
                ' Numerisch bleibt
            ElseIf IsUnit(Querys(i)) Then
                Querys(i) = Konverter(Querys(i))
            ElseIf IsOperator(Querys(i)) Then
                Querys(i) = OperatorenWert(Operatoren(Querys(i)))
            ElseIf IsOutput(Querys(i)) Then
                Querys(i) = Ausgaben(Querys(i))
            ElseIf IsConstant(Querys(i)) Then
                Querys(i) = (KonstantenWert(Konstanten(Querys(i))))
            End If
        Next
        Return Querys
    End Function

    Function Simplyfy(ByVal Querys As List(Of String)) As List(Of String)
        Dim Res1 As New List(Of String)

        Dim Num1 As String = Nothing
        Dim Unit1 As String = Nothing
        Dim Num2 As String = Nothing
        Dim Unit2 As String = Nothing
        Dim Output As String = Nothing
        Dim Operat As String = Nothing

        Dim IQuerys As Integer = Querys.Count - 1

        For i As Integer = 0 To IQuerys
            If i = Querys.Count Then Exit For

            If i < Querys.Count - 1 Then
                ' ----------------
                ' mit Einheit
                ' ----------------
                If IsNumeric(Querys(i)) AndAlso IsUnit(Querys(i + 1)) Then
                    If IsNothing(Num1) Then
                        Num1 = Querys(i)
                        Unit1 = Konverter(Querys(i + 1))
                        Querys.RemoveAt(i + 1)
                    Else
                        Num2 = Querys(i)
                        Unit2 = Konverter(Querys(i + 1))
                        If Unit1 = "Number" Then Unit1 = Unit2
                        Querys.RemoveAt(i + 1)
                    End If

                ElseIf IsNumeric(Querys(i)) Then
                    If IsNothing(Num1) Then
                        Num1 = Querys(i)
                        Unit1 = "Number"
                    Else
                        Num2 = Querys(i)
                        Unit2 = "Number"
                    End If

                ElseIf IsUnit(Querys(i)) Then
                    If IsNothing(Num1) Then
                        Num1 = Querys(i)
                        Unit1 = "Number"
                        Querys.RemoveAt(i + 1)
                    Else
                        Num2 = Querys(i)
                        Unit2 = Konverter(Querys(i + 1))
                        Querys.RemoveAt(i + 1)
                    End If

                ElseIf IsOperator(Querys(i)) Then
                    Operat = Querys(i)

                End If


            Else

                'ohne Folgeeintrag
                If IsNumeric(Querys(i)) Then
                    If IsNothing(Num1) Then
                        Num1 = Querys(i)
                        Unit1 = "Number"
                    Else
                        Num2 = Querys(i)
                        Unit2 = Unit1
                    End If
                End If

                If IsUnit(Querys(i)) Then
                    If IsNothing(Num1) Then
                        Num1 = Querys(i)
                        Unit1 = "Number"
                    Else
                        Num2 = 1
                        Unit2 = Konverter(Querys(i))
                    End If
                End If

                If IsOutput(Querys(i)) Then
                    Output = Ausgaben(Querys(i))
                End If

            End If

        Next

        If IsNothing(Num2) Then Num2 = (1)
        If IsNothing(Unit2) Then Unit2 = Unit1
        If IsNothing(Output) Then Output = "Number"
        If IsNothing(Operat) Then Operat = "/"
        Res1.Add(Num1)
        Res1.Add(Unit1)
        Res1.Add(Num2)
        Res1.Add(Unit2)
        Res1.Add(Operat)
        Res1.Add(Output)

        Return Res1
    End Function

    <DebuggerStepThrough()> _
    Function IsUnit(ByVal Key As String) As Boolean
        If Konverter.ContainsKey(Key) Then Return True
        Return False
    End Function
    <DebuggerStepThrough()> _
    Function IsConstant(ByVal Key As String) As Boolean
        If Konstanten.ContainsKey(Key) Then Return True
        Return False
    End Function
    <DebuggerStepThrough()> _
    Function IsOperator(ByVal Key As String) As Boolean
        If Operatoren.ContainsKey(Key) Then Return True
        Return False
    End Function
    <DebuggerStepThrough()> _
    Function IsOutput(ByVal Key As String) As Boolean
        If Ausgaben.ContainsKey(Key) Then Return True
        Return False
    End Function

    Function SplitQuery(ByVal Query As String) As List(Of String)
        Dim Res1 As List(Of String) = System.Text.RegularExpressions.Regex.Split(Query, "(\d,+\d+|\+|\d+)").ToList
        Res1.RemoveAll(Function(s) Trim(s) = "")
        Return Res1
    End Function
    <DebuggerStepThrough()> _
    Function ReadReplaces(ByVal Query As String) As List(Of String)
        Dim Res As New List(Of String)
        Dim Res1 As System.Text.RegularExpressions.MatchCollection = System.Text.RegularExpressions.Regex.Matches(Query, "\[.*?\]")
        For Each eintrag As System.Text.RegularExpressions.Match In Res1
            Res.Add(eintrag.Value)
        Next
        Return Res
    End Function
    <DebuggerStepThrough()> _
    Function CombineStr(ByVal Liste As List(Of String)) As String
        Dim RES As String = ""
        For Each eintrag In Liste
            RES = RES & eintrag.Replace(".", "").Replace(",", ".") & " "
        Next
        Return RES
    End Function
End Class