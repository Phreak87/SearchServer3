SearchServer3
========================

### Backend (Server)

Das Backend 
- durchsucht die lokalen Laufwerke rekursiv und filtert diese auf gültige Dateitypen (Cleaner.xml).
  (Während der Searchserver läuft werden alle neu erstellten Dateien direkt in der Datenbank gespeichert
  sowie ein Refresh nach einer definierten Zeit ausgeführt.)
- empfängt RSS- und Atom Feeds.
- liest Textdateien ein (Paketlisten, Übersetzungsdateien, Adresslisten, ...).
- durchsucht (parst) andere Suchmaschinen mittels Json/Xml/Html als Xpath.

Alle indizierten Inhalte werden in einer MongoDB-Datenbank für eine schnelle Suche gespeichert.

Das Backend enthält einen eigenen Webserver, der bei lokalen Dateien (sofern
angegeben in der Config) Thumbnails erstellt sofern dies für den jeweiligen Dateityp aktiviert wurde.

Zudem kann das Backend einfache Berechnungen ausführen, Einheiten umrechnen, Farben evaluieren,
Datumsangaben mit Feiertagen (Bay.) berechnen und Mimetypes erkennen und Programme 
starten sowie Ordner auf dem lokalen Computer öffnen.

### Frontend(Weboberfläche)

Das Frontend stellt die Suchergebnisse grafisch dar.
Unter anderem werden folgende Inhalte direkt dargestellt:
- Gcode (3D Plot und Druck)
- 3D stp und obj- Dateien
- Pdf (PDF-Anzeige von Chrome oder Player)
- Audio (mp3,wav,ogg)
- Video (avi,mpeg,flv,webm) 3 Player zur Auswahl
- Bilder (Png/Bmp/ico/jpeg, ...) 
- Zip (und Komprimierte-Formate)
- Rar
- Epub (Ebooks)
- Xml (und alle XML-Strukturierten Formate)
- Json und Bson
- Html (Darstellung und Sourcecode)
- Markdown (md,markdown,rst)
- Excel (xlsm/xlsx)
- Plaintext (txt,log,csv,lst)
- Quelltexte (js,php,vb,c,bat,css,...)

Zu jedem beliebigen Dateityp (auch unbekannte) haben Sie die Möglichkeit den Order
zu öffnen oder die Datei mit der Standardanwendung ihres Computers auszuführen.

Die Ergebnisse können (beim anwählen) in einem 'Fenster im Fenster', einem Tab, der Ergebnisseite, 
der Suchseite oder in der Ergebnisleiste eingeordnet dargestellt werden.

Adresslisten/Paketlisten werden separiert als Suchergebnisse mit interpretierten 
Informationen (Hyperlinks und E-Mail-Adressen) dargestellt. 

Im Downloadpaket sind hier bereits diverse Dateien wie z.B. 
de/en Übersetzung, Mimetypen, Programme, Librarys, Cheatsheets, 
Source-Referenzen und Normen enthalten

Youtube und andere Videoquellen werden direkt angezeigt.

Bookmarks werden in einem eigenen Frame geöffnet und die Suchanfrage direkt eingetragen.

Die Ergebnisse der Suchabfrage können Sie sich dann für einen späteren Moment
speichern oder als PDF, Excel oder CSV-Datei ausgeben lassen.

Die angezeigten Dateiformate können einfach in der Results.js und der Config.xml
erweitert werden. 

### Installation
Laden Sie sich das komplette Paket mit vorkonfigurierten Einstellungen
herunter, kompilieren Sie das Projekt in VB.Net und starten Sie die Searchserver3.exe
im Debug-Verzeichnis. Das erste Indizieren der Laufwerke und Dateien kann u.U. einige
Stunden Zeit in Anspruch nehmen (Je nach Anzahl der Dateien u. konfigurierten Pfaden). 

Wärend dieser Initialisierungsphase werden in der Ausgabe nur Dateien aus komplett abgeschlossenen
Initialisierungsaufgaben angezeigt.
Sie können die Webseite im Webbrowser (aus Sicherheitsgründen nur auf dem lokalen Computer) 
mit der Seite http://localhost:9090 öffnen.

### Empfehlung
- Yacy für die Suche per Json oder im IFrame
