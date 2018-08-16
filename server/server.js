const env = process.env.NODE_ENV || 'development'
console.log(env)

if (env === 'development') {
  process.env.PORT = 3000
  process.env.PROD_MONGODB = 'mongodb://localhost:27017/todos-app'
} else if (env === 'test') {
  process.env.PORT = 3000
  process.env.PROD_MONGODB = 'mongodb://localhost:27017/todos-app-test'
}



const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb')
const _ = require('lodash')

const { mongoose } = require('./db/db')
const { Todo } = require('./models/Todo')
const { User } = require('./models/User')


const app = express()
const port = process.env.PORT
app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  let todo = Todo({
    text: req.body.text
  })

  todo.save().then( doc => {
    res.status(200).send(doc)
  }, (err) => {
    res.status(400).send(err)
  } )
})

app.get('/todos', (req, res) => {
  Todo.find({}).then(todos => {
    res.status(200).send({todos})
  }, (err) => {
    res.status(400).send(err)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  if(!ObjectId.isValid(id)) return res.status(404).send({'errorMessage' : 'Todo id is not valid'})

  Todo.findById(id)
  .then(todo => {
    if(!todo) return res.status(404).send({todo})
    return res.status(200).send({todo})
  }).catch( e => res.status(400).send())
})

app.delete('/todos/:id', (req, res) => {

  const id = req.params.id
  if(!ObjectId.isValid(id)) return res.status(404).send({'errorMessage' : 'Todo id is not valid'})

  Todo.findByIdAndRemove(id)
  .then(todo => {
    if(!todo) return res.status(404).send({todo})
    return res.send({todo})
  }).catch( e => res.status(400).send())
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['completed', 'text'])
  
  if(!ObjectId.isValid(id)) return res.status(404).send({'errorMessage': 'Not a valid Id'})

  if(_.isBoolean(body.completed) && body.completed) {
    body.completed = true,
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false,
    body.completedAt = null
  }
  
  Todo.findByIdAndUpdate(
    id,
    {$set : body}, 
    {new : true}
    )
  .then(todo => {
    res.send(todo)
  }).catch(e => res.status(404).send(e))
})




// API'S FOR USERS
app.post('/users', (req, res) => {
  body = _.pick(req.body, ['email','password'])
  console.log(body)
  let newUser = new User(body)
  newUser.save().then(() => {
    return newUser.generateAuthToken()
  }).then(token => res.header('x-auth',token).send(newUser))
  .catch(err => res.status(400).send(err))
})


app.listen(port, (err) => {
  if (err) {
    return console.log('Express cannot be started!')
  }
  console.log(`Express running successfully on ${port}`)
})

module.exports = {
  app
}