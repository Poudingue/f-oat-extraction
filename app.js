let express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var url = require('url')
const { exec } = require('child_process')
var base64 = require('base-64')
var AsyncLock = require('async-lock')
var lock = new AsyncLock();
static var idlist = new ArrayList;
static var id = 0;
static var idurl = (int,String);

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
/**/
app.post('/param', jsonParser, (request, response) =>{
  if(!request.body) return response.end("Erreur dans le paramétrage")
  //on reçoit les paramètres en format JSON, il faut maintenant pouvoir l'exploiter pour le script
  var param = request.body
  console.log(param)
  const paramrecu = JSON.parse(param)
  console.log(paramrecu);

  /*TODO : recevoir/lire les paramètres correctement
  *si url -> script_adress_auto sinon script
  *comment répurer l'url et le nom du fichier?
  *envoyer directement vers script_adress_auto
  */
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
  response.end("Paramètres bien reçus : " + paramrecu)
})

/**/
app.post('/extractorVID', rawParser, (request, response) =>{
if(!request.body) { return response.end("Erreur, pas de données") }
  //on veut protéger id d'une éventuelle erreur de synchro
  lock.acquire(id, function(done){
  id = id++;
  idurl = (id,null);
  idlist.add(idurl);
  done(err,ret);
}, function(err,ret){
});
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
*/
app.post('/extractorURL', urlParser, (request, response) =>{
  if(!request.body) { return response.end("Erreur avec l'url") }
  var urlreceived = request.body
  //on veut protéger id d'une éventuelle erreur de synchro
  lock.acquire(id, function(done){
  id = id++;
  idurl = (id,request.body);
  idlist.add(idurl);
  done(err,ret);
}, function(err,ret){
});

}

app.put('/', (request, response) =>{
  response.end("Got a PUT request")
})

app.delete('/', (request, response) =>{
  response.end("Got a DELETE request")
})

module.exports = app;
