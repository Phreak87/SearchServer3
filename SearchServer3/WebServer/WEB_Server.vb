Imports System.Net.Sockets
Imports System.Threading
Imports MongoDB.Bson
Imports System.Text
Imports System.Net
Imports System
Imports System.IO

Namespace CLS
    Class WBS
        Class Server

#If DEBUG Then
#Const WEBDEBUG = False
#End If

#Region "Privates"
            Private _Port As Integer = 0
            Private _Serv As Socket
            Private _Mime As Mimes
            Private _Stats As Dictionary(Of Integer, String)
            Private _Conn As New List(Of AsyncSocket)
#End Region
#Region "Konstructor"
            Sub New(ByVal Port As Integer, ByVal MimeTypes As Mimes)
                _Port = Port
                _Mime = MimeTypes
            End Sub
#End Region
#Region "Events"
            Event Received(ByVal RawData As MessageDecoder, ByVal Connection As Socket)
            Event StatusMsg(ByVal Status As String)
#End Region

            Public Sub StartServer()
                RaiseEvent StatusMsg(".WBS: Starte Webserver: http://localhost:9090 mit 50 Asynchronen Socket Threads")
                Dim SRVThread As New Threading.Thread(AddressOf StartServerThread) : SRVThread.Start()
                _Stats = GenStatusCodes()
            End Sub
            Private Sub Redirect(ByVal RAW As String, ByVal Socket As Socket)
                Dim MSG As New CLS.WBS.Server.MessageDecoder(RAW, _Mime)
                RaiseEvent Received(MSG, Socket)
            End Sub
            Private Sub Status(ByVal sender As Object, ByVal e As Timers.ElapsedEventArgs)
                RaiseEvent StatusMsg(String.Format(".WBS: {0} freie Threads für Webanfragen", EnsureSix(_Conn.FindAll(Function(s) s._Used = False).Count)))
            End Sub
            Private Function EnsureSix(ByVal Text As String) As String
                If Text.Length >= 5 Then Return Text
                Return Space(5 - Len(Text)) & Text
            End Function
            Private Sub StartServerThread()
                ' -----------------------------------------------------------------
                ' Server- Thread starten
                ' -----------------------------------------------------------------
                _Serv = New System.Net.Sockets.Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp)
                _Serv.Bind(New System.Net.IPEndPoint(IPAddress.Loopback, _Port))
                _Serv.Listen(Integer.MaxValue)
                _Serv.ReceiveTimeout = 20
                _Serv.SendTimeout = 20

                ' -----------------------------------------------------------------
                ' Worker- Threads starten
                ' -----------------------------------------------------------------
                For i As Integer = 1 To 50
                    Dim n As New AsyncSocket(_Serv, i)
                    AddHandler n.Received, AddressOf Redirect
                    Dim TH As New Threading.Thread(AddressOf n.AsyncSocket) : _Conn.Add(n) : TH.Start()
                Next

                ' -----------------------------------------------------------------
                ' Status Timer
                ' -----------------------------------------------------------------
#If WEBDEBUG = True Then
                Dim Stat As New System.Timers.Timer
                AddHandler Stat.Elapsed, AddressOf Status
                Stat.Interval = 5000
                Stat.Start()
