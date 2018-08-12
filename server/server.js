const { mongoose } = require('./db/db')
const { Todo } = require('./models/Todo')

const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb')

const app = express()
const port = process.env.PORT || 3000
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
  if(!ObjectId.isValid(id)) res.status(404).send('Todo id is not valid')

  Todo.findById(id)
  .then(todo => {
    if(!todo) return res.status(404).send({todo})
    return res.status(200).send({todo})
  }).catch( e => res.status(400).send())
})

app.listen(port, (err) => {
  if (err) {
    return console.log('Express cannot be started!')
  }
  console.log(`Express running successfully on ${port}`)
})

// let newTodo = Todo({
//   text: ' To kickstart Scrum bot project  '
// })

// newTodo.save().then( (doc) => {
//   console.log(doc)
// }, (err) => {
//   console.log('Unable to save todo', err)
// })

module.exports = {
  app
}