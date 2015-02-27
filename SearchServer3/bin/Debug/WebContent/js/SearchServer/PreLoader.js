// ##############################################
// Vorladen der Contents nach Klasse (InitTR)
// ################################################
// OnlineVideo (Popcorn)
// 3D (Three.js)
// ###############################################*/

/* 
function Preload_Content(){

	var LST3D = document.getElementsByClassName("3D");
	if (LST3D.length!=0){
		LST3D[0].style.height = '250px';
		thingiview = new Thingiview(LST3D[0].id);
		thingiview.initScene();
		thingiview.loadSTL(LST3D[0].getAttribute('src'));
		thingiview.setBackgroundColor('#ffffff');
	};

	var VIDON = document.getElementsByClassName('OnlineVideo');
	for(var i = 0; i < VIDON.length; i++) {            
		if (i<3){
			console.log ('loading OVid ' + i);
			VIDON[i].parentNode.removeAttribute ("onmouseover")
			var id = VIDON[i].getAttribute("id");
			var src = VIDON[i].getAttribute("source");
			var vNode = document.getElementById(id);vNode.style.height = '250px';
			var Pop = Popcorn.smart(id,src);
		};
	};
};
*/
	
// ##############################################
//	Vorladen der JS-Dateien nach Klassen und InitTR auslsen (Preloader)
// ##############################################
//	Text (CodeMirror)
//##############################################

function Preload_Scripts(){
	var LSTTXT = document.getElementsByClassName("Text");
	if (LSTTXT.length!=0){
	head.load(	"js/CodeMirror/lib/codemirror.js",
				"js/CodeMirror/addon/selection/active-line.js",
				"js/CodeMirror/addon/edit/matchbrackets.js",
				"js/CodeMirror/addon/search/search.js",
				"js/CodeMirror/addon/fold/foldcode.js",
				"js/CodeMirror/addon/mode/loadmode.js",
				"js/CodeMirror/theme/elegant.css",
				"js/CodeMirror/lib/codemirror.css",
				function(){
					console.log ('CodeMirror nachgeladen');
				});
	};

	Preload_Content();
};
