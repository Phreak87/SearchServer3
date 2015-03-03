function GenIFrame (el){
	var iFrame = document.createElement("IFrame");
	iFrame.setAttribute("src", el.getAttribute("Frame") + "#" + el.getAttribute("Content") + "#" + el.getAttribute("Thumb"));
	iFrame.setAttribute("FrameBorder", "0");
	iFrame.setAttribute("scrolling", "auto");
	iFrame.setAttribute("height", "280");
	iFrame.setAttribute("width", "400");
	iFrame.setAttribute("allowfullscreen", '');
	iFrame.setAttribute("webkitallowfullscreen", '');
	el.parentNode.appendChild(iFrame);
	el.innerHTML = '';
}

function loadPageData (daten) {
	
	var data = CheckData(daten);
	var output="";

	/* ##############################
	Übersichten der Gruppen, Namen und Typen
	############################### */
	var UniqueClassNames= $.unique(data.Messages.map(function (d) {return d.SourceClassName;}));
	var UniqueClassGroups= $.unique(data.Messages.map(function (d) {return d.SourceClassGroup;}));
	var UniqueContentPosts= $.unique(data.Messages.map(function (d) {return d.ContentPost;}));
	var UniqueContentTypes= $.unique(data.Messages.map(function (d) {return d.ContentType;}));
	output+="<Table width='100%'>";
	output+="<TR>"
	for (var i in UniqueClassNames){
		if (typeof UniqueClassNames[i] != 'undefined') {
		if (UniqueClassNames[i] != '') {
		+ "<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCN' value='" + UniqueClassNames[i] + "'>" + UniqueClassNames[i] + "</input></TD>"
		}}};
	output+="</TR><TR>"
	for (var i in UniqueClassGroups){
		if (typeof UniqueClassGroups[i] != 'undefined') {
		if (UniqueClassGroups[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCG' value='" + UniqueClassGroups[i] + "'>" + UniqueClassGroups[i] + "</input></TD>"
		}}};
	output+="</TR><TR>"
	for (var i in UniqueContentTypes){
		if (typeof UniqueContentTypes[i] != 'undefined') {
		if (UniqueContentTypes[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' name='SCP' value='" + UniqueContentTypes[i] + "'>" + UniqueContentTypes[i] + "</input></TD>"
	}}};
	output+="</TR><TR>"
	for (var i in UniqueContentPosts){
		if (typeof UniqueContentPosts[i] != 'undefined') {
		if (UniqueContentPosts[i] != '') {
		output+="<TD><Input Type='Checkbox' onClick='ChangeSelection(this);' checked='checked' value='" + UniqueContentPosts[i] + "'>" + UniqueContentPosts[i] + "</input></TD>"
	}}};
	output+="</TR>"
	output+="</Table>";
	
	//+ data.Status[0].Answers + " (" 
	//+ data.Status[0].Results + ") von " 
	//+ data.Status[0].Searcher + " Suchern in " 
	//+ data.Status[0].Folder + " lieferten Resultate.</DIV>";
		
	/* ##############################
	Uebersichten der Eintraege:
	################################
	"ContentType":"ExtVideo",
	"ContentID":"0",
	"SourceClassType":"WEB",
	"SourceClassName":"YouTube",
	"SourceClassGroup":"Videos",
	"ContentTime":"635467655441906869",
	"ContentThumb":"",
	"objLink":"https://www.youtube.com/watch?v=i3a7B65b6w8&amp;feature=youtube_gdata",
	"objName":"watch?v=i3a7B65b6w8&amp;feature=youtube_gdata",
	"objContent":""
		
	SourceClassName = SCN fr Filterung in Table
	SourceClassGroup = SCG fr Filterung in Table
	SourceClassPostfix = SCP fr Filterung in Table
	###############################*/
	
	if (parseInt(data.Pages) > 1){
		output+="<a href='#' id='wb' class='hvr-pulse-grow' onClick='Resultate(sel,sid,parseInt(pag) - 1)'>Zurueck</a>";
		for (i = 0;i<=parseInt(data.Pages);i++){
			if (i <= 22){
			output+="<a href='#' id='w" + i + "' class='hvr-pulse-grow' onClick='Resultate(sel,sid," + i + ")'>" + i + "</a>";
			}
		}
		output+="<a href='#' id='wf' class='hvr-pulse-grow' onClick='Resultate(sel,sid,parseInt(pag) + 1)'>Weiter</a>";
		output+="<BR><B>" + '(' + data.Page + ') ' + data.Start + ' - ' + (parseInt(data.Messages.length) + parseInt(data.Start)) + ' / ' + data.Count + ' Resultate in ' + data.DBTime + " Sekunden <BR><B>"
	}
										 
	for (var i in data.Messages){
		output+="<Table width='100%' class='hvr-sweep-to-right' " 
			+ "SCN='" + data.Messages[i].SourceClassName + "' "
			+ "SCG='" + data.Messages[i].SourceClassGroup + "'" 
			+ "SCP='" + FilePostfix(data.Messages[i].ContentType) + "'"
		+ "'>";
		output+="<TR><TD style='background-color:#eeeeee;'></TD><TD Colspan='2' style='background-color:#eeeeee;'><a target='_blank' href='" + data.Messages[i].objLink + "'>" + data.Messages[i].objName + "</a></TD></TR><TR>";
		
		output+=
			"<TD style='background-color:#aaaaaa;' Width='15%'>"
				+ data.Messages[i]._id + "<BR>"
				+ data.Messages[i].SourceClassType + "<BR>"
				+ data.Messages[i].SourceClassName + "<BR>"
				+ data.Messages[i].SourceClassGroup + "<BR>"
				+ data.Messages[i].ContentPost + "<BR>"
				+ data.Messages[i].ContentMime + "<BR>"
				+ data.Messages[i].ContentType + "<BR>"
				+ data.Messages[i].ContentTime 
			+ "</TD>";

		// ####################################
		// Darstellen der Inhalte nach Typ
		// ####################################
		
		if (data.Messages[i].ContentType=='Picture'){
			output+=
			"<TD>" 
				+ "<a class='group1' href='" + data.Messages[i].objLink + "' title='Dateiname'>"
				+ "<img width='150px' id='i1' src='" + data.Messages[i].objLink + "'></img></a>"
			+ "</TD>";
		};	
		
		if (data.Messages[i].ContentType=='Thumbed'){
			output+=
			"<TD>" 
				+ "<a href='" + data.Messages[i].objLink + "'>" + "<Img Src='" + data.Messages[i].ContentThumb + "'</img>" + "</a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='Text'){
			output+="<TD onmouseover='ShowTextLocal(this)' class='Text' id='" + data.Messages[i].ContentID + "' src='" + data.Messages[i].objLink + "'>Show" 
			+ "</TD>";
		};

		if (data.Messages[i].ContentType=='ExtVideo'){
			output+="<TD>" 
				+ "<Iframe Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/VideoJS/ShowMovExt.html#" + data.Messages[i].objLink + "#'/>"
				+ "</TD><TD>"
				+ "<a href='#' Frame='js/IFrameLoader/Popcorn/ShowMovExt.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Popcorn)</H2></a><BR>" 
				+ "<a href='#' Frame='js/IFrameLoader/VideoJS/ShowMovExt.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (* VideoJS)</H2></a><BR>"  
				+ "<a href='#' Frame='js/IFrameLoader/Projekktor/ShowMovExt.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (? Projekktor)</H2></a><BR>"   
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='Video'){
			output+="<TD>" 
				+ "<img src='" + data.Messages[i].ContentThumb + "'</img>"
				+ "</TD><TD>"
				+ "<a href='#' Frame='js/IFrameLoader/Popcorn/ShowMov.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Popcorn)</H2></a><BR>" 
				+ "<a href='#' Frame='js/IFrameLoader/Videojs/ShowMov.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (VideoJS)</H2></a><BR>" 
				+ "<a href='#' Frame='js/IFrameLoader/Projekktor/ShowMov.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (Projekktor)</H2></a><BR>" 
				// + "<iframe id='viewer' frameBorder='0' scrolling='no' src = 'js/IFrameLoader/Projekktor/ShowMov.html#" + data.Messages[i].objLink + "#" + data.Messages[i].ContentThumb + "' width='800' height='300' allowfullscreen webkitallowfullscreen></iframe>"
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='PDF'){
			output+="<TD>" 
				+ "<img src='" + data.Messages[i].ContentThumb + "'</img>"
				+ "</TD><TD>"
				+ "<a href='#' Frame='js/IFrameLoader/ViewerJS/Index.html' Content='" + data.Messages[i].objLink + "' Thumb='' onClick='GenIFrame(this);'><H2>Inhalt anzeigen (ViewerJS)</H2></a>" 
				// + "<iframe id='viewer' frameBorder='0' scrolling='no' src = 'js/ViewerJS/Index.html#" + data.Messages[i].objLink + "' width='800' height='300' allowfullscreen webkitallowfullscreen></iframe>"
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='Audio'){
			output+="<TD>" 
				+ "<Iframe Frameborder='0' style='width: 800px; height: 70px;' src='js/IFrameLoader/Soundmanager2/Index.html#" + data.Messages[i].objLink + "#'/>"
				// + "<a href='#' Frame='js/IFrameLoader/Soundmanager2/Index.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
				// +"<iframe id='viewer'  frameBorder='0' scrolling='no' src = 'js/IFrameLoader/Soundmanager2/Index.html#" + data.Messages[i].objLink + "' height='70'  allowfullscreen webkitallowfullscreen></iframe>"
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='ZIP'){
			output+="<TD>" 
				+ "<a href='#' Frame='js/IFrameLoader/zip/ShowZip.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='RAR'){
			output+="<TD>" 
				+ "<a href='#' Frame='js/IFrameLoader/rar/ShowRar.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='3D'){
			output+="<TD>"
			+ "<IFrame Frameborder='0' style='width: 400px; height: 280px;' src='js/IFrameLoader/ThreeJS/Index.html#" + data.Messages[i].objLink + "#'/></TD><TD>"
			// + "<a href='#' Frame='js/IFrameLoader/ThreeJS/Index.html' Content='" + data.Messages[i].objLink + "' Thumb='" + data.Messages[i].ContentThumb + "' onClick='GenIFrame(this);'><H2>Inhalt anzeigen</H2></a>" 
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='RSS'){
			output+="<TD>" 
				+ data.Messages[i].objContent + "<BR>"
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='WEB'){
			output+="<TD>" 
				+ data.Messages[i].objContent + "<BR>"
			+ "</TD>";
		};
		
		if (data.Messages[i].ContentType=='NoPlayer'){
			output+="<TD>" 
				+ data.Messages[i].objContent + "<BR><BR>" + data.Messages[i].objContent 
			+ "</TD>";
		};
		
		output+="</TR>";
		output+="<TR style='background-color:#eeeeee;Width:'10%'>"
			+ "<TD style='background-color:#eeeeee;'></TD>"
			+ "<TD Colspan='2'>"
				+ "<a href='#' onClick='ScrollTop'><Img Src='images/rarrow.png'</img> Nach oben </a>"
				+ "<a href='#' onClick='UrlToClipBoard(this)' src='" + data.Messages[i].objLink + "'><Img Src='images/rarrow.png'</img> Link kopieren </a>"
				+ "<a href='#' onClick='PathToClipBoard(this)' src='" + data.Messages[i].objLink + "' ><Img Src='images/rarrow.png'</img> Pfad kopieren </a>"
				+ "<a href='#' onClick='RunOnLocalMachine(this)' src='" + data.Messages[i].objLink + "' ><Img Src='images/rarrow.png'</img> Lokal starten </a>"
				+ "<a href='#' onClick='RunOnLocalMachineF(this)' src='" + data.Messages[i].objLink + "' ><Img Src='images/rarrow.png'</img> Ordner oeffnen </a>"
			+ "</TD>"
			+ "</TR></Table><BR>";	
	};		

	$("#Ergebnisse").html(output);	
	
	var TRS = document.getElementsByTagName('table');
	for(var i = 0; i < TRS.length; i++) {            
		var anchor = TRS[i];
		anchor.onmouseover = function(){this.style.background = '#dddddd';};
		anchor.onmouseout = function(){this.style.background = '#f4f4f4';};
	};
	
	$("#wb").button();
	for (i = 0;i<=parseInt(data.Pages);i++){
	$("#w" + i).button();
	}
	$("#wf").button();
	
	Preload_Scripts();
	Preload_Content();
	$(".group1").colorbox({rel:'group1'});
}