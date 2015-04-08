Public Class DOC

#Region "Variablen"
    Dim _Cont_Index As MongoDB.Bson.BsonObjectId

    Dim _Class_Name As String    ' Der Name der Klasse (z.B. DOK1, DOK2)
    Dim _Class_Type As String    ' Der Typ der Klasse (z.B. DIR,RSS,FIL)
    Dim _Class_Group As String   ' Die Gruppe der Klasse (z.B. Musik)

    Dim _Cont_Name As String     ' Der Name des Inhalts (Datei, Kopfzeile, Zeile)
    Dim _Cont_Link As String     ' Der Link des Inhalts (Datei, URL)
    Dim _Cont_Thumb As String    ' Das Thumbnail der Datei
    Dim _Cont_Text As String     ' Der Text des Inhalts (RSSDescr, InnerText)
    Dim _Cont_Post As String     ' Das Postfix des Inhalts (.doc, .html)
    Dim _Cont_Time As Date       ' Die Zeit für den Inhalt

    Dim _Cont_Mime As String    ' Mimetype
    Dim _Cont_Desc As String    ' Beschreibung
    Dim _Cont_Play As String    ' Player
    Dim _Cont_Cach As String    ' Caching in Sekunden
    Dim _Cont_Show As String    ' Wie wird der Inhalt angezeigt

    Dim _Mimetypes As Dictionary(Of String, String)
#End Region

#Region "Konstruktor"
    Sub New(ByVal Klasse_Name As String,
            ByVal Klasse_Type As String,
            ByVal Klasse_Gruppe As String,
            ByVal Inhalt_Name As String,
            ByVal Inhalt_Link As String,
            ByVal Inhalt_Text As String,
            ByVal Inhalt_Post As String,
            ByVal Inhalt_Zeit As Date)

        _Class_Name = Klasse_Name
        _Class_Type = Klasse_Type
        _Class_Group = Klasse_Gruppe
        _Cont_Name = Inhalt_Name '
        _Cont_Link = Inhalt_Link '
        _Cont_Text = Inhalt_Text '
        _Cont_Post = Inhalt_Post
        _Cont_Time = Inhalt_Zeit

        Init()

    End Sub
    Sub Init()
        _Mimetypes = MimeTypes.GetAllFor(_Cont_Post)
        Select Case _Class_Type
            Case "DIR"
                If String.IsNullOrEmpty(_Cont_Thumb) Then
                    If _Mimetypes("CreateThumb") = True Then
                        _Cont_Thumb = New Filetypes2(_Cont_Link)._Thumb
                    End If
                End If
                _Cont_Cach = _Mimetypes("CacheSec")
                _Cont_Mime = _Mimetypes("Mimetype")
                _Cont_Desc = _Mimetypes("Description")
                _Cont_Play = _Mimetypes("Player")
                _Cont_Show = _Mimetypes("Show")
            Case "WEB"
                _Cont_Cach = "None"
                _Cont_Mime = "None"
                _Cont_Desc = "None"
                _Cont_Show = "None"
                _Cont_Play = MimeTypes.GetOnlinePlayerFor(_Cont_Link)
            Case Else
                _Cont_Cach = "None"
                _Cont_Mime = "None"
                _Cont_Desc = "None"
                _Cont_Play = "None"
                _Cont_Show = "None"
        End Select
    End Sub
#End Region

#Region "ReadWrite_Klassen"
    Public Property Class_Name As String
        Get
            Return _Class_Name
        End Get
        Set(ByVal value As String)
            _Class_Name = value
        End Set
    End Property
    Public Property Class_Group As String
        Get
            Return _Class_Group
        End Get
        Set(ByVal value As String)
            _Class_Group = value
        End Set
    End Property
    Public Property Class_Type As String
        Get
            Return _Class_Type
        End Get
        Set(ByVal value As String)
            _Class_Type = value
        End Set
    End Property
#End Region

#Region "ReadWrite_Inhalt"
    Public Property Cont_Name
        Get
            Return _Cont_Name
        End Get
        Set(ByVal value)
            _Cont_Name = value
        End Set
    End Property
    Public Property Cont_Text
        Get
            Return _Cont_Text
        End Get
        Set(ByVal value)
            _Cont_Text = value
        End Set
    End Property
    Public Property Cont_Link
        Get
            Return _Cont_Link
        End Get
        Set(ByVal value)
            _Cont_Link = value
        End Set
    End Property
    Public Property Cont_Thumb
        Get
            Return _Cont_Thumb
        End Get
        Set(value)
            _Cont_Thumb = value
        End Set
    End Property
    Public Property Cont_Post
        Get
            Return _Cont_Post
        End Get
        Set(ByVal value)
            _Cont_Post = value
        End Set
    End Property
    Public Property Cont_Time
        Get
            Return _Cont_Time
        End Get
        Set(ByVal value)
            _Cont_Time = value
        End Set
    End Property
    Public Property _id As MongoDB.Bson.BsonObjectId
        Get
            Return _Cont_Index
        End Get
        Set(ByVal value As MongoDB.Bson.BsonObjectId)
            _Cont_Index = value
        End Set
    End Property
#End Region

#Region "ReadOnly_Inhalt"
    Public ReadOnly Property Cont_Mime As String
        Get
            If IsNothing(_Mimetypes) Then Init()
            Return _Cont_Mime
        End Get
    End Property
    Public ReadOnly Property Cont_Description As String
        Get
            If IsNothing(_Mimetypes) Then Init()
            Return _Cont_Desc
        End Get
    End Property
    Public ReadOnly Property Cont_Cache As String
        Get
            If IsNothing(_Mimetypes) Then Init()
            Return _Cont_Cach
        End Get
    End Property
    Public ReadOnly Property Cont_Player As String
        Get
            If IsNothing(_Mimetypes) Then Init()
            Return _Cont_Play
        End Get
    End Property
    Public ReadOnly Property Cont_Show As String
        Get
            If IsNothing(_Mimetypes) Then Init()
            Return _Cont_Show
        End Get
    End Property
#End Region

End Class