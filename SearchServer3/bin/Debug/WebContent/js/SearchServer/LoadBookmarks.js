
	function LoadBookmarks(divDebug, divData) {
		$(divDebug).html("<img src='images/ajax-loader.gif'> Verarbeite Merker ...");
		$.ajax({
			url: '/api/Query/Bookmarks',
			success: function (data) {
				DataBookmarks(data, divDebug, divData);
			}
		});
	}
	
	function DataBookmarks (daten, divDebug, divData) {
	
		var data = CheckData(daten);
		var output="";
		
		// ##############################
		// Uebersichten der Klassen
		// ##############################
		output+="<ul class='sf-menu'>"
		for (var i in data.Bookmarks){
			var Gruppe=data.Bookmarks[i];
			output+="<li><a href='#'>" + Gruppe.Group + "</a><ul>"
			for (var i2 in Gruppe.Entrys){
				output+="<li>" + "<a href='#'>" + Gruppe.Entrys[i2].Name + "</a>" + "</li>"
			}
			output+="</ul></li>"
		};
		output+="</ul>";

		$(divData).html(output);		
		$(divDebug).html(daten);		
		$('.menu').superfish();
	}