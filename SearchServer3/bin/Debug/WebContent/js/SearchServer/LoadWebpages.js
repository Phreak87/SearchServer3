
	function LoadWebPages(divDebug, divData) {
		$(divDebug).html("<img src='images/76.gif'>");
		$.ajax({
			url: '/api/Query/WebPages',
			success: function (data) {
				DataWebPages(data, divDebug, divData);
			}
		});
	}
	
	function Navigate(el){
		el.parentNode.lastChild.src = el.parentNode.childNodes[3].value;
	}
	function GoBack(el){
		el.parentNode.lastChild.ownerDocument.defaultView.history.back(); 
	}
	function GoForward(el){
		el.parentNode.lastChild.ownerDocument.defaultView.history.forward();
	}
	function Refresh(el){
		el.parentNode.lastChild.src = el.parentNode.lastChild.src;
	}
	
    function Iframeel(el){
		var source = el.getAttribute("src");
		var option = '';
		if (el.hasAttribute('opt')){
			option = el.getAttribute("opt");
		};
		var search = $('#SText').val();
		var ThisDiv = document.createElement("Div");
		var Adresse = 	"<a href='#' onClick='GoBack(this);'><img align='left' height='15px' src='images/arrow-left.png'></img></a>" + 
						"<a href='#' onClick='GoForward(this);'><img align='left' height='15px' src='images/arrow-right.png'></img></a>" +
						"<a href='#' onClick='Refresh(this);'><img align='left' height='15px' src='images/view-refresh.png'></img></a>" +
						"<Input align='left' Style='Margin-Left:15px;Margin-Bottom:15px;Width:83%';Height:20px;Top:0' value='" + source + "'></Input>" +
						"<a href='#' onClick='Navigate(this);'><img height='15px' align='right' src='images/mail-mark-notjunk.png'></img></a>";
						
        $(ThisDiv).html(Adresse + "<iframe FrameBorder='1' width='100%' height='100%' src='" + source.replace('{query}',search + ' ' + option) + "'></iframe>");
		$(ThisDiv).dialog({
			"title" : el.getAttribute("name"),
			height:800,
			width:600,
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
	
    function Mainframeel(el){
		var source = el.getAttribute("src");
		var option = '';if (el.hasAttribute('opt')){
			option = el.getAttribute("opt");
		};
		var search = $('#SText').val();
		$('#D3Overview').html('');
		$('#D3Overview').hide(true);
		$('#tabs').show(true);
        document.location.href=source.replace('{query}',search + ' ' + option)
    }
	
	function DataWebPages (daten, divDebug, divData) {
	
		var data = CheckData(daten);
		var output="";
		
		// ##############################
		// Uebersichten der Klassen
		// ##############################
		output+="<ul class='sf-menu'>"
		for (var i in data.Fetcher.Group){
			var Gruppe = data.Fetcher.Group[i]; 				// z.B. Allgemein, MP3
			console.log(Gruppe);
			output+="<li><a href='#'>" + Gruppe.Name + "</a>"	
			
				output+="<ul>"
				for (var i2 in Gruppe.Searcher){
				var Searcher = Gruppe.Searcher[i2];				// z.B. Google, Youtube
				
				if (Searcher.Show=='IFrame'){
					if(Searcher.hasOwnProperty('URL')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' name='" + Searcher.Name + "' onclick='Iframeel(this)'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
					}
				} else {
					if(Searcher.hasOwnProperty('URL')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' name='" + Searcher.Name + "' onclick='Mainframeel(this)'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
					}
				}

					if(Searcher.hasOwnProperty('Options')) {
					output+="<ul>"
					for (var i3 in Searcher.Options.Option){
					var Option = Searcher.Options.Option[i3];	// z.B. Typ:MP3, Typ:PDF
					if (Searcher.Show=='IFrame'){
					if(Searcher.URL.hasOwnProperty('cdata')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' name='" + Searcher.Name + " " + Option.Name + "' opt='" + Option.Add + "' onclick='Iframeel(this)'>" + Option.Name + "</a>" 
					}
					} else {
					if(Searcher.URL.hasOwnProperty('cdata')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' name='" + Searcher.Name + " " + Option.Name + "' opt='" + Option.Add + "' onclick='Mainframeel(this)'>" + Option.Name + "</a>" 
					}
					}
					+ "</li>"
					}
					output+="</ul>"
					}
				
				+ "</li>"
				}
				output+="</ul>"
				
			+"</li>"
		};
		output+="</ul>";

		$(divData).html(output);		
		$(divDebug).html(daten);		
		$('.menu').superfish();
	}
