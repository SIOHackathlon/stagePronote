// D�claration et imports de tout ce dont on aura besoin dans le programme \\

const fs = require('fs');
var restify = require('restify');
// D�clarations et imports des cl�s de cryptage des communications
var https_options = {
  key: fs.readFileSync('/home/laroudiep/api1/api.btssio.local.key'),
  certificate: fs.readFileSync('/home/laroudiep/api1/api.btssio.local.cert')};
// On d�finit le serveur https
var https_server = restify.createServer(https_options);
// On d�finit les liens sur lesquels le serveur r�agira, ainsi que la fonction a appeller si le lien est saisi
https_server.get('/get/:name', recupData);
https_server.get('/dlt/:nom1', supprData);
https_server.post('/add/:named/notes/:notes', ajoutDataComplet);
var url = require('url');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// On d�finit le lien qui m�ne � la base de donn�es mongoDB
var urlmdb = 'mongodb://localhost:27017/test';
var resultat;

// On met le serveur sur �coute au port 443 \\

https_server.listen(443, function() {
   console.log('%s listening at %s', https_server.name, https_server.url);
});

// Fonction qui permet de stocker des donn�es pronote sur le serveur \\

function ajoutDataComplet(req, res, next){
	// Connexion � la base de donn�es
	MongoClient.connect(urlmdb, function(err, db){
		assert.equal(null, err);
		console.log("POST : connexion a mongodb effectuee");
		// R�cup�ration des donn�es contenues dans le lien
		var collection = db.collection('resultats');
		var page = url.parse(req.url).pathname;
		var nom = req.params.named;
		var notes = req.params.notes;
		// On d�finit le filtre qu'on utilisera pour rep�rer les donn�es (comme un identifiant)
		filtre = {"eleve":"nom"};
		// On cr�e une ligne dans mongo qui contient les donn�es r�cup�r�es dans le lien
		collection.insertOne({"eleve": nom, "notes": notes}, function(err, resultat) {
			assert.equal(err, null);
			db.close();
			// On envoie un message pour confirmer le bon fonctionnement de l'op�ration
			res.end("Donnees ajoutees : notes ="+notes+" et eleve = "+nom);
			console.log("POST : creation effectuee sur mongodb");
		});
	})
next();
}

// Fonction qui permet de r�cup�rer des donn�es stock�es sur le serveur \\

function recupData(req, res, next){
	// Connexion � la base de donn�es 
	MongoClient.connect(urlmdb, function(err, db) { // Connection � mongoDB
		assert.equal(null, err);
		console.log("GET : connexion a mongodb effectuee");
		// R�cup�ration des donn�es contenues dans le lien
		var nom = req.params.name;
		var collection = db.collection('resultats'); //On pr�cise le dossier dans lequel les donn�es sont stock�es
		// On d�finit le filtre qu'on utilisera pour rep�rer les donn�es (comme un identifiant)
		filtre = {"eleve": nom };
		// On recherche les donn�es qui correspondent au filtre choisi
		collection.find(filtre).toArray(function(err, resultat) {
			assert.equal(err, null);
			db.close();
			//On notifie � l'utilisateur le bon d�roulement de l'op�ration et on lui envoie les donn�es
			resultat = JSON.stringify(resultat);
			res.end(resultat);
			console.log("GET : donnees transmises")
		});
	});
	next();
}

// Fonction qui permet de supprimer des donn�es stock�es sur le serveur \\

function supprData(req, res, next){
	// Connexion � la base de donn�es
	MongoClient.connect(urlmdb, function(err, db){
		assert.equal(null, err);
		console.log("DELETE : connexion a mongodb effectuee");
		// On r�cup�re les donn�es contenues dans le lien
		var collection = db.collection('resultats');
		var page = url.parse(req.url).pathname;
		nom = req.params.nom1;
		// On d�finit le filtre qu'on utilisera pour rep�rer les donn�es (comme un identifiant)
		filtre = {"eleve": nom};
		// On supprime la ou les lignes qui correspondent au filtre choisi
		collection.remove({"eleve":nom});
		db.close();
		// On notifie � l'utilisateur le bon d�roulement de l'op�ration
		res.end("Donnees concernant l'eleve "+nom+" supprimees.");
		console.log("DELETE : Donnees supprimees.");
			
	})
	next();
}