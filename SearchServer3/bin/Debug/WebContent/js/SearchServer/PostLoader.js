/* #############################################
	Play-Handler wenn immer nur das aktuelle Element abgespielt werden soll 
	bei Problemen mit 3D oder Video Scrollfix setzen
###############################################*/
function ShowVidLocal(el) {
	Posx = el.ownerDocument.body.scrollTop;
	el.removeAttribute("onmouseover");
	var id = el.getElementsByClassName("LocalVideo")[0].getAttribute("id");
	var src = el.getElementsByClassName("LocalVideo")[0].getAttribute("source");
	var vNode = document.getElementById(id); vNode.style.height = '250px';
	$(vNode).append("<source src='" + src + "'><source>");
	$('html, body').animate({ scrollTop: Posx }, 1);
  };
function ShowVidOnline(el) {
	Posx = el.ownerDocument.body.scrollTop;
	el.removeAttribute("onmouseover");
	var id = el.getElementsByClassName("OnlineVideo")[0].getAttribute("id");
	var src = el.getElementsByClassName("OnlineVideo")[0].getAttribute("source");
	var vNode = document.getElementById(id);vNode.style.height = '250px';
	var Pop = Popcorn.smart(id,src);
	// Pop.play();
	$('html, body').animate({ scrollTop: Posx }, 1);
  };
function Show3DEvery(el){
	Posx = el.ownerDocument.body.scrollTop;
	el.parentElement.getElementsByClassName("3D")[0].style.height = '250px';
	thingiview = new Thingiview(el.parentElement.getElementsByClassName("3D")[0].id);
	thingiview.initScene();
	thingiview.loadSTL(el.parentElement.getElementsByClassName("3D")[0].getAttribute('src'));
	thingiview.setBackgroundColor('#ffffff');
	$('html, body').animate({ scrollTop: Posx }, 1);
};
function ShowTextLocal (el){
	el.innerHTML = "";
	el.removeAttribute ('onmouseover');
	var doc = document.createElement('code');
	el.appendChild(doc);
		$.get(el.getAttribute('src'), function( data ) {
				var cm = CodeMirror(doc, {
					value: data,
					theme: "elegant",
					smartIndent: "true",
					styleActiveLine: "true",
					matchBrackets: "true",
					closeBrackets: "true",
					lineNumbers: "true"
				});
				
			console.log ("Render content as " + Filetypes(el.getAttribute('src')));
			CodeMirror.modeURL = "js/CodeMirror/mode/%N/%N.js";
			cm.setOption("mode", Filetypes(el.getAttribute('src')));
			CodeMirror.autoLoadMode(cm, Filetypes(el.getAttribute('src')));

			cm.setSize (el.clientWidth - 30,250);
		});
};
