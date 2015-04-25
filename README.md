
SearchServer3
========================

### Backend (Server)

Das Backend <BR>
- durchsucht die lokalen Laufwerke rekursiv und filtert diese auf gültige Dateitypen (Cleaner.xml).<BR>
  (Während der Searchserver läuft werden alle neu erstellten Dateien direkt in der Datenbank gespeichert<BR>
  sowie ein Refresh nach einer definierten Zeit ausgeführt.)<BR>
- empfängt und Interpretiert RSS- und Atom Feeds in definierten Zeitabständen.<BR>
- liest alle Textdateien in Ordern (mit und ohne Header) ein (Paketlisten, Übersetzungsdateien, Adresslisten, ...).<BR>
- durchsucht (parst) andere Suchmaschinen mittels Json/Xml/Html als Xpath.<BR>

Alle indizierten Inhalte werden in einer MongoDB-Datenbank für eine schnelle Suche gespeichert.<BR>

Das Backend enthält einen eigenen Webserver, der bei lokalen Dateien (sofern<BR>
angegeben in der Config) Thumbnails erstellt sofern dies für den jeweiligen Dateityp aktiviert wurde.<BR>

Zudem kann das Backend einfache Berechnungen ausführen, Einheiten umrechnen, Farben evaluieren,<BR>
Smileys ausgeben, Datumsangaben mit Feiertagen (Bayern) berechnen, Mimetypes erkennen und Programme <BR>
starten sowie Ordner auf dem lokalen Computer öffnen. (In Units.xml zu erweitern).<BR>

### Frontend(Weboberfläche)<BR>

Das Frontend stellt die Suchergebnisse grafisch dar.<BR>
Unter anderem werden folgende Inhalte direkt dargestellt und interpretiert:<BR>
- Gcode (3D Plot und Druck) 3D und Schicht-Ansicht.<BR>
- 3D stp und obj- Dateien <BR>
- Pdf (PDF-Anzeige von Chrome oder Player)<BR>
- Audio (mp3,wav,ogg) zum direkten abspielen<BR>
- Video (avi,mpeg,flv,webm) 3 Player zur Auswahl, Thumbnail als Vorschau<BR>
- Bilder (Png/Bmp/ico/jpeg, ...) mit Viewer zum weiterschalten<BR>
- Zip (und Komprimierte-Formate) mit direktem anzeigen von Bildern, Texten in der Zip.<BR>
- Rar<BR>
- Epub (Ebooks)<BR>
- Xml (und alle XML-Strukturierten Formate) als aufklappbare Baumstruktur.<BR>
- Json und Bson als aufklappbare Baumstruktur.<BR>
- Html (Darstellung und Sourcecode)<BR>
- Markdown (md,markdown,rst)<BR>
- Excel (xlsm/xlsx) als Tabelle<BR>
- Plaintext (txt,log,csv,lst)<BR>
- Quelltexte (js,php,vb,c,bat,css,...) interpretiert (Brackets, Folding, ...)<BR>
- Thumbnail (Für Dateien ohne Webplayer)<BR>

Zu jedem beliebigen Dateityp (auch unbekannte) werden Icons, Beschreibung, Player, 
Mimetypen und weitere Informationen ausgegeben.<BR>
Zudem haben Sie die Möglichkeit den Order zu öffnen oder die Datei mit der Standardanwendung <BR>
ihres Computers auszuführen oder den Mimetyp zu blockieren.<BR>

Die Ergebnisse können (beim anwählen) in einem 'Fenster im Fenster', einem Tab, der Ergebnisseite, <BR>
der Suchseite oder in der Ergebnisleiste eingeordnet dargestellt werden.(Konfigurierbar in Mimes.xml) <BR>

Adresslisten/Paketlisten werden separiert als Suchergebnisse mit interpretierten <BR>
Informationen (Hyperlinks und E-Mail-Adressen) dargestellt. <BR>

Im Downloadpaket sind hier bereits diverse Dateien wie z.B. <BR>
de/en Übersetzung, Mimetypen, Programme, Librarys, Cheatsheets, <BR>
Source-Referenzen und Normen enthalten<BR>

