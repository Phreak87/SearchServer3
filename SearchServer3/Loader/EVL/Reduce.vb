Public Class Reduce
    Dim _Query As String
    Public _Result As String = ""

    Dim Grundtype As New List(Of Dictionary(Of String, String))
    Dim Konverter As New Dictionary(Of String, String)
    Dim Konstanten As New Dictionary(Of String, String)
    Dim KonstantenWert As New Dictionary(Of String, String)
    Dim Operatoren As New Dictionary(Of String, String)
    Dim OperatorenWert As New Dictionary(Of String, String)
    Dim Ausgaben As New Dictionary(Of String, String)
    Dim AusgabenWert As New Dictionary(Of String, String)

    Sub New(Query As String)

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
        _Query = Query

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

        Calculate()

        Console.WriteLine(".EVL: Nach Cleanup: " & _Result)
    End Sub

    Sub Calculate()
        Dim RES1 As List(Of String) = SplitQuery(_Query)
        Dim RES2 As List(Of String) = ReduceQuery(RES1)
        _Result = CombineStr(RES2)
    End Sub

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

    Function SplitQuery(ByVal Query As String) As List(Of String)
        Dim Res1 As List(Of String) = System.Text.RegularExpressions.Regex.Split(Query, "(\d,+\d+|\+|\d+)").ToList
        Res1.RemoveAll(Function(s) Trim(s) = "")
        Return Res1
    End Function

    <DebuggerStepThrough()> _
    Function CombineStr(ByVal Liste As List(Of String)) As String
        Dim RES As String = ""
        For Each eintrag In Liste
            RES = RES & eintrag.Replace(".", "").Replace(",", ".") & " "
        Next
        Return RES
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
End Class
