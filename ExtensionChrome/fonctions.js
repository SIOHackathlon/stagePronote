/*Fonction qui permet d'ajouter une requete asynchrone*/

function requeteHTTPAsync(url, methode, callback) {

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			callback(xmlHttp.responseText);
		} else {
			if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
				callback(undefined, xmlHttp.status);
			}
		}
	};
	xmlHttp.open(methode, url, true);
	xmlHttp.send(null);
}