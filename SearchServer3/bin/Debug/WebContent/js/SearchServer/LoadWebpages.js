
	function LoadWebPages(divDebug, divData) {
		$(divDebug).html("<img src='images/ajax-loader.gif'> Verarbeite Merker ...");
		$.ajax({
			url: '/api/Query/WebPages',
			success: function (data) {
				DataWebPages(data, divDebug, divData);
			}
		});
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
			output+="<li><a href='#'>" + Gruppe.Name + "</a>"	
			
				output+="<ul>"
				for (var i2 in Gruppe.Searcher){
				var Searcher = Gruppe.Searcher[i2];				// z.B. Google, Youtube
				
				if (Searcher.Show=='IFrame'){
				output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' onclick='Iframeel(this)'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
				} else {
				output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' onclick='Mainframeel(this)'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
				}

					if(Searcher.hasOwnProperty('Options')) {
					output+="<ul>"
					for (var i3 in Searcher.Options.Option){
					var Option = Searcher.Options.Option[i3];	// z.B. Typ:MP3, Typ:PDF
					if (Searcher.Show=='IFrame'){
					output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' opt='" + Option.Add + "' onclick='Iframeel(this)'>" + Option.Name + "</a>" 
					} else {
					output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' opt='" + Option.Add + "' onclick='Mainframeel(this)'>" + Option.Name + "</a>" 
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
	

    function LoadWebPages_(el,el){
		$('#D3Overview').html('');
		$('#D3Overview').hide(true);
		$('#tabs').show(true);
		var output;
		output="<ul class='sf-menu'>";
			output+="<li><a href='#'>Im Ergebnisfenster</a>";
				output+="<ul>";
					output+="<li><a href='#' src='http://www.Duckduckgo.com' onclick='Iframeel(this)'>DuckDuckgo</a></li>";
					output+="<li><a href='#' src='http://localhost:8090' onclick='Iframeel(this)'>YACY</a></li>";
					output+="<li><a href='#' src='chrome://inspect' onclick='Iframeel(this)'>YACY</a></li>";
				output+="</ul>";
			output+="</li>";
			output+="<li><a href='#'>auf kompletter Seite</a>";
				output+="<ul>";
					output+="<li><a href='#' src='http://www.Duckduckgo.com' onclick='Mainframeel(this)'>DuckDuckgo</a></li>";
					output+="<li><a href='#' src='http://localhost:8090' onclick='Mainframeel(this)'>YACY</a></li>";
				output+="</ul>";
			output+="</li>";
			output+="<li><a href='#'>in einem neuen Tab</a>";
				output+="<ul>";
					output+="<li><a href='http://www.duckduckgo.com' target='_blank'>DuckDuckgo</a></li>";
					output+="<li><a href='http://localhost:8090' target='_blank'>YACY</a></li>";
					output+="<li><a href='http://www.google.de' target='_blank'>Google</a></li>";
				output+="</ul>";
			output+="</li>";
		output+="</ul>";
        $('#Externe').html(output);
    }