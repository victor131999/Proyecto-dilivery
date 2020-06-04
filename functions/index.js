const functions = require('firebase-functions');
const admin = require('firebase-admin'); //Todo el SDK de Firebase => Acceso a Realtime Database
const express = require('express');
const app = express();

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proyecto-delivery-a693a.firebaseio.com"
});

const database = admin.database();

///========================= Variables globales ===================///
const dbClient = "customers"; //Referencia al nodo en donde se van a guardar las personas

///========================= Métodos internos ===================///
function createClient(client){
  database.ref(dbClient).push(client);  
}

function retrieveClient(id){
  return database.ref(dbClient).child(id).once('value');
}

function updateClient(id, client){
  database.ref(dbClient).child(id).set(client);
}

function listCustomers(){
  return database.ref(dbClient).once('value');
}

function deleteClient(id){
  database.ref(dbClient).child(id).remove();
}

///========================= Funciones URLs ===================///
app.post('/api/customers', function (req, res) {
  let varName = req.body['name'];
  let varDirection = req.body['direction'];
  let varPhone = req.body['phone'];
  let varActive = req.body['active'];
  let varIdentification = req.body['identification'];
  var client = {
    name : varName,
    direction : varDirection,
    phone : varPhone,
    active : varActive,
    identification : varIdentification
    };
  createClient(client);
  return res.status(201).json({ message: "Success client was added." });
});

app.get('/api/customers/:id', function(req, res){
  let varId = req.params.id;
  retrieveClient(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.get('/api/customers', function(req, res){
  listCustomers().then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.put('/api/customers/:id', function (req, res) {
  let varId = req.params.id;
  let varName = req.body['name'];
  let varDirection = req.body['direction'];
  let varPhone = req.body['phone'];
  let varActive = req.body['active'];
  let varIdentification = req.body['identification'];
  var client = {
    name : varName,
    direction : varDirection,
    phone : varPhone,
    active : varActive,
    identification : varIdentification
    };
  updateClient(varId, client);
  return res.status(200).json({ message: "Success client was updated." });
});

app.delete('/api/customers/:id',function(req, res){
  let varId = req.params.id;
  deleteClient(varId);
  return res.status(200).json({ message: "Success client was deleted." });
});

app.get('/api/', function (req, res) {
  res.send('Bienvenid@s a Cloud Functions de Desarrollo Web Avanzado NRC 7828')
})
exports.app = functions.https.onRequest(app);