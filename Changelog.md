
# SearchServer3@Commit:64

> Views 										=> PDF-View und Default-View in Anzeige
> Ergebnisse									=> Default (30), erweiterbar in Anzeige
> FIL mit Datum									=> Datum aus Textdateien extrahieren
> FIL mit Images								=> img-Tags werden nun interpretiert und angezeigt
> FIL Bugfix 									=> interpretiert jetzt nur noch (txt|csv|log) 
> Autoloader									=> Beim 1. Aufruf der Seite werden alle Infos zum Datum angezeigt.

# SearchServer3@Commit:63

> Nuget Paketliste								=> OK (Stand 16.05.2015 mittels Nuget.exe List)
> MongoDB auf Version 3.0.3 					=> OK (Incl. Import und Export)
> QMLWeb 										=> OK
> ThreeJS mit allen verfügbaren Loadern			=> OK (ausgenommen unterschiedliche JS)
> ThreeJS mit See3D Plugin						=> OK
> X3Dom 3D-Viewer								=> OK 
> SceneJS 3D Viewer								=> OK
> MP3 Wave-Viewer								=> OK
> MP3 ID3-Tag Reader							=> OK
> Midi Dateien Player							=> OK
> Latex-Viewer									=> OK
> MathML Viewer									=> OK
> Python Runner									=> OK 
> CoffeeScript to JS Converter					=> OK
> JS to CoffeeScript Converter					=> OK
> Indexfiles Javascript - neue Seiten			=> OK
> Neue Mimetypes und File-Icons					=> OK
> Testseiten im Contentframe					=> OK (Gruppiert nach Themen)
> NodeJS Webserver für Tests					=> OK (simpleHttpserver.js und Server.bat)
> Samples in Ordner IframeLoader gesammelt		=> OK (und Gruppiert, Teilweise Samples.html angepasst)

# SearchServer3 Changelog@Commit:54

> Nochmals neuer Player für JSCad				=> OK ()Mehrere Formate (Js,JsCad,SCad,amf,obj,stl,gcode,g,gco))
> Neuer Quelltext-Viewer ACE.js					=> OK 
> Vorbereitung Coffeescad für .coffee 			=> TODO

# SearchServer3 Changelog@Commit:53

> Neuer Player für OpenJSCad Dateien			=> OK (Anzeige von 3D-Modell, Einstellungen und Quellcode)
> Neuer Player für DXF Dateien					=> OK (Modul unterstützt wenig DXF Formate)
> Neuer Player für Bilddateien					=> OK (Exif Informationen zu Bild anzeigen)
> Neuer Player für Hex Dateien					=> OK (Endet jedoch bei großen Dateien in Ausnahme)
> CodeMirror Textanzeige bei XML Fehlerhaft		=> OK (Version aktualisiert)
> MongoDB Production 3.02						=> OK (Version aktualisiert incl. Import und Export)
> Neue Mimetypen								=> OK (DXF zugeordnet und JSCad hinzugefügt.)
> Bild Reload									=> OK (Wenn Thumb noch nicht erstellt nach 2 Sekunden neu laden)
> Prefetch										=> OK (Datenbank Ergebnisse incl. Thumbnails vorladen)

# SearchServer3 Changelog@Commit:44

> Fix Backslash und . bei Datenbankabfrage 		=> OK (Extra funktion für Regex Sonderzeichen maskieren)<BR>
> Aufräumen der JS Lib Ordner.					=> SheetJS Dateien gelöscht.<BR>
> Emojiis Script suchen.						=> OK Emojify implementiert und Units.xml angepasst. (Evaluation)<BR>
> Maximieren von WWindow fehlerhaft				=> OK (Max,und Rel lösen Iframe Resize aus)<BR>

##### Fetcher
> Fehler beim Init wenn Cont_Name identisch		=> OK (Cont_Name aus Index entfernt)<BR>
> Versuch nicht Text-Dateien zu initialisieren	=> OK (Mimetype Checkup auf Player 'Text')<BR>

# SearchServer3 Changelog@Commit:43
----
##### Verwaltung
> Markdown Changelog fortlaufend (https://github.com/adam-p/markdown-here/wiki/Markdown-Here-Cheatsheet)

##### Export
> Export als XLS Fehler. => nur als XLSX 		=> OK (Zeilengenerierung angepasst, Lib erlaubt keinen XLS Export.)<BR>
> Separierte Head-loader für Export. 			=> OK (Load und Unload der JS-Files je nach Exporttyp)<BR>
> Exportmodule in Ordner gruppieren. 			=> OK (JS/Export/[Modulname])<BR>
> CSV Export von extra Javascript	 			=> OK <BR>

##### Datenbank
```
- Datenbank Distinct der Ergebnisse.
```

> Ordnen anhand von Order + Kein Order			=> OK (Bei DBSearch aufruf wird wenn Parameter nicht leer nach Parameter sortiert)<BR>
> ID aber kein Text (z.B. durch Restart)  		=> OK (Leeres Resultat bei ID=0)<BR>

##### Webinterface
```
- Webinterface darstellung Gruppen (alle Anzeigen und nachschieben)
- JSDelivr API Suchmodul [API](https://github.com/jsdelivr/api)
```

> Twitter Typeahead  (Testen) 					=> OK (Vordefiniert, Probleme mit Darstellung, Request funktioniert.)<BR>

##### Anzeigemodule
> Anzeige von Excel-Tabellen als Table			=> OK (Anzeige der Tabellen geht, anzeige als Sheet mittels Handsontable)
> Json und Markdown separieren					=> OK (Text/Markdown/JSON Player implementiert) <BR>
> XML to Json Converter für JsonEditor 			=> OK (in IndexXML.html)<BR>


##### Mimetypen
> Mimetypes Anpassung (Text/MD/JSON/Excel)		=> OK Mimetypen mit den richtigen Playern ansprechen. XML-Formate/XLSX-Formate/Markdown-Formate/Text-Formate<BR>
> Mimetypes Migration							=> OK Zusammenfassen der Mimetypes xml aus Entwicklungsständen.<BR>
> asciidoc Mimetype (Markdown)					=> OK<BR>
> viele zusätzliche Mimetypen 					=> OK - wichtige eingeordnet + unwichtige zwecks Performance auskommentiert. <BR>

##### Indexfiles
> CDN JD Hosted Librarys						=> OK (Indexfiles/Librarys)<BR>
> Deutsch Englisch Wörterbuch					=> OK (von TU-Chemnitz Textdatei anpassen => "::" => "|")<BR>
> Programmliste auffüllen mit NodeJS Modulen	=> OK<BR>
> Export als CSV Implementierung.				=> OK<BR>

##### Webserver
> PNG-Check Text/Plain wird vom Webserver übergeben bei JQuery.

##### Usefull References
> CDN Librarys API [JSDeliver](https://github.com/jsdelivr/jsdelivr) => 880 MB, 3RD-Party Libs <BR>
> ZeroClickInfos [DuckDuckgoZeroClick](https://duckduckgo.com/api) <BR>
> Bang Commands [DuckDuckGo](https://duckduckgo.com/bang.html) <BR>