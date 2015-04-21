SearchServer3
========================

### Backend (Server)

Das Backend 
- durchsucht die lokalen Laufwerke rekursiv und filtert diese auf gültige Dateitypen.
- empfängt RSS- und Atom Feeds.
- liest Textdateien ein (Paketlisten, Übersetzungsdateien, Adresslisten).
- durchsucht (parst) andere Suchmaschinen mittels Json/Xml/Html als Xpath.

Das Backend enthält einen eigenen Webserver, der bei lokalen Dateien (sofern
angegeben in der Config) Thumbnails erstellt sofern dies für den jeweiligen Dateityp aktiviert wurde.

Zudem kann das Backend einfache Berechnungen ausführen, Farben evaluieren (auch RAL)
Datumsangaben mit Feiertagen (Bay.) berechnen und Mimetypes erkennen und Programme 
starten sowie Ordner auf dem Computer öffnen.

### Frontend(Weboberfläche)

Das Frontend stellt die Suchergebnisse grafisch dar.
Unter anderem werden folgende Inhalte direkt dargestellt:
- Gcode (3D Plot und Druck)
- 3D stp und obj- Dateien
- Pdf 
- Audio (Browserabhängig)
- Video (avi,mpeg,flv,webm)
- Bilder (Png/Bmp/ico/jpeg)
- Zip (Komprimierte-Formate)
- Rar
- Epub (Ebooks)
- Xml (alle XML-Strukturierten Formate)
- Json und Bson
- Html (Darstellung und Sourcen)
- Excel (xlsm/xlsx)
- Plaintext (txt,log,csv,lst)
- Quelltexte (js,php,vb,c,bat,css,...)

Adresslisten/Paketlisten werden separiert als Suchergebnisse 
mit interpretierten links und Mail-Adressen dargestellt.

Desweiteren werden Youtube und andere Videoquellen direkt
angezeigt sowie Bookmarks in der Suchseite in einem eigenen
Frame geöffnet und die Suchanfrage direkt an die Seite übergeben.

Die Ergebnisse der Suchabfrage können Sie sich dann für einen späteren Moment
speichern oder als PDF, Excel oder CSV-Datei ausgeben lassen.

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