#End If

            End Sub

            Private Class AsyncSocket
                Dim _Serv As Socket
                Dim _Indx As Integer
                Public _Used As Boolean = False
                Event Received(ByVal Msg As String, ByVal Socket As Socket)

                Public ReadOnly Property GetSocket() As Socket
                    Get
                        Return _Serv
                    End Get
                End Property

                Sub New(ByVal Server As Socket, ByVal Index As Integer)
                    _Serv = Server
                    _Indx = Index
                End Sub

                Public Sub AsyncSocket()
                    Do
                        _Used = False
                        Dim Connection As Socket = _Serv.Accept
                        If (Connection.Poll(-1, SelectMode.SelectRead)) = True Then
                            _Used = True
                            Dim Bytes(Connection.Available) As Byte
                            Dim Count As Integer = Connection.Receive(Bytes)
                            Dim RawData As String = System.Text.Encoding.UTF8.GetChars(Bytes)
                            If RawData.Length <= 1 Then Connection.Close() : Continue Do

                            Dim Path As String = ""
                            Dim Raw As New MessageDecoder(RawData, MimeTypes)
                            Dim Sender As New AsyncSender(Connection, "", Raw)

                            Dim AppPath As String = Environment.CurrentDirectory & "\WebContent\"
                            If Raw.ReqURLPath = "" Then Raw.ReqURLPath = AppPath & "Index.html"
                            If My.Computer.FileSystem.FileExists(Raw.ReqURLPath) Then Sender.SendBinFile(Raw.ReqURLPath)
                            If My.Computer.FileSystem.FileExists(AppPath & Raw.ReqURLPath) Then Sender.SendBinFile(AppPath & Raw.ReqURLPath)

                        RaiseEvent Received(RawData, Connection)

#If WEBDEBUG = True Then
                            Console.WriteLine (Rawdata)
                            Console.WriteLine("Socket # {0} in Use by {1}", _Indx, Raw.ReqURLPath)
