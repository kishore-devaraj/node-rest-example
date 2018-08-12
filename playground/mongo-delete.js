const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to the server', err)
  }
  const db = client.db('TodosApp')
  console.log('Successfully connected to the server')

  // Delete Many
  // db.collection('Todos').deleteMany({completed: false})
  // .then(res => {
  //   console.log(JSON.stringify(res,undefined, 2))
  // })

  // Delete One
  // db.collection('Todos').deleteOne({text :'To do a side project'})
  // .then(res => {
  //   console.log(JSON.stringify(res, undefined, 2))
  // })
  
  // Find and Delete
  // db.collection('Todos').findOneAndDelete({ _id: new ObjectID("5b70216c3b9ac344aafb18e2")})
  // .then(res => {
  //   console.log(JSON.stringify(res, undefined, 2))
  // })
  client.close()
})