Imports MongoDB.Bson
Imports MongoDB.Driver
Imports System.Threading
Imports System.IO
Imports MongoDB.Driver.Builders
Imports System.Security.Principal
Imports System.Security.AccessControl

Namespace CLS
    Public Class DIR

#Region "Klasseneigenschaften"
        Public _ClassName As String = ""           ' Der Name der Klasse (z.B. Dokumente)
        Dim _ClassGroup As String = ""          ' Die Gruppe der Klasse (z.B. Privat)
        Dim _ClassRoot As String = ""           ' Der Quellpfad
        Dim _ClassRefresh As Integer = 0        ' Zeitraum für Reinitialisierung
        Dim _ClassWatch As Boolean = False      ' Update bei Änderungen am FS
        Dim _ClassMessage As BsonDocument       ' Der Statuseintrag in der DB
#End Region
#Region "Statusmeldungen"
        Dim _Files As Double = 0
        Dim _Todos As Integer = 0
        Dim _Status As System.Timers.Timer      ' Status (Anzahl Dateien)
        Dim _Starts As System.Timers.Timer      ' Starts für Zeitbasiertes starten
        Dim _Timer As Stopwatch
        Dim _TodoCol As New List(Of CLS_DIR)

        Public _IsInitDone As Boolean = False       ' Wurde die Grundinitialisierung durchgeführt ?
        Public _IsWatching As Boolean = False       ' Wird der Ordner auf Änderungen überwacht ?
        Public _IsRefreshing As Boolean = False     ' Findet ein Refresh für den Ordner statt ?
        Public _IsInitializing As Boolean = False   ' Wird der Ordner zum 1. mal Initialisiert ?
#End Region
#Region "Collections"
        Dim _Collection As MongoCollection      ' Die Haupt-Collection
        Dim _TCollection As MongoCollection     ' Die TMP-Collection
#End Region
#Region "Events"
        Event Log(ByVal Text As String)
        Event Initialized()
