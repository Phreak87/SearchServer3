
	function LoadIndex(divDebug, divData) {
		$(divDebug).html("<img src='images/ajax-loader.gif'> Verarbeite Merker ...");
		$.ajax({
			url: '/api/Query/Idx',
			success: function (data) {
				DataIndex(data, divDebug, divData);
			}
		});
	}
	
	function DataIndex (daten, divDebug, divData) {
	
		var data = CheckData(daten);
		var output="";
		
		// ##############################
		// Uebersichten der Klassen
		// ##############################
		output+="<ul>"
		for (var i in data.Messages){
			var Gruppe=data.Messages[i];
			if (Gruppe.Type != ''){
				output+="<li><a href='#Ergebnisse'>" + Gruppe.Name + "</a></li>"
			}
		};
		output+="</ul>"

		$(divData).html(output);		
		$(divDebug).html(daten);		
	}