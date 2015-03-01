	function LoadSearch(divDebug, divData) {
		$(divDebug).html("");
		$.ajax({
			url: '/api/Query/Qry',
			success: function (data) {
				DataSuche(data, divDebug, divData);
			}
		});
	}
	
	function ActivateSuche (el){
		sid=(el.getAttribute("sid"));
		Resultate('DIR',sid);
		$('#D3Overview').html('');
		$('#D3Overview').hide(true);
		$('#tabs').show(true);
	}
	
	function DataSuche (daten, divDebug, divData) {
		
		var data = CheckData(daten);
		var output="";

		output+="<ul>"
		for (var i in data.Messages){
			var Gruppe=data.Messages[i];
			if (Gruppe.Query != ''){
				output+="<li><a href='#' onClick='ActivateSuche(this)' SID=" + Gruppe._id + ">" + Gruppe.Query + "</a></li>"
			}
		};
		output+="</ul>"

		$(divData).html(output);		
		$(divDebug).html(daten);
	}