#End Region

        Class CLS_DIR
            Public _Path As String = ""
            Sub New(ByVal Path As String)
                _Path = Path
            End Sub
        End Class
        Sub New(ByVal Name As String, ByVal Group As String, ByVal Path As String, ByVal Refresh As Integer, ByVal Watch As Boolean, ByVal Collection As MongoCollection, ByVal TCollection As MongoCollection, Message As BsonDocument)
            _ClassName = Name
            _ClassGroup = Group
            _ClassRoot = Path
            _ClassRefresh = Refresh
            _ClassWatch = Watch
            _Collection = Collection
            _TCollection = TCollection
            _ClassMessage = Message

            If My.Computer.FileSystem.DirectoryExists(Path) = False Then
                Console.WriteLine("#DIR: {0} - Pfad nicht gefunden: " & Path, _ClassName)
                _ClassMessage("Status") = "Ordner nicht gefunden"
                IDX.Save(_ClassMessage)
            End If

        End Sub

        Sub Init_Empty()
            ' DB_PROD_CleanGarbage()
            Dim Check As New QueryDocument : Check.Add("SourceClassName", _ClassName)
            Dim ICheck As Integer = _Collection.Count(Check)
            If ICheck = 0 Then
                If CheckErrs(_ClassRoot) = True Then _IsInitDone = True : RaiseEvent Initialized() : Exit Sub
                Console.WriteLine("#DIR: {0} - Keine Einträge - Erstelle Index (Live-Update)", EnsureLen(_ClassName, 15))
                _IsInitializing = True : Start()
            Else
                Console.WriteLine("#DIR: {1} - {0} Einträge in Collection", ICheck, EnsureLen(_ClassName, 15))
                _IsInitDone = True : RaiseEvent Initialized()
            End If
        End Sub
        Sub Init_Watch()
            If CheckErrs(_ClassRoot) = True Then Exit Sub
            If _ClassRefresh > 0 Then
                Console.WriteLine("#DIR: {0} - FS-Update wird eingerichtet Update alle {1} Min.", EnsureLen(_ClassName, 15), _ClassRefresh)
                Dim Starts As New System.Timers.Timer
                Starts.Interval = _ClassRefresh * 60 * 1000
                AddHandler Starts.Elapsed, AddressOf Start
                Starts.Start()
            End If
        End Sub
        Sub Init_Refresh()
            If CheckErrs(_ClassRoot) = True Then Exit Sub
            If _ClassWatch = True Then
                Dim FSW As New FileSystemWatcher
                FSW.Filter = "*"
                FSW.Path = _ClassRoot
                FSW.NotifyFilter = _
                    NotifyFilters.CreationTime Or _
                    NotifyFilters.LastWrite Or _
                    NotifyFilters.FileName Or
                    NotifyFilters.LastAccess Or _
                    NotifyFilters.Attributes
                AddHandler FSW.Created, AddressOf FCreated
                AddHandler FSW.Renamed, AddressOf FCreated
                FSW.IncludeSubdirectories = True
                FSW.EnableRaisingEvents = True
                Console.WriteLine("#DIR: {0} - FS-Watch eingerichtet", EnsureLen(_ClassName, 15))
            End If
        End Sub

        Function CheckErrs(Dir As String) As Boolean
            If Dir.Length > 248 Then Return True
            If Dir.Contains("$Recycle.Bin") Then Return True
            If Directory.Exists(Dir) = False Then Return True

            Dim DirAtt = My.Computer.FileSystem.GetDirectoryInfo(Dir)
            Dim UAC As New UserAccessRights(Dir)
            If UAC.CanListDirectory = False Then Return True
            If UAC.CanRead = False Then Return True

            If DirAtt.Attributes = FileAttributes.System Then Return True
            If DirAtt.Attributes = FileAttributes.Hidden Then Return True
            If DirAtt.Attributes.ToString.Contains("ReparsePoint") Then Return True
            Return False
        End Function

        Private Sub Start()

            If _Todos > 0 Then Console.WriteLine("#DIR: {0} - Wird bereits initialisiert, Interval {1} Min.", EnsureLen(_ClassName, 15), _ClassRefresh) : Exit Sub
            Console.WriteLine("#DIR: {0} - Starte Initialisierung", EnsureLen(_ClassName, 15))

            Dim Remove As New QueryDocument : Remove.Add("SourceClassName", _ClassName):_TCollection.Remove(Remove)

            _Timer = New Stopwatch : _Timer.Start()
            _Status = New System.Timers.Timer
            AddHandler _Status.Elapsed, AddressOf LogStatus
            _Status.Interval = 2000
            _Status.Start()

            _Files = 0
            Dim DoPath As New CLS_DIR(_ClassRoot)
            AppendOBJ(DoPath) : Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFolder, DoPath)

        End Sub

        Sub AppendOBJ(_obj As CLS_DIR)
            Monitor.Enter(_TodoCol)
            _TodoCol.Add(_obj) : Thread.Sleep(1) : _Todos = _TodoCol.Count
            Monitor.Exit(_TodoCol)
        End Sub
        Sub RemoveOBJ(_obj As CLS_DIR)
            Monitor.Enter(_TodoCol)
            _TodoCol.Remove(_obj) : Thread.Sleep(1) : _Todos = _TodoCol.Count
            Monitor.Exit(_TodoCol)
        End Sub

