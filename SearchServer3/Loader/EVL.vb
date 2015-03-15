Imports UnitConversionLib

Public Class EVL
    Function MathResult(Query As String) As String
        Do Until Query.Contains("++") = False
            Query = Query.Replace("++", "+")
        Loop
        Query = Query.Replace(",", ".")
        Query = Query.Replace("+*", "*")
        Query = Query.Replace("*+", "*")
        Query = Query.Replace("/*", "/")
        Query = Query.Replace("*/", "/")
        Query = Query.Replace("-*", "-")
        Query = Query.Replace("*-", "-")

        Dim RES As String = ""
        Try
            Dim n As New NCalc.Expression(Query)
            RES = "" & Query & " = " & n.Evaluate()
        Catch
        End Try

        Dim Weekdays As String() = ({"Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"})
        Dim Months As String() = ({"Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"})

        If IsDate(Query) Then
            Dim WT As String = Weekdays(Date.Parse(Query).DayOfWeek)
            Dim KM As String = Months(Date.Parse(Query).Month - 1)
            Dim JT As String = Date.Parse(Query).DayOfYear
            Dim KW As String = DatePart(DateInterval.WeekOfYear, CDate(Query), FirstDayOfWeek.Monday, FirstWeekOfYear.FirstFourDays)

            Return Date.Parse(Query).Date & "<BR>" & _
                    "Kalenderwoche: " & KW & "<BR>" & _
                    "Wochentag: " & WT & "<BR>" & _
                    "Monat: " & KM & "<BR>" & _
                    "Tag im Jahr:" & JT & "<BR>" & _
                    "Feiertage: " & Next10Days(Query) & _
                    "Differenz: " & DateDiff(DateInterval.Year, Date.Parse(Query).Date, Now) & " Jahre, " & _
                    Date.Now.Month - Date.Parse(Query).Month & " Monate, " & _
                    Date.Now.Day - Date.Parse(Query).Day & " Tage"

        End If

        Dim Color As Drawing.Color
        Try : Color = Drawing.ColorTranslator.FromHtml(Query) : Catch : End Try
        If Color.R & Color.G & Color.B <> "000" Then
            RES = RES & "<Div Style='Background-color:rgb(" & Color.R & "," & Color.G & "," & Color.B & ");Height:40px;Width:40px;'></Div>" & _
                       "R: " & Color.R & "<BR>G: " & Color.G & "<BR>B: " & Color.B & "<BR>A: " & Color.A & "<BR>" & _
                       System.Drawing.ColorTranslator.ToHtml(Color)
        End If

        Dim m As New UCL()

        RES = RES & m.ParseQuery(Query)
        Return (RES)
    End Function


    Private Function CALC_Feiertage(ByVal Jahr_Start As Integer) As List(Of String())
        Dim i As Integer
        Dim Ostersonn As Date
        Dim Feiertage As New List(Of String())
        If Jahr_Start = 0 Then Jahr_Start = Year(Now)
        i = Jahr_Start
        Ostersonn = OSTERSONNTAG(Jahr_Start)   ' Eindeutiger Schlüssel für Feiertage
        Feiertage.Add({DateAdd(DateInterval.Day, -2, Ostersonn), "-D.Karfreitag"})
        Feiertage.Add({Ostersonn, "-D.Ostersonntag"})
        Feiertage.Add({DateAdd(DateInterval.Day, 1, Ostersonn), "-D.Ostermontag"})
        Feiertage.Add({DateAdd(DateInterval.Day, 39, Ostersonn), "-D.Christi_Heimmelfahrt/Vatertag"})
        Feiertage.Add({DateAdd(DateInterval.Day, 49, Ostersonn), "-D.Pfingstsonntag"})
        Feiertage.Add({DateAdd(DateInterval.Day, 50, Ostersonn), "-D.Pfingstmontag"})
        Feiertage.Add({DateAdd(DateInterval.Day, 60, Ostersonn), "-D.Fronleichnam"})
        Feiertage.Add({"01.01." & i, "-F.Neujahrstag"})
        Feiertage.Add({"24.12." & i, "-F.Weihnachten"})
        Feiertage.Add({"25.12." & i, "-F.Weihnachtsfeiertag"})
        Feiertage.Add({"26.12." & i, "-F.Weihnachtsfeiertag"})
        Feiertage.Add({"06.01." & i, "-F.Heilige_3_Könige"})
        Feiertage.Add({"15.08." & i, "-F.Mariä_Himmelfahrt"})
        Feiertage.Add({"03.10." & i, "-F.Tag_dt_Einheit"})
        Feiertage.Add({"01.05." & i, "-F.1.Maifeiertag/Tag d. Arbeit"})
        Feiertage.Add({"31.12." & i, "-F.Silvester"})
        Feiertage.Add({"01.11." & i, "-F.Allerheiligen"})
        Return Feiertage
    End Function
    Private Function OSTERSONNTAG(ByVal Jahr As Integer) As Object
        Dim d1 As Integer
        Dim d2 As Integer
        Dim d3 As Integer
        Dim d4 As Integer

        'Formel nach C.F.Gauss gilt 1583 - 8202:
        If Jahr = 0 Then Jahr = Year(Now)
        If Jahr = 8202 Then Err.Raise(5) 'Invalid argument'

        d1 = (8 * (Jahr \ 100) + 13) \ 25 - 2
        d2 = (Jahr \ 100) - (Jahr \ 400) - 2
        d1 = (15 + d2 - d1) Mod 30
        d3 = 2 * (Jahr Mod 4) + 4 * (Jahr Mod 7)
        d4 = (d1 + 19 * (Jahr Mod 19)) Mod 30
        If d4 = 29 Then
            d4 = 28
        ElseIf d4 = 28 Then
            If (Jahr Mod 19) = 10 Then d4 = 27
        End If
        d3 = (6 + d2 + d3 + 6 * d4) Mod 7

        OSTERSONNTAG = DateSerial(Jahr, 3, 22 + d4 + d3)
    End Function
    Private Function Next10Days(ByVal Datum) As String
        Dim INTLST As List(Of String()) = CALC_Feiertage(Date.Parse(Datum).Year)
        Dim DateList As New List(Of String())
        Dim Out As String = ""
        For i As Integer = 0 To 9
            Dim iCNT As Integer = i
            If Not IsNothing(INTLST.Find(Function(s) DateAdd(DateInterval.Day, iCNT, CDate(Datum)) = (s(0)))) Then
                Out = Out & INTLST.Find(Function(s) DateAdd(DateInterval.Day, iCNT, CDate(Datum)) = (s(0)))(0) & ":"
                Out = Out & INTLST.Find(Function(s) DateAdd(DateInterval.Day, iCNT, CDate(Datum)) = (s(0)))(1) & "<BR>"
            End If
        Next
        Return "<BR>" & Out
    End Function

    Public Class UCL

        Dim Grundtype As New List(Of Dictionary(Of String, String))

        Dim Konverter As New Dictionary(Of String, String)

        Dim Konstanten As New Dictionary(Of String, String)
        Dim KonstantenWert As New Dictionary(Of String, String)

        Dim Operatoren As New Dictionary(Of String, String)

        Sub New()
            Dim XMLTypes As New Xml.XmlDocument : XMLTypes.Load(Environment.CurrentDirectory & "\config\Units.xml")
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
            Grundtype = Grundtype.Distinct.ToList
        End Sub

        Function ParseQuery(ByVal Query As String) As String
            Query = Query.Replace(" ", "+")
            Query = Query.Replace(".", ",")
            Query = Query.Replace("++", "+")

            Dim Quelleinheit As String = ""
            Dim Quellwert As String = ""
            Dim Zieleinheit As String = ""
            Dim Zielwert As String = ""

            Dim Ausgabe As String = ""

            Dim Res1 As List(Of String) = SplitQuery(Query)
            Res1 = SplitQuery(Simplyfy(Res1))

            Try
                Quelleinheit = "[" & Res1(1) & "]"
                Zieleinheit = "[" & Res1(4) & "]"
                Quellwert = Res1(0)
                Zielwert = Res1(3)
                Ausgabe = Ausgabe & ("Normalisiert auf: " & Quellwert & " " & Quelleinheit & " zu " & Zielwert & " " & Zieleinheit) & "<br>"


                Do
                    Dim StepOne As List(Of String) = ReadReplaces(Quelleinheit) : If StepOne.Count = 0 Then Exit Do
                    For Each eintrag In StepOne
                        Dim SelStep As String = eintrag
                        If eintrag = Zieleinheit Then
                            Quellwert = Quellwert & Quelleinheit.Replace(eintrag, "")
                            Zielwert = Zielwert & Zieleinheit.Replace(eintrag, "")
                            Ausgabe = Ausgabe & ("Normalisiert auf: " & Quellwert & " zu " & Zielwert) & "<br>"
                            Return Ausgabe & New NCalc.Expression(Quellwert.Replace(",", ".") & " / " & Zielwert).Evaluate
                        Else
                            Dim Redu As Dictionary(Of String, String) = Grundtype.Find(Function(S) S("Name") = Mid(SelStep, 2, Len(SelStep) - 2))
                            Quelleinheit = Quelleinheit.Replace(eintrag, Redu("Formel"))
                            If ReadReplaces(Quelleinheit).Count = 0 Then
                                Quellwert = New NCalc.Expression(Quellwert & " " & Quelleinheit).Evaluate
                                Quelleinheit = "[" & Redu("Name") & "]"
                                Ausgabe = Ausgabe & ("Reduziert auf: " & Quellwert & " " & Quelleinheit & " zu " & Zielwert) & "<br>"
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
                        Ausgabe = Ausgabe & ("Normalisiert auf: " & Quellwert & " zu " & Zielwert) & "<br>"
                        If Zieleinheit = "" AndAlso Redu("Name") <> Quelleinheit Then Return "Keine konvertierung"
                        If ReadReplaces(Zieleinheit).Count = 0 Then
                            Zielwert = New NCalc.Expression("1" & Zieleinheit).Evaluate
                            Ausgabe = Ausgabe & ("Normalisiert auf: " & Quellwert & " zu " & Zielwert) & "<br>"
                            Return Ausgabe & Quellwert / Zielwert : Exit For
                        End If
                    Next
                Loop
            Catch ex As Exception
                Return ""
            End Try
            Return Ausgabe
        End Function

        Function Simplyfy(Querys As List(Of String)) As String
            Dim Num1 As String = Nothing
            Dim Unit1 As String = Nothing

            Dim Num2 As String = Nothing
            Dim Unit2 As String = Nothing

            Dim Output As String = Nothing
            Dim Operat As String = Nothing

            Dim IQuerys As Integer = Querys.Count - 1
            For i As Integer = 0 To IQuerys

                If i = IQuerys Then
                    If i = Querys.Count Then Exit For
                    If IsConstant(Querys(i)) Then
                        Num1 = KonstantenWert(Konstanten(Querys(i)))
                        Unit1 = "Number"
                        Num2 = 1
                        Unit2 = "Number"
                    End If
                End If

                If i = IQuerys - 1 Then
                    If IsNumeric(Querys(i)) Then

                    ElseIf IsUnit(Querys(i)) Then
                        If IsNothing(Num1) Then
                            Unit1 = Konverter(Querys(i))
                            Num1 = 1
                        Else
                            Unit2 = Konverter(Querys(i))
                            Num2 = 1
                        End If
                    End If
                Else
                    If i = Querys.Count - 1 Then Exit For
                    If IsNumeric(Querys(i)) AndAlso IsUnit(Querys(i + 1)) Then
                        If IsNothing(Num1) Then
                            Num1 = Querys(i)
                            Unit1 = Konverter(Querys(i + 1))
                            Querys.RemoveAt(i + 1)
                        End If
                    End If
                End If
            Next

            Return Num1 & Unit1 & "+zu+" & Num2 & Unit2
        End Function
        Function IsUnit(ByVal Key As String) As Boolean
            If Konverter.ContainsKey(Key) Then Return True
            Return False
        End Function
        Function IsConstant(ByVal Key As String) As Boolean
            If Konstanten.ContainsKey(Key) Then Return True
            Return False
        End Function
        Function SplitQuery(ByVal Query As String) As List(Of String)
            Dim Res1 As List(Of String) = System.Text.RegularExpressions.Regex.Split(Query, "(\d,+\d+|\+|\d+)").ToList
            Res1.RemoveAll(Function(s) s = "") : Res1.RemoveAll(Function(s) s = "+")
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
                RES = RES & eintrag & " "
            Next
            Return RES
        End Function
    End Class

End Class
