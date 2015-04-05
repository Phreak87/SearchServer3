
Class DTE
    Dim _Query As String
    Public _Result As String
    Sub New(Query As String)
        _Query = Query
        If IsNothing(Query) Then _Result = "" : Exit Sub
        Calculate()
    End Sub
    Sub Calculate()
        Dim Weekdays As String() = ({"Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"})
        Dim Months As String() = ({"Januar", "Februar", "Maerz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"})

        If (_Query).Contains("NowDate") Then _Query = _Query.Replace("NowDate", Now.Date.ToString)
        If (_Query).Contains("NowTime") Then _Query = _Query.Replace("NowTime", Now.ToLocalTime.ToString)

        If IsDate(_Query) Then
            Dim WT As String = Weekdays(Date.Parse(_Query).DayOfWeek)
            Dim KM As String = Months(Date.Parse(_Query).Month)
            Dim JT As String = Date.Parse(_Query).DayOfYear
            Dim KW As String = DatePart(DateInterval.WeekOfYear, CDate(_Query), FirstDayOfWeek.Monday, FirstWeekOfYear.FirstFourDays)

            _Result = Date.Parse(_Query).Date & "<BR>" & _
                    "Zeit: " & Now.ToLongTimeString.ToString & "<BR>" & _
                    "Kalenderwoche: " & KW & "<BR>" & _
                    "Wochentag: " & WT & "<BR>" & _
                    "Monat: " & KM & "<BR>" & _
                    "Tag im Jahr:" & JT & "<BR>" & _
                    "Feiertage: " & Next10Days(_Query) & _
                    "Differenz: " & DateDiff(DateInterval.Year, Date.Parse(_Query).Date, Now) & " Jahre, " & _
                    Date.Now.Month - Date.Parse(_Query).Month & " Monate, " & _
                    Date.Now.Day - Date.Parse(_Query).Day & " Tage"

        End If
    End Sub



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


End Class
