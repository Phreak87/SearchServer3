
	function LoadBookmarks(divDebug, divData) {
		$(divDebug).html("<img src='images/76.gif'>");
		$.ajax({
			url: '/api/Query/bookmarks',
			success: function (data) {
				DataBookmarks(data, divDebug, divData);
			}
		});
	}
	
    function Iframeel(el){
		var source = el.getAttribute("src");
		var option = '';
		if (el.hasAttribute('opt')){
			option = el.getAttribute("opt");
		};
		var search = $('#SText').val();
		var ThisDiv = document.createElement("Div");
		// $('#D3Overview').html('');$('#D3Overview').hide(true);
		// $('#tabs').hide(false);
		// $('#Ergebnisse').show(true);
		// $('#Ergebnisse').append(ThisDiv);
        $(ThisDiv).html("<iframe FrameBorder='1' width='100%' height='100%' src='" + source.replace('{query}',search + ' ' + option) + "'></iframe>");
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
	
	function DataBookmarks (daten, divDebug, divData) {
	
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
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' onclick='Iframeel(this)' name='" + Searcher.Name + "'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
					}
				} else {
					if(Searcher.hasOwnProperty('URL')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' onclick='Mainframeel(this)' name='" + Searcher.Name + "'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
					}
				}

					if(Searcher.hasOwnProperty('Options')) {
					output+="<ul>"
					for (var i3 in Searcher.Options.Option){
					var Option = Searcher.Options.Option[i3];	// z.B. Typ:MP3, Typ:PDF
					if (Searcher.Show=='IFrame'){
					if(Searcher.URL.hasOwnProperty('cdata')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' opt='" + Option.Add + "' onclick='Iframeel(this)' name='" + Searcher.Name + "'>" + Option.Name + "</a>" 
					}
					} else {
					if(Searcher.URL.hasOwnProperty('cdata')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' opt='" + Option.Add + "' onclick='Mainframeel(this)' name='" + Searcher.Name + "'>" + Option.Name + "</a>" 
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
