// Déclaration et imports de tout ce dont on aura besoin dans le programme \\

const fs = require('fs');
var restify = require('restify');
// Déclarations et imports des clés de cryptage des communications
var https_options = {
  key: fs.readFileSync('/home/laroudiep/api1/api.btssio.local.key'),
  certificate: fs.readFileSync('/home/laroudiep/api1/api.btssio.local.cert')};
// On définit le serveur https
var https_server = restify.createServer(https_options);
// On définit les liens sur lesquels le serveur réagira, ainsi que la fonction a appeller si le lien est saisi
https_server.get('/get/:name', recupData);
https_server.get('/dlt/:nom1', supprData);
https_server.post('/add/:named/notes/:notes', ajoutDataComplet);
var url = require('url');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// On définit le lien qui mène à la base de données mongoDB
var urlmdb = 'mongodb://localhost:27017/test';
var resultat;

// On met le serveur sur écoute au port 443 \\

https_server.listen(443, function() {
   console.log('%s listening at %s', https_server.name, https_server.url);
});

// Fonction qui permet de stocker des données pronote sur le serveur \\

function ajoutDataComplet(req, res, next){
	// Connexion à la base de données
	MongoClient.connect(urlmdb, function(err, db){
		assert.equal(null, err);
		console.log("POST : connexion a mongodb effectuee");
		// Récupération des données contenues dans le lien
		var collection = db.collection('resultats');
		var page = url.parse(req.url).pathname;
		var nom = req.params.named;
		var notes = req.params.notes;
		// On définit le filtre qu'on utilisera pour repérer les données (comme un identifiant)
		filtre = {"eleve":"nom"};
		// On crée une ligne dans mongo qui contient les données récupérées dans le lien
		collection.insertOne({"eleve": nom, "notes": notes}, function(err, resultat) {
			assert.equal(err, null);
			db.close();
			// On envoie un message pour confirmer le bon fonctionnement de l'opération
			res.end("Donnees ajoutees : notes ="+notes+" et eleve = "+nom);
			console.log("POST : creation effectuee sur mongodb");
		});
	})
next();
}

// Fonction qui permet de récupérer des données stockées sur le serveur \\

function recupData(req, res, next){
	// Connexion à la base de données 
	MongoClient.connect(urlmdb, function(err, db) { // Connection à mongoDB
		assert.equal(null, err);
		console.log("GET : connexion a mongodb effectuee");
		// Récupération des données contenues dans le lien
		var nom = req.params.name;
		var collection = db.collection('resultats'); //On précise le dossier dans lequel les données sont stockées
		// On définit le filtre qu'on utilisera pour repérer les données (comme un identifiant)
		filtre = {"eleve": nom };
		// On recherche les données qui correspondent au filtre choisi
		collection.find(filtre).toArray(function(err, resultat) {
			assert.equal(err, null);
			db.close();
			//On notifie à l'utilisateur le bon déroulement de l'opération et on lui envoie les données
			resultat = JSON.stringify(resultat);
			res.end(resultat);
			console.log("GET : donnees transmises")
		});
	});
	next();
}

// Fonction qui permet de supprimer des données stockées sur le serveur \\

function supprData(req, res, next){
	// Connexion à la base de données
	MongoClient.connect(urlmdb, function(err, db){
		assert.equal(null, err);
		console.log("DELETE : connexion a mongodb effectuee");
		// On récupère les données contenues dans le lien
		var collection = db.collection('resultats');
		var page = url.parse(req.url).pathname;
		nom = req.params.nom1;
		// On définit le filtre qu'on utilisera pour repérer les données (comme un identifiant)
		filtre = {"eleve": nom};
		// On supprime la ou les lignes qui correspondent au filtre choisi
		collection.remove({"eleve":nom});
		db.close();
		// On notifie à l'utilisateur le bon déroulement de l'opération
		res.end("Donnees concernant l'eleve "+nom+" supprimees.");
		console.log("DELETE : Donnees supprimees.");
			
	})
	next();
}