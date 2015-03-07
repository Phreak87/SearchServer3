Imports Microsoft.WindowsAPICodePack.Shell
Imports System.Threading
Imports System.Text
Imports System.IO.Compression

Public Class Filetypes2

    Public _Filename As String
    Public _Foldername As String
    Public _File As String
    Public _Postfix As String = ""
    Public _Player As String = ""
    Public _Cache As String = ""
    Public _Thumb As String = ""
    Public _Content As String = ""
    Public _Online As Boolean = False
    Public _MimeType As String = ""

    Sub New(ByVal Filename As String, Optional ByVal JSON As Boolean = False)
        _Filename = Filename
        _Online = IsOnline()

        _Postfix = Genpostfix()
        _File = GenFile()
        _Foldername = GenFolder()
        _Player = GetPlayer()
        _Thumb = GetThumbNail()
        _MimeType = GetMimeType()
        _Cache = GetCache()

        If _Player = "Text" Then
            Try
                _Content = Mid(My.Computer.FileSystem.ReadAllText(_Filename), 1, 200)
            Catch
            End Try
        End If

        If JSON = True Then
            _File = JsonReplace(_File)
            _Filename = JsonReplace(_Filename)
            _Thumb = JsonReplace(_Thumb)
            _Content = JsonReplace(_Content)
        End If
    End Sub

    Function JsonReplace(ByVal Text As String) As String
        Text = Text.Replace("[", "")
        Text = Text.Replace("{", "")
        Text = Text.Replace("]", "")
        Text = Text.Replace("}", "")
        Text = Text.Replace(vbCrLf & vbCrLf, "")
        Text = Text.Replace(vbCr, "<BR>")
        Text = Text.Replace(vbLf, "")
        Text = Text.Replace(Chr(34), "'")
        Return Text
    End Function

    Private Function Genpostfix() As String
        Dim LastPoint As String = "." & Split(_Filename, ".")(Split(_Filename, ".").Length - 1)
        If _Online = True Then
            Dim PosBsl As Integer = InStr(LastPoint, "/") - 1
            If PosBsl <= 0 Then Return LastPoint
            If PosBsl > 0 Then Return Mid(LastPoint, 1, PosBsl)
        Else
            Return LastPoint
        End If
        Return ""
    End Function
    Private Function GenFile() As String
        If _Online = True Then
            Return Split(_Filename, "/")(Split(_Filename, "/").Length - 1)
        Else
            Return Split(_Filename, "\")(Split(_Filename, "\").Length - 1)
        End If
    End Function
    Private Function GenFolder() As String
        If _Online = True Then
            If _File = "" Then Return _Filename
            Return _Filename.Replace("/" & _File, "")
        Else
            Return _Filename.Replace("\" & _File, "")
        End If
    End Function
    Private Function IsOnline() As Boolean
        If _Filename.StartsWith("http://") Then Return True
        If _Filename.StartsWith("https://") Then Return True
        If _Filename.Contains("/") Then Return True
        Return False
    End Function
    Function GetCache() As String
        Return MimeTypes.GetCacheFor(_Postfix)
    End Function
    Function GetPlayer() As String
        Return MimeTypes.GetPlayerFor(_Postfix)
    End Function
    Function GetMimeType() As String
        Return MimeTypes.GetMimeFor(_Postfix)
    End Function
    Function HasThumbNail() As Boolean
        Return MimeTypes.GetThumbFor(_Postfix)
    End Function

    Function GetThumbNail() As String
        'If _Online = True Then Return ""
        If HasThumbNail() = False Then Return ""
        Dim Hash As String = HashString(_Filename)

        Dim NewFile As String = "http://localhost:9090\THImage\" & Hash & ".jpg"
        Return NewFile
    End Function
    Private Function HashString(ByVal source As String) As String
        Dim encoding As New Text.ASCIIEncoding()
        Dim bytes() As Byte = encoding.GetBytes(source)
        Dim workingHash() As Byte = New System.Security.Cryptography.MD5CryptoServiceProvider().ComputeHash(bytes)
        Dim result As String = ""
        For Each b In workingHash
            result = result & b.ToString("X2")
        Next
        Return result
    End Function

    Class ThumbCreator
        Dim _Source As String = ""
        Dim _Destin As String = ""
        Dim _OrgName As String = ""
        Sub New(ByVal Source As String, ByVal Destination As String)
            _Source = Source
            _Destin = Destination
        End Sub
        Sub CreateThumb()
            Try
                Dim n As ShellFile = ShellFile.FromFilePath(_Source)
                Dim m As System.Drawing.Bitmap = n.Thumbnail.LargeBitmap
                m.Save(_Destin, System.Drawing.Imaging.ImageFormat.Jpeg)
                m.Dispose()
            Catch ex As Exception
                Console.WriteLine(ex.Message)
            End Try
        End Sub
    End Class
End Class
