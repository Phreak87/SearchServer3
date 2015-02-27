	function LoadDebug(divDebug, divData) {
		$(divDebug).html("");
		$.ajax({
			url: '/api/Query/msg',
			success: function (data) {
				DataDebug(data, divDebug, divData);
			}
		});
	}
	
	function DataDebug (daten, divDebug, divData) {
	
		var data = CheckData(daten);
		var output="";
		
		for (var i in data.Messages){
			if (data.Messages[i].Type == "IDX"){
				output+="<Table Width='100%'><TR><TD>"
				+ data.Messages[i].Status + "<BR>" 
				+ data.Messages[i].Name + " (" + data.Messages[i].Count + ")<BR>"
				+ "<div class='fsb'><div class='fortschritt' style='width:" + data.Messages[i].Progress + "%'</div>" 
				+ "</TD></TR></Table>"
			} else {
				output+="<Table Width='100%' style='background-color:yellow'><TR><TD>"
				+ data.Messages[i].Status + "<BR>"
				+ data.Messages[i].Name
				+ "</TD></TR></Table>"
			};
		};

		$(divData).html(output);		
		$(divDebug).html(daten);
	}