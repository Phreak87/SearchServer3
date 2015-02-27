	function LoadOverview() {
		$('#D3Overview').html("<img src='images/ajax-loader.gif'> Verarbeite Übersicht ...");
		$.ajax({
			url: '/api/Query/Overview',
			success: function (data) {
				DataOverview(data);
			}
		});
	}
	function DataOverview(daten){
	
		/* ##############################
		JSON Error
		###############################*/
		try {
			var data = jQuery.parseJSON(daten);
			var output="";
		} catch (ex) {
			$("#debug").html(
			"<Table width='100%' data-sr style='background-color:rgba(255, 0, 0, 0.39);'>"
			+ "<TD>"
			+ "Fehler beim parsen des JSON Stings <Br>" + ex.message + new Error().stack + "<Br><Br>JSON:<Br>" + daten
			+ "</TD>"
			+ "</Table>");
			return;
		};
	
		/* ##############################
		Programmfehler Searchserver
		###############################*/
		if(data.hasOwnProperty('Errors')){
			$("#debug").html(
			"<Table width='100%' data-sr style='background-color:rgba(255, 0, 0, 0.39);'>"
			+ "<TD>"
			+ "SearchServer Abbruch: <Br>" + data.Errors + "<Br><Br>JSON:<Br>" + daten
			+ "</TD>"
			+ "</Table>");
			return;
		};
		
	var links = jQuery.parseJSON(daten).Links;

	var nodes = {};
		links.forEach(function(link) {
			link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
			link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
		});
	var width = 900,
	    height = 700;

	var force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([width, height])
	    .linkDistance(100)
	    .charge(-500)
	    .on("tick", tick)
	    .start();

	$('#D3Overview').html("");
	var svg = d3.select("#D3Overview").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	svg.append("defs").selectAll("marker")
	    .data(["suit", "licensing", "resolved"])
		.enter().append("marker")
	    .attr("id", function(d) { return d; })
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 1)
	    .attr("markerHeight", 1)
	    .attr("orient", "auto")
		.append("path")
	    .attr("d", "M0,-5L10,0L0,5");

	var path = svg.append("g").selectAll("path")
	    .data(force.links())
		.enter().append("path")
	    .attr("class", function(d) { return "link " + d.type; })
	    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

	var circle = svg.append("g").selectAll("circle")
	    .data(force.nodes())
		.enter().append("circle")
	    .attr("r", 10)
	    .call(force.drag);

	var text = svg.append("g").selectAll("text")
	    .data(force.nodes())
		.enter().append("text")
	    .attr("x", 10)
	    .attr("y", ".31em")
	    .text(function(d) { return d.name; });

	function tick() {
		path.attr("d", linkArc);
		circle.attr("transform", transform);
		text.attr("transform", transform);
	}

	function linkArc(d) {
	  var dx = d.target.x - d.source.x,
	      dy = d.target.y - d.source.y,
	      dr = Math.sqrt(dx * dx + dy * dy);
	  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	}

	function transform(d) {
		return "translate(" + d.x + "," + d.y + ")";
	}
	};