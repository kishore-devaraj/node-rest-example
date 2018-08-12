// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')
// console.log(ObjectID())


MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to the server', err)
  }
  const db = client.db('TodosApp')
  
  console.log('Successfully connected to the server')

  // db.collection('Todos').insertOne({
  //   'text': 'Something to do',
  //   'completed': false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert into the collection')
  //   }

  //   // console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  // db.collection('Users').insertOne({
  //   'name': 'Kishore Devaraj',
  //   'age': 23,
  //   'whoami': 'Full Stack Web Developer'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert into the User collection')
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  client.close()
})