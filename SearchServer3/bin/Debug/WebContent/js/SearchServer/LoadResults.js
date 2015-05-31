function GenIFrame (el){
	var iFrame = document.createElement("IFrame");
	iFrame.setAttribute("src", el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb"));
	iFrame.setAttribute("FrameBorder", "1");
	$(iFrame).dialog({
      height: 450,
	  close: function( event, ui ) {$(this.parentNode).html('');}
    }).dialogExtend({
        "closable" 		: true,
        "maximizable" 	: true,
        "minimizable" 	: true,
        "dblclick" 		: "maximize",
        "minimizeLocation" : "right",
		"maximize" : function(evt) {$(iFrame).width(this.parentElement.clientWidth - 30)},
		"restore" : function(evt) {$(iFrame).width(this.parentElement.clientWidth - 30)},
        "icons" : {
          "close" 	 : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-circle-minus",
          "restore"  : "ui-icon-bullet"
	  }});
}
function GenIFrameInLine (el){
	var iFrame = document.createElement("IFrame");
	iFrame.setAttribute("src", el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb"));
	iFrame.setAttribute("FrameBorder", "0");
	iFrame.setAttribute("Width", "800");
	iFrame.setAttribute("Height", "450");
	iFrame.setAttribute("overflow", "hidden");
	el.appendChild(iFrame);
}
function GenIFrameTab (el){
  var win = window.open(el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb"), '_blank');
  win.focus();
}
function GenIFrameSearch (el){
	var iFrame = document.createElement("IFrame");
	iFrame.setAttribute("src", el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb"));
	iFrame.setAttribute("FrameBorder", "0");
	iFrame.setAttribute("Width", "800");
	iFrame.setAttribute("Height", "450");
	iFrame.setAttribute("overflow", "hidden");
	$("#Ergebnisse"+sel).html(iFrame);
}
function GenIFrameFull (el){
	window.location.href=el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb");
}
function BlockMime (el){
	$.ajax({
		  type: "POST",
		  url: "api/query/DelMime",
		  data: {Action: "Mime", Data: el.getAttribute('Post'),Desc: prompt('Beschreibung des Dateityps', '')},
			success: function (data) {
				var MSG = document.createElement("Div");
				$(MSG).html("<img Height='35px' src='Images/Filetypes/Accept.png'></img><BR>"
							+ "<H2>" + el.getAttribute('Post') + "</H2><BR>" 
							+ "Postfix wurde aus den Tabellen geloescht und in die Blacklist eingetragen.<BR>" 
							+ "Aktualisieren Sie die Seite (F5) um die betreffenden Eintraege auszublenden.<BR>" 
							+ "Server-Antwort(Datensaetze betroffen): " + data);
							$(MSG).dialog({
								title: "Postfixe geloescht!",
								dialogClass: "alert",
								modal: true,
								width: '550px',
								buttons: {
										Schliessen: function() {
										  $( this ).dialog( "close" );
										}
									  },
								close: function( event, ui ) {$(this.parentNode).html('');}
							})
			}
		});
}
function displayData (el) {
	if (el.parentNode.lastChild.style.display=='none'){
		el.parentNode.lastChild.style.display='block';
	} else {
		el.parentNode.lastChild.style.display='none';
	}
}

function errorImage (el) {
	el.src='Images/Filetypes/Error.png';
}

function ReloadImage (el) {
	setTimeout(function() {
		var save = el.src;
		var alte = el.alt;
		if (alte=='NaN'){el.setAttribute('alt','0')};
		if (parseInt(alte)>=9){el.outerHTML='';return'';}else{el.setAttribute('alt',parseInt(alte)+1)};
		el.src='';
		el.src=save
	}, 1000);
}

function ChangeSelection(name, val, state) {
	var list = document.getElementsByTagName("table");
	for (var i = 0; i < list.length; i++) {
		if (list[i].hasAttribute("scn")==true){
		if (list[i].getAttribute(name)==val) {
			if (state=='false'){
				list[i].style.display='none';
			} else{ 
				list[i].style.display='Block';
			};
		};
		};
	};
}

function loadPageData (daten) {
	
	var data = CheckData(daten);
	var output="";
	var Number = 0;
	
	/* ##############################
	Zurueck, Weiter, Seiten, Status
	############################### */
	output+="<Table width='100%' style='font-size: 140%;Margin-top:5px;Margin-Bottom:5px;' class='hvr-glow'><TR><TD>"
	if (parseInt(data.Pages) > 0){
		output+="<a href='#' id='wb" + sel + "' class='hvr-glow' onClick='Resultate(sel,sid,parseInt(pag) - 1)'>Zurueck</a>";
		for (i = 0;i<=parseInt(data.Pages);i++){
			if (i <= 21){ // Nur 22 Seiten in der Anzeige
				if (i == data.Page){
					output+="<a href='#' id='w" + sel + i + "' class='hvr-glow' onClick='Resultate(sel,sid," + i + ")'><B>" + i + "</B></a>";
				} else {
					output+="<a href='#' id='w" + sel + i + "' class='hvr-glow' onClick='Resultate(sel,sid," + i + ")'>" + i + "</a>";
				}
			}
		}
		output+="<a href='#' id='wf" + sel + "' class='hvr-glow' onClick='Resultate(sel,sid,parseInt(pag) + 1)'>Weiter</a>";
		output+="<BR><BR><B>" + 'Seite ' + data.Page + ' von ' + data.Pages + "<Br>Eintraege von " + data.EntryFrom + " bis " + data.EntryTo + " von " + data.EntryCount + " Ergebnissen zu '" + data.SQuery + "' aus " + data.EntryDB + ' Eintraegen in ' + data.DBTime + " Sekunden <BR><B>"
	} else {
		output+="<BR><B>" + data.EntryCount + " Ergebnisse aus " + data.EntryDB + " Eintraegen zu '" + data.SQuery + "' in " + data.DBTime + " Sekunden <BR><B>"
	}
	output+="</TD></TR></Table>"	
	
	/* ##############################
	Übersichten der Gruppen, Namen und Typen
	############################### */
	
	output+="<Div id='selector' Style='min-width:900px;overflow:hidden;'>"
	if (data.EntryCount > 0) {
	var UniqueClassNames= $.unique(data.Messages.map(function (d) {return d.Class_Name;}));
	var UniqueClassGroups= $.unique(data.Messages.map(function (d) {return d.Class_Group;}));
	var UniqueContentPosts= $.unique(data.Messages.map(function (d) {return d.Cont_Post;}));
	var UniqueContentPlayers= $.unique(data.Messages.map(function (d) {return d.Cont_Player;}));
	output+="<Table width='99%' class='hvr-glow'>";
	output+="<TR>"

	output+="<div>"
	  output+="<select multiple data-placeholder='Dargestellte Sucher' style='width:99%;margin-top:5px;' class='chosen-select1'>"
	  for (var i in UniqueClassNames){
		if (typeof UniqueClassNames[i] != 'undefined') {
		if (UniqueClassNames[i] != '') {
		output+="<option selected>" + UniqueClassNames[i] + "</option>"
	  }}};
	  output+="</select>"
	output+="</div>"
	
	output+="<div>"
	  output+="<select multiple data-placeholder='Dargestellte Gruppen' style='width:99%;margin-top:5px;' class='chosen-select2'>"
	  for (var i in UniqueClassGroups){
		if (typeof UniqueClassGroups[i] != 'undefined') {
		if (UniqueClassGroups[i] != '') {
		output+="<option selected onClick='alert('dasf');';>" + UniqueClassGroups[i] + "</option>"
	  }}};
	  output+="</select>"
	output+="</div>"

	output+="<div>"
	  output+="<select multiple data-placeholder='Dargestellte Player' style='width:99%;margin-top:5px;' class='chosen-select3'>"
	  for (var i in UniqueContentPlayers){
		if (typeof UniqueContentPlayers[i] != 'undefined') {
		if (UniqueContentPlayers[i] != '') {
		output+="<option selected>" + UniqueContentPlayers[i] + "</option>"
	  }}};
	  output+="</select>"
	output+="</div>"
	
	output+="<div>"
	  output+="<select multiple data-placeholder='Dargestellte Postfixe' style='width:99%;margin-top:5px;' class='chosen-select4'>"
	  for (var i in UniqueContentPosts){
		if (typeof UniqueContentPosts[i] != 'undefined') {
		if (UniqueContentPosts[i] != '') {
		output+="<option selected>" + UniqueContentPosts[i] + "</option>"
	  }}};
	  output+="</select>"+"</div>"+"</TR>"+"</Table></Div>";
	}

	/* Inhalte
	############################### */
	if (viw==false){
	for (var i in data.Messages){
		
		Number+=1;
		var Link = data.Messages[i].Cont_Link;
		var Thumb = data.Messages[i].Cont_Thumb;
		
		var ShowIn = '';
		switch (data.Messages[i].Cont_Show){
			case "Inline" 	: ShowIn = "GenIFrameInLine(this);"; 	break;
			case "WWindow"	: ShowIn = "GenIFrame(this);"; 			break;
			case "TWindow" 	: ShowIn = "GenIFrameTab(this);"; 		break;
			case "SWindow" 	: ShowIn = "GenIFrameSearch(this);"; 	break;
			case "FWindow" 	: ShowIn = "GenIFrameFull(this);"; 		break;
		};
		
		output+="<Table style='Margin-top:5px;Margin-Bottom:5px;' width='100%' class='hvr-glow' " 
			+ "SCN='" + data.Messages[i].Class_Name + "' "
			+ "SCG='" + data.Messages[i].Class_Group + "'" 
			+ "SCT='" + data.Messages[i].Cont_Player + "'" 
			+ "SCP='" + data.Messages[i].Cont_Post + "'" 
		+ "'>";
		output+="<TR>"
		
		output+="<TD style='background-color:#eeeeee;'></TD>"
		    + "<TD Colspan='2'>"
			+ "<a target='_blank' href='" + data.Messages[i].Cont_Link + "'><H3>" + data.Messages[i].Cont_Name + "</H3></a>"
			+ "</TD>"
		+ "</TR><TR>";
		
		output+=
			"<TD style='background-color:#aaaaaa;' Width='70px'>"
				+ "<a onClick='displayData(this);'>"
				+ "<img Height='65px' src='Images/Filetypes/" + data.Messages[i].Cont_Post.replace(".", "") 
				+ ".png' alt='" + data.Messages[i].Cont_Post.replace(".", "") + "' onError='errorImage(this);'></img></a>"
				+ "<Div style='display:none;'>"
				+ "<B><H3>" + data.Messages[i].Cont_Post + "<a href='#' Post='" + data.Messages[i].Cont_Post + "' onClick='BlockMime(this)'> Blockieren</a></H3></B><BR>"
				+ data.Messages[i]._id + "<BR>"
				+ data.Messages[i].Class_Type + "<BR>"
				+ data.Messages[i].Class_Name + "<BR>"
				+ data.Messages[i].Class_Group + "<BR>"
				+ data.Messages[i].Cont_Description + "<BR>"
				+ data.Messages[i].Cont_Mime + "<BR>"
				+ data.Messages[i].Cont_Player + "<BR>"
				+ data.Messages[i].Cont_Show + "<BR>"
				+ data.Messages[i].Cont_Time + "<BR>" 
				+ "Num: " + Number
				+ "</Div>"
			+ "</TD>";

		// ####################################
		// Darstellen der Inhalte nach Typ
		// ####################################

		switch (data.Messages[i].Class_Type) {
			case "Math"		: output+="<TD><H2>" + emojione.shortnameToImage(data.Messages[i].Cont_Text) + "</H2></TD>"; break;
			case "FIL"		: output+="<TD><H2>" + data.Messages[i].Cont_Text + "</H2></TD>"; break;
		};
		
		
		switch (data.Messages[i].Cont_Player) {
			case "RSS"		: output+="<TD><H2>" + emojione.shortnameToImage(data.Messages[i].Cont_Text) + "</H2></TD>"; break;
			case "WEB"		: output+="<TD><H2>" + emojione.shortnameToImage(data.Messages[i].Cont_Text) + "</H2></TD>"; break;
			case "NoPlayer"	: output+="<TD><H2>" + emojione.shortnameToImage(data.Messages[i].Cont_Text) + "</H2></TD>"; break;
			case "Picture" 	: output+="<TD>" 
								+ "<a class='group1' href='" + Link + "' title='Dateiname'>"
								+ "<img width='150px' Style='max-height:600px;' id='i1' src='" + Link + "' onError='errorImage(this);'></img></a>"
								+ "<a href='#' Frame='js/IFrameLoader/exifjs/index.html' Content='" + Link + "' onClick='" + "GenIFrame(this);" + "'><H2>Exif Eigenschaften anzeigen (ExifJS)</H2></a><BR>"
								+ "</TD>"; break;
			case "Thumbed"	: output+="<TD>" 
								+ "<a href='" + Link + "'>" 
								+ "<Img Src='" + Thumb + "' onError='ReloadImage(this);'</img>" + "</a>" 
								+ "</TD>"; break;
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
								// Plain-Text
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
			case "Text"		: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/epiceditor/showmd.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (EpicEditor)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "Python"	: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/epiceditor/showmd.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (EpicEditor)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/Skulpt/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt ausführen (Skulpt)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "JS"		: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/epiceditor/showmd.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (EpicEditor)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/OpenJSCad/index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (JSCad)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CoffeeScript/IndexJS.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (JavaScript to CoffeeScript)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "Coffee"	: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/epiceditor/showmd.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (EpicEditor)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CoffeeScript/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (Coffee-To-JavaScript)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "Markdown"	: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/epiceditor/showmd.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (EpicEditor)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "JSON"		: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/jsoneditor/index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (JsonEditor)</H2></a><BR>"
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "XML"		: output+="<TD>"
								+ "<a href='#' Frame='js/IFrameLoader/jsoneditor/indexXML.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (JsonEditor mit XML_to_Json Converter)</H2></a><BR>"
								+ "<a href='#' Frame='js/IFrameLoader/CodeMirror/showText.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (CodeMirror)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/ACE/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ACE)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HTML-View)</H2></a>" 
								+ "</TD>";  break;
			case "Latex"	: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 800px; height: 280px;' src='js/IFrameLoader/LatexMathML/index.html#" + Link + "'/></TD><TD>"
								+ "</TD>";	break;		
			case "MML"		: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 800px; height: 280px;' src='js/IFrameLoader/MathJax/indexMML.html#" + Link + "'/></TD><TD>"
								+ "</TD>";	break;	
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
								// Komprimierte-Formate 
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
			case "ExtVideo" : output+="<TD>" 
								+ "<Iframe Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/VideoJS/ShowMovExt.html#" + Link + "#'/>"
								+ "</TD><TD>"
								+ "<a href='#' Frame='js/IFrameLoader/Popcorn/ShowMovExt.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (Popcorn)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/VideoJS/ShowMovExt.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (* VideoJS)</H2></a><BR>"  
								+ "<a href='#' Frame='js/IFrameLoader/Projekktor/ShowMovExt.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (? Projekktor)</H2></a><BR>"   
								+ "</TD>";  break;
			case "Video"	: output+="<TD>" 
								+ "<img src='" + Thumb + "' onError='ReloadImage(this);'></img>"
								+ "</TD><TD>"
								+ "<a href='#' Frame='js/IFrameLoader/Popcorn/ShowMov.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (Popcorn)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/Videojs/ShowMov.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (VideoJS)</H2></a><BR>" 
								+ "<a href='#' Frame='js/IFrameLoader/Projekktor/ShowMov.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (Projekktor)</H2></a><BR>" 
								+ "</TD>";  break;
			case "PDF"		: output+="<TD>" 
								+ "<img src='" + Thumb + "' onError='ReloadImage(this);'></img>"
								+ "</TD><TD>"
								+ "<a href='#' Frame='js/IFrameLoader/ViewerJS/Index.html' Content='" + Link + "' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (ViewerJS)</H2></a><BR>" 
								+ "<a href='#' Frame='" + Link + "' Content='' Thumb='' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (Chrome embedded PDF-Viewer (Default))</H2></a>" 
								+ "</TD>";	break;
			case "Audio"	: output+="<TD>" 
								+ "<Iframe Frameborder='0' style='width: 800px; height: 70px;' src='js/IFrameLoader/Soundmanager2/Index.html#" + Link + "#'/>"
								+ "<a href='#' Frame='js/IFrameLoader/Wavesurfer/Index.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Wavesurfer)</H2></a>" 
								+ "<a href='#' Frame='js/IFrameLoader/id3/read.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (ID3_Tags)</H2></a>" 
								+ "</TD>";	break;
			case "MIDI"		: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/Jasmid/Index.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt abspielen (Jasmid)</H2></a>"  
								+ "</TD>";	break;
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
								// Komprimierte-Formate 
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
			case "ZIP"		: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/zip/ShowZip.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (JSZip) </H2></a>" 
								+ "</TD>";  break;
			case "TAR"		: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/TAR/Index.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen</H2></a>" 
								+ "</TD>";  break;
			case "RAR"		: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/rar/ShowRar.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (JSRar) </H2></a>" 
								+ "</TD>";  break;
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
								// Rendering der 3D-Formate 
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
			case "GCode"	: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/GCode/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (GCodeViewer) </H2></a>" 
								+ "</TD>";  break;
			case "HANGAR"	: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/Hangar/Index.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (GCodeViewer) </H2></a>" 
								+ "</TD>";  break;
			case "THING"	: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/ThreeJS/Index.html#" + Link + "#'/></TD><TD>"
								+ "</TD>";	break;	
			case "X3D"		: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/X3Dom/Index.html#" + Link + "#'/></TD><TD>"
								+ "</TD>";	break;	
			case "SCENE"	: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/SceneJS/Index.html#" + Link + "#'/></TD><TD>"
								+ "</TD>";	break;	
			case "DXF"		: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/ThreeDXF/Index.html#" + Link + "'/></TD><TD>"
								+ "</TD>";	break;		
			case "JSCAD"	: output+="<TD>"
								+ "<IFrame Frameborder='0' style='width: 800px; height: 280px;' src='js/IFrameLoader/OpenJSCad/index.html#" + Link + "'/></TD><TD>"
								+ "</TD>";	break;	
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
								// Sonstige
								// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
			case "Excel"	: output+="<TD>" 
								+ "<a href='" + Link + "'>" + "<Img Src='" + Thumb + "' onError='errorImage(this);'</img>" + "</a>" 
								+ "</TD>"
								+ "<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/SheetJS/Index.html' Content='" + Link + "' Thumb='" + Thumb + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (SheetJS) </H2></a>" 
								+ "</TD>";  break;
			case "EPub"		: output+="<TD>" 
								+ "<a href='#' Frame='js/IFrameLoader/EpubJS/IndexEPUB.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (EpubViewer) </H2></a>" 
								+ "</TD>";  break;
			case "Exec"		: output+="<TD>"
								+ "<a href='#' onClick='RunOnLocalMachine(this)' src='" + Link + "' ><H2> Lokal starten </H2></a><BR>"
								+ "<a href='#' onClick='RunOnLocalMachineF(this)' src='" + Link + "' ><H2> Ordner oeffnen </H2></a>"
								+ "<a href='#' Frame='js/IFrameLoader/Hexview/hexview.html' Content='" + Link + "' onClick='" + ShowIn + "'><H2>Inhalt anzeigen (HexView (Bug))</H2></a><BR>" 
								+ "</TD>"; break;
		};

		output+="</TR>";
		output+="<TR>"
			+ "<TD style='background-color:#eeeeee;'></TD>"
			+ "<TD Colspan='2'>"
				+ "<a href='#' onClick='ScrollTop'><Img Src='images/rarrow.png'</img> Nach oben </a>"
				+ "<a href='#' onClick='UrlToClipBoard(this)' src='" + data.Messages[i].Cont_Link + "'><Img Src='images/rarrow.png'</img> Link kopieren </a>"
				+ "<a href='#' onClick='PathToClipBoard(this)' src='" + data.Messages[i].Cont_Link + "' ><Img Src='images/rarrow.png'</img> Pfad kopieren </a>"
				+ "<a href='#' onClick='RunOnLocalMachine(this)' src='" + data.Messages[i].Cont_Link + "' ><Img Src='images/rarrow.png'</img> Lokal starten </a>"
				+ "<a href='#' onClick='RunOnLocalMachineF(this)' src='" + data.Messages[i].Cont_Link + "' ><Img Src='images/rarrow.png'</img> Ordner oeffnen </a>"
			+ "</TD>"
			+ "</TR></Table>";	
	}} else {
		for (var i in data.Messages){
			switch (data.Messages[i].Cont_Player){
				case "PDF"		: output+="<img Style='Margin-left:10px;Margin-top:10px;' Alt='0' src='" + data.Messages[i].Cont_Thumb + "' onError='ReloadImage(this);'></img>";break;
			}
		}
	};
	
	output+="</Div>"

	$("#Ergebnisse"+sel).html(output);	
	
	var TRS = document.getElementsByTagName('table');
	for(var i = 0; i < TRS.length; i++) {            
		var anchor = TRS[i];
		anchor.onmouseover = function(){this.style.background = '#dddddd';};
		anchor.onmouseout = function(){this.style.background = '#f4f4f4';};
	};
	
	$("#wb" + sel).button();
	for (i = 0;i<=parseInt(data.Pages);i++){
	$("#w" + sel + i).button();
	}
	$("#wf" + sel).button();
	
	Preload_Scripts();
	//Preload_Content();
	$(".group1").colorbox({rel:'group1'});
	$(".chosen-select1").chosen().on('change', function(evt,params) {
		ChangeSelection ('scn',params.deselected,'false');
		ChangeSelection ('scn',params.selected,'true');
    });
	$(".chosen-select2").chosen().on('change', function(evt,params) {
		ChangeSelection ('scg',params.deselected,'false');
		ChangeSelection ('scg',params.selected,'true');
    });
	$(".chosen-select3").chosen().on('change', function(evt,params) {
		ChangeSelection ('sct',params.deselected,'false');
		ChangeSelection ('sct',params.selected,'true');
    });
	$(".chosen-select4").chosen().on('change', function(evt,params) {
		ChangeSelection ('scp',params.deselected,'false');
		ChangeSelection ('scp',params.selected,'true');
    });
	$(".selector").width('600px');
	return output;
}
