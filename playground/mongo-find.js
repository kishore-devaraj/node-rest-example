const MongoClient = require('mongodb').MongoClient


MongoClient.connect('mongodb://localhost:27017/', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to the server', err)
  }
  const db = client.db('TodosApp')
  
  console.log('Successfully connected to the server')

  db.collection('Users').find({age: 23}).count()
  .then(docs => {
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Error occured while fetching documents', err)
  })

  client.close()
})