#Region "Indizierungen Ordner und Dateien"
        Sub IndexFolder(ByVal _obj As CLS_DIR)
            If IsNothing(_obj) Then RemoveOBJ(_obj) : Exit Sub

            If Directory.GetFiles(_obj._Path).Count > 0 Then
                Dim DoPath As New CLS_DIR(_obj._Path) : AppendOBJ(DoPath)
                Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFiles, DoPath)
            End If

            If Directory.GetDirectories(_obj._Path).Count > 0 Then
                For Each Ordner In Directory.GetDirectories(_obj._Path)
                    If CheckErrs(Ordner) = False Then
                        Dim DoPath2 As New CLS_DIR(Ordner) : AppendOBJ(DoPath2)
                        Threading.ThreadPool.QueueUserWorkItem(AddressOf IndexFolder, DoPath2)
                    End If
                Next
            End If

            RemoveOBJ(_obj)
        End Sub
        Sub IndexFiles(ByVal _obj As CLS_DIR)
            If IsNothing(_obj) Then RemoveOBJ(_obj) : Exit Sub

            Dim Res As New List(Of BsonDocument)

            For Each Datei In Directory.GetFiles(_obj._Path)
                Dim Post As String = ".Nothing"
                If Datei.Contains(".") Then Post = LCase(Mid(Datei, InStrRev(Datei, ".")))

                Dim F As New BsonDocument
                F.Add("SourceClassType", "DIR")
                F.Add("SourceClassName", _ClassName)
                F.Add("SourceClassGroup", _ClassGroup)

                F.Add("ContentTime", New BsonDateTime(Now))
                F.Add("ContentThumb", New Filetypes2(Datei)._Thumb)
                F.Add("ContentPost", Post)

                F.Add("objName", Mid(Datei, InStrRev(Datei, "\") + 1))
                F.Add("objLink", "http://localhost:9090/" & Datei)
                Res.Add(F)
            Next

            If Res.Count > 0 Then
                Try
                    _Files = _Files + Res.Count
                    _TCollection.InsertBatch(Res)
                Catch : End Try
            End If

            RemoveOBJ(_obj)
            Res = Nothing
        End Sub
        Private Sub FCreated(ByVal sender As Object, ByVal e As FileSystemEventArgs)
            Console.WriteLine("#DIR: {0} - Live-Update Event {1}", _ClassName, e.Name)
            Dim Datei As String = e.Name
            Dim Post As String = ".Nothing"
            If Datei.Contains(".") Then Post = LCase(Mid(Datei, InStrRev(Datei, ".")))

            Dim F As New BsonDocument
            F.Add("SourceClassType", "DIR")
            F.Add("SourceClassName", _ClassName)
            F.Add("SourceClassGroup", _ClassGroup)

            F.Add("ContentTime", New BsonDateTime(Now))
            F.Add("ContentThumb", New Filetypes2(Datei)._Thumb)
            F.Add("ContentPost", Post)

            F.Add("objName", Mid(Datei, InStrRev(Datei, "\") + 1))
            F.Add("objLink", "http://localhost:9090/" & Datei)
            _Collection.Insert(F)

        End Sub
#End Region

#Region "Datenbank"
        Sub DB_PROD_CleanGarbage()
            ' -------------------------------------------------------
            ' Bereinige alle unnötigen Postfixe 
            ' -------------------------------------------------------
            Dim DBPre As Integer = _Collection.Count
            Dim N As New List(Of IMongoQuery) : N.Add(Query.Matches("objLink", "/Recycle.Bin/"))
            For Each eintrag In MimeTypes.RemoTypes : N.Add(Query.EQ(eintrag("Field"), eintrag("Value"))) : Next
            _Collection.Remove(Query.Or(N))
            Dim DBAft As Integer = _Collection.Count
            Console.WriteLine("#DIR: {2} - {0} von {1} Einträgen gelöscht (Postfixe)", DBPre - DBAft, DBPre, EnsureLen(_ClassName, 15))
            Thread.Sleep(1000)
        End Sub
        Sub DB_TMP_CleanGarbage()
            ' -------------------------------------------------------
            ' Bereinige alle unnötigen Postfixe vor Sync
            ' -------------------------------------------------------
            Dim DBPre As Integer = _TCollection.Count
            Dim N As New List(Of IMongoQuery) : N.Add(Query.Matches("objLink", "/Recycle.Bin/"))
            For Each eintrag In MimeTypes.RemoTypes : N.Add(Query.EQ(eintrag("Field"), eintrag("Value"))) : Next
            _TCollection.Remove(Query.Or(N))
            Dim DBAft As Integer = _TCollection.Count
            Console.WriteLine("#DIR: {2} - {0} von {1} Einträgen gelöscht (Postfixe)", DBPre - DBAft, DBPre, EnsureLen(_ClassName, 15))
            Thread.Sleep(1000)
        End Sub
        Sub DB_AKT_CleanClass()
            Dim QDOc As New QueryDocument : QDOc.Add("SourceClassName", _ClassName)
            Dim IColOld As Integer = _Collection.Count : _Collection.Remove(QDOc)
            Dim IColNew As Integer = _Collection.Count
            Dim IColDif As Integer = IColOld - IColNew
            Console.WriteLine("#DIR: {0} - {1}  Einträge in ProuktivDB gelöscht", EnsureLen(_ClassName, 15), IColDif)
            Threading.Thread.Sleep(1000)
        End Sub
        Sub DB_TMP_TO_AKT()
            Dim IUpdAkt As Integer = 0
            Dim IColAft As Integer = 0
            Dim QDOc As New QueryDocument : QDOc.Add("SourceClassName", _ClassName)
            Dim Coll As MongoCursor(Of BsonDocument) = _TCollection.FindAs(Of BsonDocument)(QDOc)
            Dim MOpt As New MongoInsertOptions : MOpt.Flags = InsertFlags.ContinueOnError
            If Coll.Count > 0 Then
                IUpdAkt = Coll.Count : _Collection.InsertBatch(Coll, MOpt)
                IColAft = _Collection.Count
                _TCollection.Remove(QDOc)
            End If
            Console.WriteLine("#DIR: {0} - {1} Einträge synchronisiert (TMPDB -> ProduktivDB)", EnsureLen(_ClassName, 15), Coll.Count)
            Thread.Sleep(1000)
        End Sub
#End Region

        Private Sub LogStatus(ByVal sender As Object, ByVal e As Timers.ElapsedEventArgs)
            If IsNothing(_Timer) Then Exit Sub
            Dim Time As String = _Timer.Elapsed.Hours & ":" & _Timer.Elapsed.Minutes & ":" & _Timer.Elapsed.Seconds
            Console.WriteLine("#DIR: {2} - {1} Dateien mit {0} Threads in {3}", EnsureLen(_Todos, 6), EnsureLen(_Files, 6), EnsureLen(_ClassName, 15), EnsureLen(Time, 8))
            '_Todos = 0
            If _Todos <= 0 Then
                _Timer = Nothing
                If Not IsNothing(_Status) Then _Status.Stop() : _Status = Nothing

                Dim SW As New Stopwatch : SW.Start()

                DB_TMP_CleanGarbage()
                DB_AKT_CleanClass()
                DB_TMP_TO_AKT()

                Console.WriteLine("#DIR: {0} - Vorgang abgeschlossen in {1}", EnsureLen(_ClassName, 15), SW.Elapsed)
                If _IsInitializing = True Then _IsInitializing = False : _IsInitDone = True : RaiseEvent Initialized()
            End If
        End Sub
        Function EnsureLen(ByVal Text As String, Length As Integer) As String
            If Len(Text) > Length Then Return Text
            Return Space(Length - Len(Text)) & Text
        End Function

        Public Class UserAccessRights

#Region " Deklarationen - Felder "

            Private pFileInfo As FileInfo
            Private pFileAttr As FileAttributes
            Private pRights As Generic.Dictionary(Of String, AccessRight)
            Private pUser As WindowsIdentity

#End Region

#Region " Konstruktoren "

            Public Sub New(ByVal path As String)
                If Not File.Exists(path) AndAlso Not Directory.Exists(path) Then
                    Exit Sub
                End If

                pFileInfo = New FileInfo(path)
                pUser = WindowsIdentity.GetCurrent
                pRights = New Dictionary(Of String, AccessRight)

                ' Iteriere durch jede Berechtigung und füge diese dem Dictionary hinzu
                For Each r As String In [Enum].GetNames(GetType(FileSystemRights))
                    pRights.Add(r, New AccessRight)
                Next

                ' Intialisiere die Benutzerrechte für den Pfad
                Call InitializeRights()
            End Sub

#End Region

#Region " Eigenschaften "

            Public ReadOnly Property CanAppendData() As Boolean
                Get
                    Return Not pRights(FileSystemRights.AppendData.ToString).Deny AndAlso _
                           pRights(FileSystemRights.AppendData.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanChangePermissions() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ChangePermissions.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ChangePermissions.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanCreateDirectories() As Boolean
                Get
                    Return Not pRights(FileSystemRights.CreateDirectories.ToString).Deny AndAlso _
                           pRights(FileSystemRights.CreateDirectories.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanCreateFiles() As Boolean
                Get
                    Return Not pRights(FileSystemRights.CreateFiles.ToString).Deny AndAlso _
                           pRights(FileSystemRights.CreateFiles.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanDelete() As Boolean
                Get
                    Return Not pRights(FileSystemRights.Delete.ToString).Deny AndAlso _
                           pRights(FileSystemRights.Delete.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanDeleteSubdirectoriesAndFiles() As Boolean
                Get
                    Return Not pRights(FileSystemRights.DeleteSubdirectoriesAndFiles.ToString).Deny AndAlso _
                           pRights(FileSystemRights.DeleteSubdirectoriesAndFiles.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanExecuteFile() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ExecuteFile.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ExecuteFile.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanFullControl() As Boolean
                Get
                    Return Not pRights(FileSystemRights.FullControl.ToString).Deny AndAlso _
                           pRights(FileSystemRights.FullControl.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanListDirectory() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ListDirectory.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ListDirectory.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanModify() As Boolean
                Get
                    Return Not pRights(FileSystemRights.Modify.ToString).Deny AndAlso _
                           pRights(FileSystemRights.Modify.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanRead() As Boolean
                Get
                    Return Not pRights(FileSystemRights.Read.ToString).Deny AndAlso _
                           pRights(FileSystemRights.Read.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanReadAndExecute() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ReadAndExecute.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ReadAndExecute.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanReadAttributes() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ReadAttributes.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ReadAttributes.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanReadData() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ReadData.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ReadData.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanReadExtendedAttributes() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ReadExtendedAttributes.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ReadExtendedAttributes.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanReadPermissions() As Boolean
                Get
                    Return Not pRights(FileSystemRights.ReadPermissions.ToString).Deny AndAlso _
                           pRights(FileSystemRights.ReadPermissions.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanSynchronize() As Boolean
                Get
                    Return Not pRights(FileSystemRights.Synchronize.ToString).Deny AndAlso _
                           pRights(FileSystemRights.Synchronize.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanTakeOwnership() As Boolean
                Get
                    Return Not pRights(FileSystemRights.TakeOwnership.ToString).Deny AndAlso _
                           pRights(FileSystemRights.TakeOwnership.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanTraverse() As Boolean
                Get
                    Return Not pRights(FileSystemRights.Traverse.ToString).Deny AndAlso _
                           pRights(FileSystemRights.Traverse.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanWrite() As Boolean
                Get
                    Return Not pRights(FileSystemRights.Write.ToString).Deny AndAlso _
                           pRights(FileSystemRights.Write.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanWriteAttributes() As Boolean
                Get
                    Return Not pRights(FileSystemRights.WriteAttributes.ToString).Deny AndAlso _
                           pRights(FileSystemRights.WriteAttributes.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanWriteData() As Boolean
                Get
                    Return Not pRights(FileSystemRights.WriteData.ToString).Deny AndAlso _
                           pRights(FileSystemRights.WriteData.ToString).Allow
                End Get
            End Property
            Public ReadOnly Property CanWriteExtendedAttributes() As Boolean
                Get
                    Return Not pRights(FileSystemRights.WriteExtendedAttributes.ToString).Deny AndAlso _
                           pRights(FileSystemRights.WriteExtendedAttributes.ToString).Allow
                End Get
            End Property
            Public Property Path() As String
                Get
                    Return pFileInfo.FullName
                End Get
                Set(ByVal value As String)
                    pFileInfo = New FileInfo(value)
                    Call InitializeRights()
                End Set
            End Property

#End Region

#Region " Methoden - Function "
            Private Function Contains(ByVal right As String, ByVal rule As FileSystemAccessRule) As Boolean
                ' Zeichenkette (Berechtigung) parsen
                Dim fsr As FileSystemRights = DirectCast([Enum].Parse(GetType(FileSystemRights), right),  _
                                              FileSystemRights)

                ' Prüfen, ob diese vorhanden ist
                Return (fsr And rule.FileSystemRights) = fsr
            End Function
            Public Function GetAllowedRights() As String
                Return GetRights(True)
            End Function
            Public Function GetDeniedRights() As String
                Return GetRights(False)
            End Function
            Private Function GetRights(ByVal rightState As Boolean) As String
                ' StringBuilder verwenden
                Dim sb As New System.Text.StringBuilder

                ' Iteriere durch alle Eigenschaften dieser Klasse
                For Each pi In Me.GetType().GetProperties()
                    ' Prüfe, ob die Eigenschaft mit "Can" beginnt und lesbar ist
                    If pi.Name.StartsWith("Can") AndAlso pi.CanRead Then
                        ' Wert der Eigeschaft ermitteln
                        Dim value As String = pi.GetValue(Me, Nothing).ToString
                        Dim result As Boolean

                        ' Wert der Eigenschaft in Boolean parsen
                        If Boolean.TryParse(value, result) Then
                            ' Prüfe auf Übereinstimmung und füge evtl. den Name der Berechtigung hin
                            If result = rightState Then sb.Append(pi.Name.Substring(3) & "; ")
                        End If
                    End If
                Next

                ' Prüfe ob länger als 2 Zeichen und schneide die letzten beiden Zeichen ab (Leerzeichen und Semikolon)
                If sb.Length > 2 Then sb.Remove(sb.Length - 2, 2)

                ' Zeichenkette zurückgeben
                Return sb.ToString
            End Function

#End Region

#Region " Methoden - Sub "
            Private Sub InitializeRights()
                ' Prüfe, ob Benutzer Nothing ist
                If pUser.User Is Nothing Then Exit Sub
                If String.IsNullOrEmpty(Me.Path) Then Call ResetRights() : Exit Sub

                Dim acl As AuthorizationRuleCollection

                Try
                    ' Ermittle alle AuthorizationRule-Objekte
                    acl = pFileInfo.GetAccessControl().GetAccessRules( _
                          True, True, GetType(SecurityIdentifier))
                Catch ex As UnauthorizedAccessException
                    Exit Sub
                End Try

                ' Iteriere durch jede enthaltende Rule
                For i As Integer = 0 To acl.Count - 1
                    ' FileSystemAccessRule ermitteln
                    Dim rule As FileSystemAccessRule = DirectCast(acl(i), FileSystemAccessRule)

                    ' Prüfe, ob diese Regel für den aktuellen Benutzer gilt
                    If pUser.User.Equals(rule.IdentityReference) Then
                        ' Iteriere durch jede Berechtigung
                        For Each r As String In [Enum].GetNames(GetType(FileSystemRights))
                            ' Prüfe, ob die Berechtigung in der aktuellen Rule enthalten ist
                            If Contains(r, rule) Then
                                ' Prüfe, ob diese Berechtigung verweigert wird
                                If AccessControlType.Deny = rule.AccessControlType Then
                                    ' true -> Eigenschaft des Elementes aus dem Dictionary setzen
                                    pRights(r).Deny = True
                                Else
                                    ' false -> Eigenschaft des Elementes aus dem Dictionary setzen
                                    pRights(r).Allow = True
                                End If
                            End If
                        Next
                    End If
                Next

                ' Ermittle die Namen aller Gruppen, in denen der Benutzer ist
                Dim groups As IdentityReferenceCollection = pUser.Groups

                ' Iteriere durch jede Gruppe
                For j As Integer = 0 To groups.Count - 1
                    ' Iteriere durch jede enthaltende Rule
                    For i As Integer = 0 To acl.Count - 1
                        ' FileSystemAccessRule ermitteln
                        Dim rule As FileSystemAccessRule = DirectCast(acl(i), FileSystemAccessRule)

                        ' Prüfe, ob diese Regel für die aktuelle Gruppe gilt
                        If groups(j).Equals(rule.IdentityReference) Then
                            ' Iteriere durch jede Berechtigung
                            For Each r As String In [Enum].GetNames(GetType(FileSystemRights))
                                ' Prüfe, ob die Berechtigung in der aktuellen Rule enthalten ist
                                If Contains(r, rule) Then
                                    ' Prüfe, ob diese Berechtigung verweigert wird
                                    If AccessControlType.Deny = rule.AccessControlType Then
                                        ' true -> Eigenschaft des Elementes aus dem Dictionary setzen
                                        pRights(r).Deny = True
                                    Else
                                        ' false -> Eigenschaft des Elementes aus dem Dictionary setzen
                                        pRights(r).Allow = True
                                    End If
                                End If
                            Next
                        End If
                    Next
                Next
            End Sub

            ''' <summary>
            ''' Setzt alle Berechtigungen zurück.
            ''' </summary>
            ''' <remarks></remarks>
            Private Sub ResetRights()
                ' Iteriere durch jeden Eintrag im Dictionary
                For Each pair In pRights
                    ' Setze alle Eigenschaften zurück
                    Dim ar As AccessRight = pair.Value

                    ar.Allow = False
                    ar.Deny = False
                Next
            End Sub

#End Region

#Region " Nested Types "

            ''' <summary>
            ''' Stellt die Eigenschaften für die Zugriffsrechte einer Berechtigung bereit.
            ''' </summary>
            ''' <remarks></remarks>
            Private Class AccessRight
                Private pAllow As Boolean
                Private pDeny As Boolean

                ''' <summary>
                ''' Ruft einen Wert ab, der angibt, ob die Berechtigung verweigert wird.
                ''' </summary>
                ''' <value></value>
                ''' <returns>true, wenn die Berechtigung verweigert wird, ansonsten false.</returns>
                ''' <remarks></remarks>
                Public Property Deny() As Boolean
                    Get
                        Return pDeny
                    End Get
                    Set(ByVal value As Boolean)
                        pDeny = value
                    End Set
                End Property

                ''' <summary>
                ''' Ruft einen Wert ab, der angibt, ob die Berechtigung erlaubt wird.
                ''' </summary>
                ''' <value></value>
                ''' <returns>true, wenn die Berechtigung erlaubt wird, ansonsten false.</returns>
                ''' <remarks></remarks>
                Public Property Allow() As Boolean
                    Get
                        Return pAllow
                    End Get
                    Set(ByVal value As Boolean)
                        pAllow = value
                    End Set
                End Property
            End Class

#End Region

        End Class
    End Class

End Namespace

