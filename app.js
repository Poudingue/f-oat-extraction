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
app.use("/assets", express.static('public'))
var urlParser = bodyParser.urlencoded({limit: '5mb', extended: true})
var rawParser = bodyParser.raw({limit: '5mb', type : '*/*'})
var jsonParser = bodyParser.json()
//session?

// Routes

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

//peut-être renvoyer la liste des outils?
app.get('/', (request, response) =>{
  response.end("ok")
  //response.render('/pages/index')
})

//renvoie les paramètres de l'outil (juste un exemple test pour le moment)
app.get('/outil_list', (request, response) =>{
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
})

app.post('/param', jsonParser, (request, response) =>{
  if(!request.body) return response.end("Erreur dans le paramétrage")
  //on reçoit les paramètres en format JSON, il faut maintenant pouvoir l'exploiter pour le script
  var param = request.body;
  console.log(param)
  var paramrecu = JSON.parse(param)
  console.log(paramrecu);
  var id = paramrecu.id
  var option[] = {paramrecu.option1, paramrecu.option2, paramrecu.option3}
  //faire ça mieux?
  //partie execution, peut-être à exclure de la fonction.
  exec('sudo bash /home/primary/service/service_server/script_adress_auto.sh ', (error, stdout, stderr) =>{
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
}
  //renvoyer une autre requête POST à la fin?
  response.end("Paramètres bien reçus")
})

//envoie la requête de get avec l'id à la base de donnée du backend
function getVideo(id){
exec('curl XGET -d http://adresseserveur/basededonnées/'+id, (error, stdout, stderr) =>{
if (error) {
  console.error(`exec error: ${error}`);
  return;
}
console.log(`stdout: ${stdout}`);
console.log(`stderr: ${stderr}`);
});
}

function getUrlVideo(url){
  exec('curl XGET -d '+url)
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
}

app.post('/premierenvoi', jsonParser, (request, response) =>{
  if(!request.body) { return response.end("Erreur, pas de données") }
  var reqjson = requete.body;
  var reqparsed = JSON.parse(reqjson);
  var id = reqparsed.id;
  //test checksum ou url?
  if(reqparsed.url!=null){


  }
  // var type = checksum OU url

// créer un dossier
  mkdirp('/'+id, function (err) {
    if(err) console.error(err)
    else console.log("dossier "+ id +" correctement créé")
    //créer un lock?
  });


  //recevoir la video
    getVideo(id);
});

app.post('/extractorVID', rawParser, (request, response) =>{
  //on decode le base64
  var rawParsed = request.body
  var test = toType(rawParsed)
  console.log(test)
  var decodedData = base64.decode(rawParsed)
  console.log(decodedData)
  //créer un file avec les datas
  response.end("Got a POST request")
})


/*
app.post('/extractorURL', urlParser, (request, response) =>{
  if(!request.body) { return response.end("Erreur avec l'url") }
  var urlreceived = request.body

}
*/
app.put('/', (request, response) =>{
  response.end("Got a PUT request")
})

app.delete('/', (request, response) =>{
  response.end("Got a DELETE request")
})

module.exports = app;
