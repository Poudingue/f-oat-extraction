let express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var url = require('url')
const { exec } = require('child_process')
var base64 = require('base-64')
var mkdirp = require('mkdirp')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

//Moteur de template
app.set('view engine','ejs')

//Middleware
var urlParser = express.urlencoded({limit: '100kb', extended: true, type: "application/x-www-form-urlencoded"})
var jsonParser = express.json({limit: '100kb', strict: false, type: "application/json"})

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
  var reqjson = request.body;
  console.log(reqjson);
  var id = reqjson.id;
  var ext = reqjson.ext;
  //test checksum ou url?
  if (reqjson.url!=null){
    getUrlVideo(reqjson.url);
  }
  else if(reqjson.checksum!=null){
    //demande la vidéo
    getVideo(id);
  }
  else response.end("Erreur : pas d'url ou de checksum");
// CREATEUR.SH
  response.end("Bien reçu !")
});

/*Reçoit les paramètres*/
app.put('/param', jsonParser, (request, response) =>{
  if(!request.body) return response.end("Erreur dans le paramétrage")
  //on reçoit les paramètres en format JSON, il faut maintenant pouvoir l'exploiter pour le script
  var p = request.body;
  console.log(p);
  var param = p.test.param;
  var id = p.test.id;
  console.log(id);
  exec('bash set_parameters.sh '+id+', '+param, (error, stdout, stderr) =>{
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    });
  exec('bash lanceur.sh '+id, (error, stdout, stderr) =>{
    if (error) {
      console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    });
  response.end("Paramètres bien reçus\n")
});



/*Reçoit la vidéo et décompose de manière adéquate*/
app.post('/extractorVID', (request, response) =>{
  if(!request.files)
  return response.status(400).send('No files were uploaded.');

  let reqbody = request.files.reqbody;

  reqbody.mv('/uploadFile', (err) =>{
    if(err)
      return response.status(500).send(err);
  });

  let rdata = reqbody.data;
  console.log(rdata);
  let jdata = JSON.parse(rdata);
  console.log(jdata)
  let rjdata = JSON.stringify(rdata);
  console.log(rjdata);
/*

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
http.get('http://adresseserveur/basededonnées/'+id, (error, stdout, stderr) =>{
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
}

//fonction qui permet de récupérer la vidéo avec l'url
function getUrlVideo(id,url){
  exec('down_url.sh'+id+', '+url, (error, stdout, stderr) =>{
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
}

module.exports = app;