Youtube und andere Videoquellen werden direkt angezeigt.<BR>

Bookmarks und externe Suchanfragen werden in einem eigenen Frame mit einer gewählten Option<BR>
(z.B. Nur Bilder) und dem Suchtext geöffnet.<BR>

Die Ergebnisse der Suchabfrage können Sie sich dann für einen späteren Moment<BR>
speichern oder als PDF, Excel oder CSV-Datei ausgeben lassen.<BR>

Die angezeigten Dateiformate können einfach in der Results.js und der Config.xml<BR>
angepasst und erweitert werden. <BR>

### Installation

Laden Sie sich das komplette Paket mit vorkonfigurierten Einstellungen<BR>
herunter, kompilieren Sie das Projekt in VB.Net und starten Sie die Searchserver3.exe<BR>
im Debug-Verzeichnis. Das erste Indizieren der Laufwerke und Dateien kann u.U. einige<BR>
Stunden Zeit in Anspruch nehmen (Je nach Anzahl der Dateien u. konfigurierten Pfaden). <BR>

Wärend dieser Initialisierungsphase werden in der Ausgabe nur Dateien aus komplett abgeschlossenen<BR>
Initialisierungsaufgaben angezeigt.<BR>
Sie können die Webseite im Webbrowser (aus Sicherheitsgründen nur auf dem lokalen Computer) <BR>
mit der Seite http://localhost:9090 öffnen.<BR>

### Testen

Für das Testen steht im linken oberen Rand 'Debugmeldungen' für die Kommunikation zwischen Front- und<BR>
Backend und 'Testseiten' für das Testen einzelner Module zur Verfügung.<BR>
Der SearchServer kann zusätzlich mit der Konfigurationsdatei als Parameter gestartet werden. Das erleichtert das
analysieren von Teilfunktionen und reduziert die Ergebnisausgabe. Bevor Sie die konfigurationsdatei wechseln
sollten Sie jedoch ein Backup der DIR Collection erstellen, da die Datenbank bei einer neuen Config gelöscht werden muss.

## Referenzen

### CSS-Librarys

> [Hover]()<BR>
> [Skeleton]()<BR>

### .Net Librarys

> [MongoDB]()<BR>
> [ShellExtensions]()<BR>
> [NCalc]()<BR>

### Javascript-Frameworks und Extensions

> [JQuery]()<BR>
> [JQuery - Gridster]()<BR>
> [JQuery - Superfish]()<BR>
> [JQuery - Chosen]()<BR>
> [JQuery - Dialogextend]()<BR>
> [JQuery - Handsontable]()<BR>

> [Bootstrap]()<BR>

### Javascript-Anzeigemodule

> [SheetJS]()<BR>
> [CodeMirror]()<BR>
> [EpicEditor]()<BR>
> [GCodeEditor]()<BR>
> [Three.js]()<BR>
> [Popcorn.js]()<BR>
> [Projekktor]()<BR>
> [Video.js]()<BR>
> [Zip.js]()<BR>
> [Rar.js]()<BR>
> [Viewer.js]()<BR>
> [Soundmanager2]()<BR>
> [JSoneditor.js]()<BR>
> [XmlToJson]()<BR>
> [epub.js]()<BR>
> [EXIF.js]()<BR>
> [ThreeDXF]()<BR>
> [HexView]()<BR>
> [OpenJSCad]()<BR>

### Javascript-Sonstige

> [Head.js]()<BR>
> [D3.js]()<BR>
> [Emojione.js]()<BR>
> [csv.js]()<BR>
> [pdf.js]()<BR>

### Andere Suchmaschinen

> [Yacy]()<BR>
> [Searx]()<BR>
> [DuckDuckGo Bang!]()<BR>
> [DuckDuckGo ZeroClickInfo]()<BR>

### IndexFiles

> [DE-EN_Translation]()<BR>
> [Debian-Packages]()<BR>
> [NodeJS Packages]()<BR>
> [JS-Usefull]()<BR>
> [Awesome Java](https://github.com/akullpp/awesome-java)
