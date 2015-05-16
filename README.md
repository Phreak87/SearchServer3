SearchServer3
========================

### Backend (Server)

- durchsucht die lokalen Laufwerke und Netzlaufwerke rekursiv
	> Wenn die Datenbank keine Einträge enthält.<BR>
	> In gewissen Zeitabständen (in Config.xml).<BR>
	> bereinigt nicht genutzte Dateitypen (Cleaner.xml).<BR>
	> neu erstellte Dateien werden on-the-fly in der Datenbank gespeichert<BR>
	
- empfängt und Interpretiert RSS- und Atom Feeds 
	> wenn keine Einträge vorhanden sind<BR>
	> in definierten Zeitabständen.<BR>
	
- liest Textdateien in definierten Ordern 
	> mit und ohne Header <BR>
	> Beispiele enthalten(Paketlisten, Übersetzungsdateien, Adresslisten, ...).<BR>
	> Ergebnisse aus den FS-Dateien, bei denen der Dateiname den Regeln entspricht.<BR>
	
- durchsucht (parst) andere Suchmaschinen 
	> Resultate können als XML, HTML oder JSON interpretiert werden<BR>

- Als Datenspeicher dient eine MongoDB-Datenbank.
	> NoSQL Datenbankbasis und JSON-Kommunikation.<BR>
	> WiredTiger Storage Engine (sehr performant, jedoch ~1 GB Ram)<BR>
	> Default Storage Engine (langsam, ~30 MB Ram)<BR>

- Das Backend enthält einen eigenen Webserver
	> Erstellung von Thumbnails wenn diese ein Suchergebnis ist.<BR>
	> Einstellbare Cache-zeiten und Mimetypen für Postfixe.<BR>

- Zudem kann das Backend einfache Berechnungen ausführen 
	> Einheiten umrechnen<BR>
	> Formeln berechnen<BR>
	> Farben evaluieren (RAL, HEX, TEXT)<BR>
	> Smileys ausgeben<BR>
	> Datumsangaben mit Feiertagen (Bayern) berechnen<BR>
	> Mimetype Informationen ausgeben <BR>

- Programme starten sowie Ordner auf dem lokalen Computer öffnen. (In Units.xml zu erweitern).<BR>

### Frontend(Weboberfläche)<BR>

- Suche per Spracheingabe möglich<BR>

- Das Frontend stellt die Suchergebnisse in aufbereiteter Form dar.<BR>
  Unter anderem werden die Inhalte folgender Dateiendungen direkt dargestellt 
  bzw. diverse Player angeboten und interpretiert:<BR>
	> Gcode, gco, g (3D Plot und Druck) 3D und Schicht-Ansicht.<BR>
	> 3D awd, babylon, ctm, vtk, wrl, dae, pdb, ply, vrml, x3dv, x3db, ac, 3ds, md2, JSCad, SCad, js, x3d, json, amf, stl und obj- Dateien <BR>
	> 2D dxf- Dateien <BR>
	<BR>
	> Pdf (Anzeige von Chrome oder Player) und Odf <BR>
	> Epub (Ebooks)<BR>
	> Markdown (md,markdown,rst)<BR>
	<BR>
	> Audio (mp3,wav,ogg, midi) zum direkten abspielen mit ID3 Tags<BR>
	> Video (avi,mpeg,flv,webm) 3 Player zur Auswahl, Thumbnail als Vorschau, Youtube Videos mit Vorschau<BR>
	> Bilder (Png/Bmp/ico/jpeg, ...) mit Viewer zum weiterschalten und EXIF Informationen<BR>
	<BR>
	> Zip (und Komprimierte-Formate) mit direktem anzeigen von Bildern, Texten in der Zip.<BR>
	> Rar <BR>
	> Tar <BR>
	<BR>
	> Hex-Dateien <BR>
	> Xml (und alle XML-Strukturierten Formate) als Baumstruktur und Quelltext.<BR>
	> Json und Bson  als Baumstruktur und Quelltext.<BR>
	> Html (Darstellung und Sourcecode)<BR>
	> JavaScript als Coffee <BR>
	> Coffee als Javascript <BR>
	> Latex Anzeige<BR>
	> Python Interpreter <BR>
	> Excel (xlsm/xlsx) als Tabelle<BR>
	> Plaintext (txt,log,csv,lst)<BR>
	> Quelltexte (php,vb,c,bat,css,...) interpretiert (Brackets, Folding, ...)<BR>
	> Thumbnail (Für Dateien ohne Webplayer)<BR>

- Zu jedem beliebigen Dateityp (auch unbekannte) werden 
	> Icons<BR>
	> Beschreibung<BR>
	> Player<BR>
	> Mimetypen<BR>
	> Thumbnails bzw. Inhaltsvorschau <BR>
	> und weitere Informationen ausgegeben.<BR>

