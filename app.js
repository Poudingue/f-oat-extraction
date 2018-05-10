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
const fse = require('fs-extra')
var execp = require('child-process-promise').exec;

//Moteur de template
app.set('view engine','ejs')

//Middleware
var urlParser = express.urlencoded({limit: '100kb', extended: true, type: "application/x-www-form-urlencoded"})
var jsonParser = express.json({limit: '100kb', strict: false, type: "application/json"})

// Routes

//peut-être renvoyer la liste des outils?
app.get('/', (request, response) =>{
  response.end("Ici le service d'extraction")
  //response.render('/pages/index')
});

//renvoie les paramètres de l'outil (juste un exemple test pour le moment)
app.get('/outilparam', (request, response) =>{
  var data = fs.readFileSync('../parameters.xsd','utf8', (err, data)=>{
    if (err) {
   return console.log(err);
 }
  console.log(data);
});
  response.end(data);
});

/*Le premier réel envoie de la Back-end avec id, ext, checksum/url*/
app.put('/creation/:_id', jsonParser, (request, response) =>{
  if(!request.body) {
    return response.end("Erreur, pas de données")
  }
  console.log(request.body);
  var reqjson = request.body;
  console.log(reqjson);
  var id = request.params._id;
  var ext = reqjson.ext;
  cleaner();
  if (reqjson.url!=null){
    getUrlVideo(id,reqjson.url);
  }
  /*else if(reqjson.checksum!=null){
    getVideo(id);
  }*/
  else response.end("Erreur : pas d'url ou de checksum");
  response.end("Bien reçu !")
});

/*Reçoit les paramètres*/
app.put('/param/:_id', jsonParser, (request, response) =>{
  if(!request.body) return response.end("Erreur dans le paramétrage")
  //on reçoit les paramètres en format JSON, il faut maintenant pouvoir l'exploiter pour le script
  var p = request.body;
  console.log(p);
  var addr = request.ip
  var param = p.param;
  var id = request.params._id;
  var data;
  //definis les parametres.
  /*à travers setparam, on appelle lanceur, qui appelle xmltostring, qui appelle sendvideo, avec des promesses*/
  setparam(id, param,data,addr);
  //rend le projet 'deletable'
  makedel(id);
  response.end("Paramètres bien reçus\n")
});


/*Reçoit la vidéo et décompose de manière adéquate*/
/*app.post('/extractorVID', (request, response) =>{
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
});

  //créer un file avec les datas
  response.end("Got a POST request")
});*/

//envoie la requête de get avec l'id à la base de donnée du backend
/*function getVideo(id){
http.get('http://adresseserveur/basededonnées/'+id, (error, stdout, stderr) =>{
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  });
}
console.log(`stderr: ${stderr}`);*/

//fonction qui permet de récupérer la vidéo avec l'url
function getUrlVideo(id,url){
  exec('bash ../down_url.sh '+id+' '+url, (error, stdout, stderr) =>{
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
}
//met les paramètres avec une promesse pour lanceur
function setparam(id, param, data, addr){
  execp('bash ../set_parameters.sh '+id+' '+param)
  .then(function (result) {
    var stdout = result.stdout;
    var stderr = result.stderr;
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    lanceur(id,data,addr)
    })
    .catch(function(err){
      console.error('ERROR: ', err);
    })
}
//lance l'extraction avec une promesse pour xmltostring
function lanceur(id,data,addr){
  execp('bash ../lanceur.sh '+id)
  .then(function (result) {
    var stdout = result.stdout;
    var stderr = result.stderr;
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    xmltostring(id,data,addr)
    })
    .catch(function(err){
      console.error('ERROR: ', err);
    })
}

function cleaner(){
  exec('bash ../concierge.sh', (error, stdout, stderr) =>{
    if (error) {
      console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    });
}

//passe le xml en string, avec une promesse pour sendvideo
function xmltostring(id,data,addr){
fse.readFile('/projects/'+id+'/video.xml',data)
.then(() => sendvideo(id, data, addr))
.catch(err => console.error(err))
}

//envoie la video extraite et traitée au back-end
function sendvideo(id, data, addr){
  var options = {
    host: addr,
    port: 3000,
    path: '/api/project/:'+id,
    method: 'PUT'
  }
  var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
  console.log('BODY: ' + chunk);
  });
  });

  req.on('error', function(e) {
console.log('problem with request: ' + e.message);
  });

  req.write(data);
  req.end();
}

function makedel(id){
  exec('bash ../make_deletable.sh '+id, (error, stdout, stderr) =>{
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    });
  }

module.exports = app;
