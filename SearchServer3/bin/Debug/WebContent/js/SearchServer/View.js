window.onload=function(){
	var hr = document.createElement('a');
		hr.setAttribute('href','#Views');
		hr.innerText="Test";
		
	var el1 = document.createElement('li')
		el1.appendChild(hr);
	
	var el2 = document.createElement('div')
		el2.innerText = 'Hallo';
		el2.setAttribute('id','Views');
	
	var doc1=document.getElementById('tabs3');doc1.appendChild(el2);
	var doc2=doc1.getElementsByTagName('ul')[0];doc2.appendChild(el1);
	
}