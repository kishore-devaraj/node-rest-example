const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to the server', err)
  }
  const db = client.db('TodosApp')
  
  console.log('Successfully connected to the server')

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5b6f59135492633b7763b4ce")
  },{
    $set: {
      name: 'Kishore Grylls',
      whoami: 'Full Stack Developer'
    },
    $inc: {
      age: 2
    }
  },{
    returnOriginal: false
  })
  .then(res => {
    console.log(res)
  })

  client.close()
})