- Die Ergebnisse können in Unterschiedlichen Varianten angezeigt werden (Konfigurierbar in Mimes.xml):
	> In dem Ergebnisblock der Datei<BR>
	> In einem (Fenster im aktuellen Browserfenster)<BR>
	> Auf der gesamten Ergebnisseite<BR>
	> Auf der gesamten Suchseite<BR>
	> In einem neuen Tab<BR>

- Zudem haben Sie die Möglichkeit den Order zu öffnen oder die Datei mit der Standardanwendung <BR>
  ihres Computers auszuführen oder den Mimetyp zu blockieren.<BR>

- Adresslisten/Paketlisten werden separiert als Suchergebnisse mit interpretierten <BR>
  Informationen (Hyperlinks und E-Mail-Adressen) dargestellt. <BR>

- Im Downloadpaket sind hier bereits diverse Dateien wie z.B. <BR>
  de/en Übersetzung, Mimetypen, Programme, Librarys, Cheatsheets, <BR>
  Source-Referenzen und Normen enthalten<BR>

- Youtube und andere Videoquellen werden direkt angezeigt.<BR>

- Bookmarks und externe Suchanfragen werden in einem eigenen Frame mit einer gewählten Option<BR>
  (z.B. Nur Bilder) und dem Suchtext geöffnet.<BR>

- Die Ergebnisse der Suchabfrage können Sie sich dann für einen späteren Moment<BR>
  speichern oder als PDF, Excel oder CSV-Datei ausgeben lassen.<BR>

- Die angezeigten Dateiformate können einfach in der Results.js und der Config.xml<BR>
  angepasst und erweitert werden. <BR>

### Installation

- Laden Sie sich das komplette Paket mit vorkonfigurierten Einstellungen<BR>
  herunter, kompilieren Sie das Projekt in VB.Net und starten Sie die Searchserver3.exe<BR>
  im Debug-Verzeichnis. Das erste Indizieren der Laufwerke und Dateien kann u.U. einige<BR>
  Stunden Zeit in Anspruch nehmen (Je nach Anzahl der Dateien u. konfigurierten Pfaden). <BR>

- Wärend dieser Initialisierungsphase werden in der Ausgabe nur Dateien aus komplett abgeschlossenen<BR>
  Initialisierungsaufgaben angezeigt.<BR>
  Sie können die Webseite im Webbrowser (aus Sicherheitsgründen nur auf dem lokalen Computer) <BR>
  mit der Seite http://localhost:9090 öffnen.<BR>

### Testen

- Für das Testen steht im linken oberen Rand 'Debugmeldungen' für die Kommunikation zwischen Front- und<BR>
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
> [MS ShellExtensions]()<BR>
> [NCalc]()<BR>

### Javascript-Frameworks und Extensions

- [JQuery]()<BR>
> [Gridster]()<BR>
> [Superfish]()<BR>
> [Chosen]()<BR>
> [Dialogextend]()<BR>
> [Handsontable]()<BR>

- [Bootstrap]()<BR>

### Javascript-Anzeigemodule

- Text und Quelltext
> [ACE]()<BR>
> [CodeMirror]()<BR>
> [JSoneditor]()<BR>
> [XmlToJson]()<BR>
> [HexView]()<BR>
> [Coffee-to-JS]()<BR>
> [JS-to-Coffee]()<BR>
> [Skulpt]()<BR>
> [HexView]()<BR>

- 2D- und 3D Formate
> [ThreeDXF]()<BR>
> [GCodeViewer]()<BR>
> [Thingiview.js]()<BR>
> [Three.js]()<BR>
> [Three-Plugin Sea3D Reader]()<BR>
> [Scene.js]()<BR>
> [X3Dom]()<BR>
> [OpenJSCad]()<BR>
> [CoffeeScad]()<BR>
> [Hangar]()<BR>

- Video
> [Popcorn.js]()<BR>
> [Projekktor]()<BR>
> [Video.js]()<BR>

- Komprimiert
> [Zip.js]()<BR>
> [Rar.js]()<BR>
> [Tar.js]()<BR>

- Dokumente
> [Viewer.js]()<BR>
> [epubjs]()<BR>
> [SheetJS]()<BR>
> [EpicEditor]()<BR>

- Audio-Formate
> [Soundmanager2]()<BR>
> [Wavesurfer]()<BR>
> [jasmid]()<BR>
> [ID3Tag]()<BR>

- Bild-Formate
> [EXIF.js]()<BR>

### Javascript-Exportmodule

- Export-Librarys
> [csv.js]()<BR>
> [pdf.js]()<BR>

### Javascript-Sonstige

> [Head.js]()<BR>
> [D3.js]()<BR>
> [Emojione.js]()<BR>

### Quellen und Inspirationen

> [Yacy]()<BR>
> [Searx]()<BR>
> [DuckDuckGo Bang!]()<BR>
> [DuckDuckGo ZeroClickInfo]()<BR>

### Text-Indizierte Dateien

> [DE-EN_Translation]()<BR>
> [Debian-Packages]()<BR>
> [NodeJS Packages]()<BR>
> [JS-Usefull]()<BR>
> [Awesome Java](https://github.com/akullpp/awesome-java)