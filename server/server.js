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
const { authenicate } = require('./middleware/authenicate')


const app = express()
const port = process.env.PORT
app.use(bodyParser.json())

app.post('/todos', authenicate, (req, res) => {
  let todo = Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then( doc => {
    res.status(200).send(doc)
  }, (err) => {
    res.status(400).send(err)
  } )
})

app.get('/todos', authenicate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.status(200).send({todos})
  }, (err) => {
    res.status(400).send(err)
  })
})

app.get('/todos/:id', authenicate, (req, res) => {
  const id = req.params.id
  if(!ObjectId.isValid(id)) return res.status(404).send({'errorMessage' : 'Todo id is not valid'})

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
  
  .then(todo => {
    if(!todo) return res.status(404).send({todo})
    return res.status(200).send({todo})
  }).catch( e => res.status(400).send())
})


app.delete('/todos/:id', authenicate, (req, res) => {
  const id = req.params.id
  if(!ObjectId.isValid(id)) return res.status(404).send({'errorMessage' : 'Todo id is not valid'})

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
  .then(todo => {
    if(!todo) return res.status(404).send({todo})
    return res.send({todo})
  }).catch( e => res.status(400).send())
})



app.patch('/todos/:id', authenicate, (req, res) => {
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
  
  Todo.findOneAndUpdate(
    {_id: id, _creator: req.user._id},
    {$set : body}, 
    {new : true}
    )
  .then(todo => {
    if (!todo) {
      return Promise.reject()
    }
    res.send(todo)
  }).catch(e => res.status(404).send(e))
})


// API'S FOR USERS
app.post('/users', (req, res) => {
  body = _.pick(req.body, ['email','password'])
  let newUser = new User(body)
  newUser.save().then(() => {
    return newUser.generateAuthToken()
  }).then(token => res.header('x-auth',token).send(newUser))
  .catch(err => res.status(400).send(err))
})

app.get('/users/me', authenicate, (req, res) => {
  res.send(req.user)
})

app.post('/users/login', (req, res) => {
  body = _.pick(req.body, ['email', 'password'])
  User.findUserByCredentials(body.email, body.password)
  .then(user => {
    return user.generateAuthToken()
    .then(token => {
      res.set('x-auth', token)
      res.send(user)
    })
  })
  .catch(e => {
    console.log(e)
    res.status(400).send(e)
  })
})

app.delete('/users/me/token', authenicate, (req, res) => {
  req.user.removeToken(req.token)
  .then(() => res.status(200).send())
  .catch(() => res.status(400).send())
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