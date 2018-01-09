let express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var url = require('url')
const { exec } = require('child_process')
var base64 = require('base-64')

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

//renvoie les paramètres de l'outil
app.get('/outil_list', (request, response) =>{
  fs.readFile('/home/primary/service/service_server/ListeOutilParam/Outilname.js','utf8', (err, data)=>{
  /*fs.readFile('path sur la VM', 'utf8', (err, data) =>{*/
    if(err) throw err;
    else {
      try{
        const parsedData = JSON.stringify(data);
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
  var param = request.body
  var test = toType(param)
  console.log(test)
  console.log(param)
  const paramrecu = JSON.stringify(param)
  console.log(paramrecu);
  /*TODO : recevoir/lire les paramètres correctement
  //si url =/= null alors on envoie vers extractor url
  //sinon on envoie vers un file qu'on aura téléchargé déjà */
  exec('sudo bash /home/primary/service/service_server/script_adress_auto.sh ' + request.body, (error, stdout, stderr) =>{
//exec('bash path VM /script.sh', (error, stdout, stderr)
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
  //renvoyer une autre requête POST à la fin?
  response.end("Paramètres bien reçus : " + paramrecu)
})


app.post('/extractor', rawParser, (request, response) =>{
if(!request.body) { return response.end("Erreur, pas de données") }
  var rawParsed = request.body
  var test = toType(rawParsed)
  console.log(test)
  var decodedData = base64.decode(rawParsed)
  console.log(decodedData)
  //créer un file avec les données dessus avec le nom qu'il faut.
  response.end("Got a POST request")
})

app.put('/', (request, response) =>{
  response.end("Got a PUT request")
})

app.delete('/', (request, response) =>{
  response.end("Got a DELETE request")
})

module.exports = app;