#End If

                        End If
                    Loop
                End Sub
            End Class

            Class AsyncSender
                Dim _Transfer As String = ""
                Dim _Socket As Socket = Nothing
                Dim _Raw As MessageDecoder

                Sub New(ByVal Socket As Socket, ByVal Transfer As String, ByVal RawData As MessageDecoder)
                    _Transfer = Transfer
                    _Socket = Socket
                    _Raw = RawData
                End Sub

                Public Overloads Sub SendBinFile(ByVal Filename As String)
                    _Transfer = Filename
                    SendBinFile()
                End Sub
                Public Overloads Sub SendBinFile()
                    If _Socket.Connected = False Then Exit Sub
                    If IsNothing(_Socket) Then Exit Sub
                    If IsNothing(_Transfer) Then sended(_Socket) : Exit Sub

                    If My.Computer.FileSystem.FileExists(_Transfer) = False Then
                        Console.Write("_WBS: Datei nicht gefunden: " & _Transfer)
                        sended(_Socket) : Exit Sub
                    End If

                    SendHeader(True)
                    _Socket.SendTimeout = Integer.MaxValue

                    Dim NS As New NetworkStream(_Socket, True)
                    Dim FS As New FileStream(_Transfer, FileMode.Open, FileAccess.Read)
                    Try : FS.CopyTo(NS) : FS.Flush() : FS.Close()
                    Catch IOE As IOException
                        NS.Close()
                        FS.Close()
                        sended(_Socket)
                    End Try
                End Sub

                Public Sub SendContent()
                    If _Socket.Connected = False Then Exit Sub
                    If IsNothing(_Socket) Then Exit Sub
                    If IsNothing(_Transfer) Then sended(_Socket) : Exit Sub

                    SendHeader(False)

                    Dim NS As New NetworkStream(_Socket)
                    Dim SW As New MemoryStream(System.Text.Encoding.UTF8.GetBytes(_Transfer))
                    Try : SW.CopyTo(NS) : SW.Flush() : SW.Close()
                    Catch IOE As IOException
                        NS.Close()
                        SW.Close()
                        sended(_Socket)
                    End Try
                End Sub

                Private Sub SendHeader(ByVal Datei As Boolean)
                    If _Socket.Connected = False Then Exit Sub
                    If IsNothing(_Socket) Then Exit Sub
                    If IsNothing(_Transfer) Then sended(_Socket) : Exit Sub

                    Dim Const_DefaultResponse As String = _
                            "HTTP/1.1 200 OK" & vbCrLf & _
                            "Server: Searchserver" & vbCrLf & _
                            "Content-Length: {LENGTH}" & vbCrLf & _
                            "Connection: close" & vbCrLf & _
                            "date:" & Now.ToString & vbCrLf & _
                            "cache-control:private, max-age=" & _Raw.ResCacheSec & vbCrLf & _
                            "Content-Type:{CONTENTTYPE}" & vbCrLf & vbCrLf

                    If Datei = True Then If My.Computer.FileSystem.FileExists(_Transfer) = False Then sended(_Socket) : Exit Sub

                    Dim SendPRE As String = Const_DefaultResponse
                    If Datei = True Then SendPRE = SendPRE.Replace("{LENGTH}", My.Computer.FileSystem.GetFileInfo(_Transfer).Length)
                    If Datei = False Then SendPRE = SendPRE.Replace("{LENGTH}", Encoding.UTF8.GetByteCount(_Transfer))

                    SendPRE = SendPRE.Replace("{CONTENTTYPE}", _Raw.MimeCode)

                    Dim NS As New NetworkStream(_Socket)
                    Dim SW As New MemoryStream(System.Text.Encoding.UTF8.GetBytes(SendPRE))
                    Try : SW.CopyTo(NS) : SW.Flush() : SW.Close()
                    Catch IOE As IOException
                        NS.Close()
                        SW.Close()
                        sended(_Socket)
                    End Try

                End Sub

                Private Sub sended(ByVal Sender As Object)
                    Me.Finalize()
                    If _Socket.Connected = False Then _Socket = Nothing : Exit Sub
                    If _Socket.Blocking = True Then _Socket = Nothing : Exit Sub
                    _Socket.Shutdown(SocketShutdown.Both)
                    _Socket.Disconnect(True)
                    _Socket = Nothing
                End Sub

            End Class

            Class MessageDecoder
                Public _Raw As String = ""
                Public ReqURLFull As String = ""
                Public ReqURLPath As String = ""
                Public ReqURLGets As New Dictionary(Of String, String)
                Public ReqContent As New Dictionary(Of String, String)
                Public ReqType As String = ""
                Public ReqProt As String = ""
                Public ReqHost As String = ""
                Public ReqConn As String = ""
                Public ReqRange As String = ""
                Public ReqRangeMin As Integer = 0
                Public ReqRangeMax As Integer = 1024 * 4
                Public ReqContentLength As String = ""
                Public ReqContentType As String = ""
                Public ReqAcceptTypes As String = ""
                Public ReqAcceptLangs As String = ""
                Public ReqOrigin As String = ""
                Public ReqReferrer As String = ""
                Public ReqUserAgent As String = ""
                Public ReqAcceptEncoding As String = ""
                Public ReqCookie As String = ""
                Public ReqXReq As String = ""
                Public ReqCacheControl As String = ""
                Public ReqPragma As String = ""
                Public MimeCode As String = ""
                Public MimeView As String = ""
                Public MimePost As String = ""
                Public MimeThumb As Boolean = False
                Public ResCacheSec As Integer = 0

                Private _Mimes As Mimes

                Sub New(ByVal Raw As String, ByVal Mimetypes As Mimes)
                    _Raw = Raw
                    _Mimes = Mimetypes
                    DecodeMessages()
                End Sub
                Sub DecodeMessages()
                    Dim MSGParts As String() = Split(_Raw, vbCrLf)

                    For Each Line In MSGParts
                        Select Case Trim(Split(Line, " ")(0))
                            Case "POST"
                                ReqType = "POST"
                                ReqURLFull = Trim(Uri.UnescapeDataString(Split(Line, " ")(1))).ToLower.Remove(0, 1).Replace("/", "\")
                                ReqURLPath = ReqURLFull : If ReqURLFull.Contains("?") Then ReqURLPath = (Split(ReqURLFull, "?")(0))
                                If ReqURLFull = "" Then ReqURLFull = "Index.html"
                                If ReqURLPath = "" Then ReqURLPath = "Index.html"
                                If ReqURLFull.Contains("?") Then If ReqURLFull.Contains("?") Then ReqURLGets = SplitContents(Split(ReqURLFull, "?")(1))
                                ReqProt = Split(Line, " ")(2)
                            Case "GET"
                                ReqType = "GET"
                                ReqURLFull = Trim(Uri.UnescapeDataString(Split(Line, " ")(1))).ToLower.Remove(0, 1).Replace("/", "\")
                                ReqURLPath = ReqURLFull : If ReqURLFull.Contains("?") Then ReqURLPath = (Split(ReqURLFull, "?")(0))
                                If ReqURLFull = "" Then ReqURLFull = "Index.html"
                                If ReqURLPath = "" Then ReqURLPath = "Index.html"
                                If ReqURLFull.Contains("?") Then ReqURLGets = SplitContents(Split(ReqURLFull, "?")(1))
                                ReqProt = Split(Line, " ")(2)
                            Case "Host:" : ReqHost = Split(Line, " ")(1)
                            Case "Connection:" : ReqConn = Split(Line, " ")(1)
                            Case "Origin:" : ReqOrigin = Split(Line, " ")(1)
                            Case "Content-Length:" : ReqContentLength = Split(Line, " ")(1)
                            Case "Content-Type:" : ReqContentLength = Split(Line, " ")(1)
                            Case "User-Agent:" : ReqUserAgent = Split(Line, " ")(1)
                            Case "Accept:" : ReqAcceptTypes = Split(Line, " ")(1)
                            Case "Accept-Language:" : ReqAcceptTypes = Split(Line, " ")(1)
                            Case "Accept-Encoding:" : ReqAcceptEncoding = Split(Line, " ")(1)
                            Case "Referer:" : ReqReferrer = Split(Line, " ")(1)
                            Case "Cookie:" : ReqCookie = Split(Line, " ")(1)
                            Case "X-Requested-With:" : ReqXReq = Split(Line, " ")(1)
                            Case "Cache-Control:" : ReqCacheControl = Split(Line, " ")(1)
                            Case "Pragma:" : ReqPragma = Split(Line, " ")(1)
                            Case "Range:"
                                ReqRange = Split(Split(Line, ":")(1), "=")(1)
                                ReqRangeMin = Split(ReqRange, "-")(0)
                            Case " "
                            Case ""
                            Case Else
                                If Line.Length = 1 Then Continue For
                                If Line.Length > 1 Then
                                    ReqContent = SplitContents(Line)
                                Else
                                    MsgBox(1)
                                End If
                        End Select
                    Next

                    Dim SplitRequest As String() = Split(ReqURLPath, ".")
                    If SplitRequest.Count >= 2 Then MimeCode = "." & SplitRequest(SplitRequest.Count - 1)
                    If MimeCode = "." Then MimeCode = "" : Exit Sub
                    Dim Mimelist As Dictionary(Of String, String) = _Mimes.GetAllFor(MimeCode)
                    MimeCode = Mimelist("Mimetype")
                    MimePost = Mimelist("Postfix")
                    MimeView = Mimelist("Player")
                    ResCacheSec = Mimelist("CacheSec")
                    MimeThumb = Mimelist("CreateThumb")

                End Sub
                Function SplitContents(ByVal Contents As String) As Dictionary(Of String, String)
                    Dim Dict As New Dictionary(Of String, String)
                    For Each Eintrag In Split(Contents, "&")
                        If Split(Eintrag, "=").Count = 1 Then Dict.Add(Eintrag, "") : Continue For
                        Dim KEY As String = Uri.UnescapeDataString(Split(Eintrag, "=")(0)).Replace(Chr(0), "")
                        Dim VAL As String = Uri.UnescapeDataString(Split(Eintrag, "=")(1)).Replace(Chr(0), "")
                        Dict.Add(KEY, VAL)
                    Next
                    Return Dict
                End Function

            End Class

        End Class

    End Class

End Namespace
