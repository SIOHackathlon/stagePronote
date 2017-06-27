// Lorsque pronote répond au message envoyé à partir du fichier popup_bj.js, c'est ce fichier qui prend la releve.
var test = "";
var test_notes = "";
var detailMatiere = [];
var detailNotes = [];
//var serveurURL = "https://api.btssio.local:4434/";
var serveurURL = "https://vps74643.vps.ovh.ca/";
var nom_Eleve;
var nom;


function lireData() {
	var notes = document.getElementById("GInterface.Instances[1].Instances[1]_Zone_1");
	notes.childNodes[0].childNodes[0].childNodes.forEach(function(note){
		try {
			test_notes = note.childNodes[1].childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML;
		}
		catch (e) {}
		detailNotes.push(test_notes);
	})
	localStorage['notes'] = detailNotes;
	

	nom_Eleve = document.getElementById("GInterface.Instances[0].Instances[4]_Edit0");
	nom_Eleve = nom_Eleve.childNodes[0].innerHTML;
	var taille = nom_Eleve.indexOf('&nbsp');
	nom = nom_Eleve.substr(0, taille);


	var matieres = document.getElementById("GInterface.Instances[1].Instances[1]_Zone_0");
	matieres.childNodes[0].childNodes[0].childNodes.forEach(function(matiere){
		try {
			test = JSON.parse(matiere.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]);
		}
		catch (e) {}
		detailMatiere.push(test);
	})
	localStorage['matieres'] = detailMatiere;
	testSendData();
}

function testSendData(){
	url = serveurURL + "/add/" + nom +"/notes/"+ detailNotes;
	requeteHTTPAsync(url, "POST", function(resultat, error) {
		if (error) {
			console.log("ERREUR POST : " + error);
		} 
		else {
			alert("Sauvegarde effectuee");
		}
	});
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	lireData();
    sendResponse(JSON.stringify({data: detailNotes}));
   }
);