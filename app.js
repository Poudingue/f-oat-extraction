let express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var url = require('url')
const { exec } = require('child_process')
var base64 = require('base-64')
var mkdirp = require('mkdirp')
var fileUpload = require('express-fileupload')

//Moteur de template
app.set('view engine','ejs')

//Middleware
var urlParser = express.urlencoded({limit: '100kb', extended: true})
var jsonParser = express.json()
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

app.use(fileUpload());
/*Reçoit la vidéo et décompose de manière adéquate*/
app.post('/extractorVID', jsonParser, (request, response) =>{
  if(!req.files)
  var reqbody = JSON.stringify(request.body);
/*
  var checksum =  request.body.test.checksum;
  console.log(checksum);
  var id =  request.body.test.id;
  console.log(id);
  var type =   request.body.extension;
  console.log(type);
  var vidData =   request.body.video;
  console.log(vidData);*/

  //create parser by moi-meme

  var i=j=l=0;
  var val = false;
  var m = "";
  var tab = new Array();
  var c = reqbody[i];
  while(c!='}'){
      if(c==':'){
        val=true;
      }
      if(c==','){
        tab[j] = m;
        m="";
        j++;
        val=false;
      }
      if(val){
      m=m+c;
      }
      c=reqbody[i++];
  }

  var checksum = tab[1];
  console.log("checksum ="+checksum);
  var id =  tab[0];
  console.log("id ="+id);
  var type =   tab[2];
  console.log("type ="+type);
  var vidData =  tab[3];
  console.log("data ="+vidData);


  /*var decodedData = base64.decode(vidData)
  console.log(decodedData);*/
  //Ecrire dans le fichier ou utiliser downFile.sh
  /*fs.writeFile('lechemin/'+id+checksum+'.'+type, vidData, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('');
});*/

  //créer un file avec les datas
  response.end("Got a POST request")
});

function jsonParser(stringValue, key) {

       var string = JSON.stringify(stringValue);
       var objectValue = JSON.parse(string);
       return objectValue[key];
    }

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
