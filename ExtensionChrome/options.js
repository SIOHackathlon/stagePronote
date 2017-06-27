var tabNotes = [];
document.getElementById("btnenr").addEventListener("click", modifLien);
document.getElementById("consTab").addEventListener("click", consulTab);
document.getElementById("supprTab").addEventListener("click", supprTab);
// Client à intégrer dans l'extension
var serveurURL = "https://api.btssio.local:4434";

function modifLien(){
	localStorage['lien'] = document.getElementById('link').value;
	redirection();	
}
	
function redirection(){	
	alert("Vous allez etre redirige vers le lien renseigne");
	document.location.href= localStorage['lien']; 	
}
	
function consulTab(){
		
	//var name = document.getElementById("nomEleve").value;
	var name = document.getElementById("nomEleve").value;
	var url = serveurURL + "/get/" + name

	requeteHTTPAsync(url, "GET", function(resultat, error) {
		if (error) {
			console.log("ERREUR GET : " + error);
		} else {
			document.getElementById("tableau").style.display = "";
			afficherTableau(resultat);
		}
	});		
}

function afficherTableau(resultat){
	
	var i = 0;
	var tst = resultat.indexOf("notes");
	tst += 8;
	var Notes = resultat.substr(tst);
	for(i==0; i<10; i++){
		taille = Notes.indexOf(",");
		tabNotes[i] = Notes.substring(0, taille+2);
		if(taille == 1){	
			Notes = Notes.substr(5);
			taille = 0;
		}
		else{
			Notes = Notes.substr(6);
			taille = 0;
		}
	}
	document.getElementById("tableau").style.display = "";
	creaTab();
}

function creerTab(){
	name = document.getElementById("nomEleve").value;
	url = serveurURL + "/add/" + name;
	requeteHTTPAsync(url, "POST", function(resultat, error) {
		if (error) {
				console.log("ERREUR POST : " + error);
			} else {}
	});
}
	
function supprTab(){
	name = document.getElementById("nomEleve").value;
	document.location.href = 'https://api.btssio.local:4434/dlt/'+name;
}
	
	
	//*************************************GESTION DU TABLEAU**********************************************\\
	
function creaTab(){
	var listeMoyennes = {
		nom: "LAROUDIE",
		moyennes: [
			{matiere : "anglais", moyenne: tabNotes[0]},
			{matiere : "cult.gene.expression", moyenne: tabNotes[1]},
			{matiere : "eco & gestion", moyenne : tabNotes[2]},
			{matiere : "espagnol", moyenne : tabNotes[3]},
			{matiere : "informatique & reseau", moyenne : tabNotes[4]},
			{matiere : "informatique & reseau", moyenne : tabNotes[5]},
			{matiere : "informatique & reseau", moyenne : tabNotes[6]},
			{matiere : "informatique & reseau", moyenne : tabNotes[7]},
			{matiere : "mathematiques", moyenne : tabNotes[8]},
			{matiere : "physique", moyenne : tabNotes[9]},
		]
	};

// Déclarer une fonction qui injecte un élement todo dans le document HTML
function creerMoyennesHTML(listeMoyennes) {
		// creer tableau
	var tableauHTML = document.createElement('table');
  
	listeMoyennes.moyennes.forEach(function(ligne) {
		// creer tr
		var moyenneHTML = document.createElement('tr');
		// creer td
		var nomMoyenneHTML = document.createElement('td');
		var noteMoyenneHTML = document.createElement('td');
		// metre contenu dans td
		var nomMoyenneText = document.createTextNode(ligne.matiere);
		var noteMoyenneText = document.createTextNode(ligne.moyenne);
  		// ajout texte au td puis au tr puis au table
		nomMoyenneHTML.appendChild(nomMoyenneText);
		noteMoyenneHTML.appendChild(noteMoyenneText);
		moyenneHTML.appendChild(nomMoyenneHTML);
		moyenneHTML.appendChild(noteMoyenneHTML);
  		tableauHTML.appendChild(moyenneHTML);  
	});
	return tableauHTML;
}

	var divTableauHTML = document.getElementById('tableau');
	var tableauMoyenneHTML = creerMoyennesHTML(listeMoyennes);
	divTableauHTML.appendChild(tableauMoyenneHTML);
}