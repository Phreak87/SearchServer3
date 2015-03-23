function GenIFrame (el){
	var iFrame = document.createElement("IFrame");
	iFrame.setAttribute("src", el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb"));
	iFrame.setAttribute("FrameBorder", "1");
	iFrame.setAttribute("Width", "600");
	$(iFrame).dialog({
      height: 450,
	  close: function( event, ui ) {$(this.parentNode).html('');}
    }).dialogExtend({
        "closable" : true,
        "maximizable" : true,
        "minimizable" : true,
        "dblclick" : "maximize",
        "minimizeLocation" : "right",
        "icons" : {
          "close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-circle-minus",
          "restore" : "ui-icon-bullet"
	  }});
}

function loadPageData (daten) {
	
	var data = CheckData(daten);
	var output="";

	/* ##############################
	Übersichten der Gruppen, Namen und Typen
	############################### */
	if (data.EntryCount > 0) {
	var UniqueClassNames= $.unique(data.Messages.map(function (d) {return d.Class_Name;}));
	var UniqueClassGroups= $.unique(data.Messages.map(function (d) {return d.Class_Group;}));
	var UniqueContentPosts= $.unique(data.Messages.map(function (d) {return d.Cont_Post;}));
	var UniqueContentPlayers= $.unique(data.Messages.map(function (d) {return d.Cont_Player;}));
	output+="<Table width='100%' class='hvr-glow'>";
	output+="<TR>"
	for (var i in UniqueClassNames){
		if (typeof UniqueClassNames[i] != 'undefined') {
		if (UniqueClassNames[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCN' value='" + UniqueClassNames[i] + "'>" + UniqueClassNames[i] + "</input></TD>"
		}}};
	output+="</TR><TR>"
	for (var i in UniqueClassGroups){
		if (typeof UniqueClassGroups[i] != 'undefined') {
		if (UniqueClassGroups[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCG' value='" + UniqueClassGroups[i] + "'>" + UniqueClassGroups[i] + "</input></TD>"
		}}};
	output+="</TR><TR>"
	for (var i in UniqueContentPlayers){
		if (typeof UniqueContentPlayers[i] != 'undefined') {
		if (UniqueContentPlayers[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCT' value='" + UniqueContentPlayers[i] + "'>" + UniqueContentPlayers[i] + "</input></TD>"
	}}};
	output+="</TR><TR>"
	for (var i in UniqueContentPosts){
		if (typeof UniqueContentPosts[i] != 'undefined') {
		if (UniqueContentPosts[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCP' value='" + UniqueContentPosts[i] + "'>" + UniqueContentPosts[i] + "</input></TD>"
	}}};
	output+="</TR>"
	output+="</Table>";
	}

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
	Inhalte
	############################### */
	for (var i in data.Messages){
		output+="<Table style='Margin-top:5px;Margin-Bottom:5px;' width='100%' class='hvr-glow' " 
			+ "SCN='" + data.Messages[i].Class_Name + "' "
			+ "SCG='" + data.Messages[i].Class_Group + "'" 
			+ "SCT='" + data.Messages[i].Cont_Player + "'" 
			+ "SCP='" + data.Messages[i].Cont_Post + "'" 
		+ "'>";
		output+="<TR>"
		
		output+="<TD style='background-color:#eeeeee;'></TD>"
		    + "<TD Colspan='2'>"
			+ "<a target='_blank' href='" + data.Messages[i].Cont_Link + "'>" + data.Messages[i].Cont_Name + "</a>"
			+ "</TD>"
		+ "</TR><TR>";
		
		output+=
			"<TD style='background-color:#aaaaaa;' Width='15%'>"
				+ data.Messages[i]._id + "<BR>"
				+ data.Messages[i].Class_Type + "<BR>"
				+ data.Messages[i].Class_Name + "<BR>"
				+ data.Messages[i].Class_Group + "<BR>"
				+ data.Messages[i].Cont_Post + "<BR>"
				+ data.Messages[i].Cont_Description + "<BR>"
				+ data.Messages[i].Cont_Mime + "<BR>"
				+ data.Messages[i].Cont_Player + "<BR>"
				+ data.Messages[i].Cont_Time 
			+ "</TD>";

		// ####################################
		// Darstellen der Inhalte nach Typ
		// ####################################
		if (data.Messages[i].Class_Type=='Math'){
			output+=
			"<TD>" 
				+ "<H2>" + data.Messages[i].Cont_Text + "</H2>"
			+ "</TD>";
		};	
		
		if (data.Messages[i].Class_Type=='FIL'){
			output+=
			"<TD>" 
				+ "<H2>" + data.Messages[i].Cont_Text + "</H2>"
			+ "</TD>";
		};	
		
		if (data.Messages[i].Cont_Player=='Picture'){
			output+=
			"<TD>" 
				+ "<a class='group1' href='" + data.Messages[i].Cont_Link + "' title='Dateiname'>"
				+ "<img width='150px' Style='max-height:600px;' id='i1' src='" + data.Messages[i].Cont_Link + "'></img></a>"
			+ "</TD>";
		};	
		
		if (data.Messages[i].Cont_Player=='Thumbed'){
			output+=
			"<TD>" 
				+ "<a href='" + data.Messages[i].Cont_Link + "'>" + "<Img Src='" + data.Messages[i].Cont_Thumb + "'</img>" + "</a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='Text'){
			output+="<TD onmouseover='ShowTextLocal(this)' class='Text' id='" + data.Messages[i]._id + "' src='" + data.Messages[i].Cont_Link + "'>Show" 
			+ "</TD>";
		};

		if (data.Messages[i].Cont_Player=='ExtVideo'){
			output+="<TD>" 
				+ "<Iframe Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/VideoJS/ShowMovExt.html#" + data.Messages[i].Cont_Link + "#'/>"
				+ "</TD><TD>"
				+ "<a href='#' Frame='js/IFrameLoader/Popcorn/ShowMovExt.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Popcorn)</H2></a><BR>" 
				+ "<a href='#' Frame='js/IFrameLoader/VideoJS/ShowMovExt.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (* VideoJS)</H2></a><BR>"  
				+ "<a href='#' Frame='js/IFrameLoader/Projekktor/ShowMovExt.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (? Projekktor)</H2></a><BR>"   
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='Video'){
			output+="<TD>" 
				+ "<img src='" + data.Messages[i].Cont_Thumb + "'</img>"
				+ "</TD><TD>"
				+ "<a href='#' Frame='js/IFrameLoader/Popcorn/ShowMov.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Popcorn)</H2></a><BR>" 
				+ "<a href='#' Frame='js/IFrameLoader/Videojs/ShowMov.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (VideoJS)</H2></a><BR>" 
				+ "<a href='#' Frame='js/IFrameLoader/Projekktor/ShowMov.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Projekktor)</H2></a><BR>" 
				// + "<iframe id='viewer' frameBorder='0' scrolling='no' src = 'js/IFrameLoader/Projekktor/ShowMov.html#" + data.Messages[i].objLink + "#" + data.Messages[i].ContentThumb + "' width='800' height='300' allowfullscreen webkitallowfullscreen></iframe>"
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='PDF'){
			output+="<TD>" 
				+ "<img src='" + data.Messages[i].Cont_Thumb + "'</img>"
				+ "</TD><TD>"
				+ "<a href='#' Frame='js/IFrameLoader/ViewerJS/Index.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (ViewerJS)</H2></a><BR>" 
				+ "<a href='#' Frame='" + data.Messages[i].Cont_Link + "' Content='' Thumb='' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Chrome embedded PDF-Viewer (Default))</H2></a>" 
				// + "<iframe id='viewer' frameBorder='0' scrolling='no' src = 'js/ViewerJS/Index.html#" + data.Messages[i].objLink + "' width='800' height='300' allowfullscreen webkitallowfullscreen></iframe>"
			+ "</TD>";
		};		
		
		if (data.Messages[i].Cont_Player=='Audio'){
			output+="<TD>" 
				+ "<Iframe Frameborder='0' style='width: 800px; height: 70px;' src='js/IFrameLoader/Soundmanager2/Index.html#" + data.Messages[i].Cont_Link + "#'/>"
				// + "<a href='#' Frame='js/IFrameLoader/Soundmanager2/Index.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
				// +"<iframe id='viewer'  frameBorder='0' scrolling='no' src = 'js/IFrameLoader/Soundmanager2/Index.html#" + data.Messages[i].objLink + "' height='70'  allowfullscreen webkitallowfullscreen></iframe>"
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='ZIP'){
			output+="<TD>" 
				+ "<a href='#' Frame='js/IFrameLoader/zip/ShowZip.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='RAR'){
			output+="<TD>" 
				+ "<a href='#' Frame='js/IFrameLoader/rar/ShowRar.html' Content='" + data.Messages[i].Cont_Link + "' Thumb='" + data.Messages[i].Cont_Thumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='3D'){
			output+="<TD>"
			+ "<IFrame Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/ThreeJS/Index.html#" + data.Messages[i].Cont_Link + "#'/></TD><TD>"
			// + "<a href='#' Frame='js/IFrameLoader/ThreeJS/Index.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='RSS'){
			output+="<TD>" 
				+ data.Messages[i].Cont_Text + "<BR>"
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='WEB'){
			output+="<TD>" 
				+ data.Messages[i].Cont_Text + "<BR>"
			+ "</TD>";
		};
		
		if (data.Messages[i].Cont_Player=='NoPlayer'){
			output+="<TD>" 
				+ data.Messages[i].Cont_Text
			+ "</TD>";
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
	};		

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
	// Preload_Content();
	$(".group1").colorbox({rel:'group1'});
}