	function LoadMerker(divDebug, divData) {
		$(divDebug).html("<img src='images/ajax-loader.gif'> Verarbeite Merker ...");
		$.ajax({
			url: '/api/Query/Mrk',
			success: function (data) {
				DataMerker(data, divDebug, divData);
			}
		});
	}
	
	function DataMerker (daten, divDebug, divData) {
	
		var data = CheckData(daten);
		var output="";
		
		// ##############################
		// Uebersichten der Klassen
		// ##############################
		output+="<ul>"
		for (var i in data.Messages){
			var Gruppe=data.Messages[i];
			if (Gruppe.Save != ''){
				output+="<li><a href='#Ergebnisse'>" + Gruppe.Save + "</a></li>"
			}
		};
		output+="</ul>"

		$(divData).html(output);		
		$(divDebug).html(daten);
	}