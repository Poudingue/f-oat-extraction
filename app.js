let express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var url = require('url')
const { exec } = require('child_process')
var base64 = require('base-64')
var mkdirp = require('mkdirp')

//Moteur de template
app.set('view engine','ejs')

//Middleware
app.use(bodyParser({uploadDir:'./uploads'}));
var urlParser = bodyParser.urlencoded({limit: '100kb', extended: true})
var vidParser = bodyParser.text({limit: '50mb', type : '*/*'})
var jsonParser = bodyParser.json()
//session?

// Routes

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

//peut-être renvoyer la liste des outils?
app.get('/', (request, response) =>{
  response.end("Ici le service d'extraction")
  //response.render('/pages/index')
})

//renvoie les paramètres de l'outil (juste un exemple test pour le moment)
app.get('/outilparam', (request, response) =>{
  fs.readFile('/home/primary/service/service_server/ListeOutilParam/Outilname.js','utf8', (err, data)=>{
  /*Il faudra mettre le vrai path à un moment aussi
  fs.readFile('path sur la VM', 'utf8', (err, data) =>{*/
    if(err) throw err;
    else {
      try{
        var parsedData = JSON.stringify(data);
        console.log(parsedData);
        response.write("\n Done ! \n")
        response.end(parsedData);
      } catch (e) {
           console.error(e.message);
      }
    }
  })
});
/*Le premier réel envoie de la Back-end avec id, ext, checksum/url*/
app.post('/creation', jsonParser, (request, response) =>{
  if(!request.body) { return response.end("Erreur, pas de données") }
  var reqjson = requete.body;
  var reqparsed = JSON.parse(reqjson);
  var id = reqparsed.id;
  var ext = reqparsed.ext;
  //test checksum ou url?
  if (reqparsed.url!=null){
    getUrlVideo(reqparsed.url);
  }
  else if(reqparsed.checksum!=null){
    //test si la vidéo existe déjà
    getVideo(id);
  }
  else response.end("Erreur : pas d'url ou de checksum");
// CREATEUR.SH
  response.end("Bien reçu !")
});

/*Reçoit les paramètres*/
app.post('/param', jsonParser, (request, response) =>{
  if(!request.body) return response.end("Erreur dans le paramétrage")
  //on reçoit les paramètres en format JSON, il faut maintenant pouvoir l'exploiter pour le script
  var param = request.body;
  console.log(param)
  var paramrecu = JSON.parse(param)
  console.log(paramrecu);
  var id = paramrecu.id
  new Array(paramrecu.option1, paramrecu.option2, paramrecu.option3);
  //LANCEUR.SH
  response.end("Paramètres bien reçus")
});

/*Reçoit la vidéo et décompose de manière adéquate*/
app.post('/extractorVID', jsonParser, (request, response) =>{
  //on decode le base64
  var reqparsed = request.body;
  //I can see the body ! Now parse the body ?
  console.log(reqparsed);
  var checksum = reqparsed.checksum;
  console.log(checksum);
  var id = reqparsed.id;
  console.log(id);
  var type = reqparsed.extension;
  console.log(type);
  var vidData = reqparsed.video;
  console.log(vidData);
  /*var decodedData = base64.decode(vidData)
  console.log(decodedData);*/
  //Ecrire dans le fichier ou utiliser downFile.sh
  fs.writeFile('lechemin/'+id+checksum+'.'+type, vidData, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('');
});

  //créer un file avec les datas
  response.end("Got a POST request")
});

//envoie la requête de get avec l'id à la base de donnée du backend
function getVideo(id){
exec('curl XGET http://adresseserveur/basededonnées/'+id, (error, stdout, stderr) =>{
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
}

//fonction qui permet de récupérer la vidéo avec l'url
function getUrlVideo(url){
  exec(''/*DOWNURL.sh*/, (error, stdout, stderr) =>{
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
}

module.exports = app;
