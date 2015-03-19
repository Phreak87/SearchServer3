
	function LoadWebPages(divDebug, divData) {
		$(divDebug).html("<img src='images/ajax-loader.gif'> Verarbeite Merker ...");
		$.ajax({
			url: '/api/Query/WebPages',
			success: function (data) {
				DataWebPages(data, divDebug, divData);
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
		$('#D3Overview').html('');$('#D3Overview').hide(true);
		$('#tabs').hide(false);
		$('#Ergebnisse').show(true);
        $('#Ergebnisse').html("<iframe FrameBorder='0' width='100%' height='800' src='" + source.replace('{query}',search + ' ' + option) + "'></iframe>");
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
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' onclick='Iframeel(this)'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
					}
				} else {
					if(Searcher.hasOwnProperty('URL')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' onclick='Mainframeel(this)'>" + Searcher.Name + '(' + Searcher.Show + ')' + "</a>" 
					}
				}

					if(Searcher.hasOwnProperty('Options')) {
					output+="<ul>"
					for (var i3 in Searcher.Options.Option){
					var Option = Searcher.Options.Option[i3];	// z.B. Typ:MP3, Typ:PDF
					if (Searcher.Show=='IFrame'){
					if(Searcher.URL.hasOwnProperty('cdata')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' opt='" + Option.Add + "' onclick='Iframeel(this)'>" + Option.Name + "</a>" 
					}
					} else {
					if(Searcher.URL.hasOwnProperty('cdata')) {
						output+="<li>" + "<a href='#' src='" + Searcher.URL.cdata + "' opt='" + Option.Add + "' onclick='Mainframeel(this)'>" + Option.Name + "</a>" 
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
