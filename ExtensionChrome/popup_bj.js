function redirVersParametres(){		
	chrome.tabs.create({url:"pageOptions.html"});	
}
	

function selectionnerOnglet() {
	chrome.tabs.query({
	    active: true,
	    currentWindow: true
	},
	function(array_of_Tabs) {
	    tab = array_of_Tabs[0];
	});
}


function recupererTableau() {
	chrome.tabs.sendMessage(tab.id, {}, function(reponse) {
		response = reponse || {};
  });
}


document.getElementById("image1").addEventListener("click", redirVersParametres);
document.getElementById("imgLancerComm").addEventListener("click", recupererTableau);
var tab = new Object();
selectionnerOnglet();