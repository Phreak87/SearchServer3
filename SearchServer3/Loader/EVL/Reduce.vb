Public Class Reduce

    Public Grundtype As New List(Of Dictionary(Of String, String))

    Public Konverter As New Dictionary(Of String, String)

    Public Konstanten As New Dictionary(Of String, String)
    Public KonstantenWert As New Dictionary(Of String, String)

    Public Operatoren As New Dictionary(Of String, String)
    Public OperatorenWert As New Dictionary(Of String, String)

    Public Ausgaben As New Dictionary(Of String, String)
    Public AusgabenWert As New Dictionary(Of String, String)

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
            For Each SubType As String In Split(Type.Attributes("Aliasses").Value, ",").Distinct
                If Konverter.ContainsKey(SubType) Then Continue For
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

    Function Reduzieren(Query As String) As String
        Dim RES1 As List(Of String) = SplitQuery(Query)
        Dim RES2 As List(Of String) = ReduceQuery(RES1)
        Return CombineStr(RES2)
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

    Function SplitQuery(ByVal Query As String) As List(Of String)
        ' Datum oder Zeit oder Zahl oder Leer oder Zahl,Zahl
        Dim Res1 As List(Of String) = System.Text.RegularExpressions.Regex.Split(Query, "(\d{1,2}:\d{1,2}:\d{1,2}|\d{1,2}\.\d{1,2}\.\d{4}|\d+,\d+| |\d+)").ToList
        Res1.RemoveAll(Function(s) Trim(s) = "")
        Res1.RemoveAll(Function(s) Trim(s) = " ")
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
