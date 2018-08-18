const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('../../server/models/Todo')
const {User} = require('../../server/models/User')

// Todo Seed Data
const seedTodos = [
  {
    _id: new ObjectID(),
    text: 'First Todo',
    completed: false,
    completedAt: null
  }, {
    _id: new ObjectID(),
    text: 'Second Todo'
  }
]

function populateTodos (done) {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(seedTodos)
  }).then(() => done())
}


const userOneId = new ObjectID()
const userTwoId = new ObjectID()

// User Seed Data
const seedUsers = [{
  _id: userOneId, 
  email:'kishoregrylls@gmail.com',
  password:'someDumbPasswordOne',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'someSecret').toString()
  }]
},{
  _id: userTwoId,
  email: 'kishore.devaraj@gmail.com',
  password: 'someDumbPasswordTwo'
}]


function populateUsers (done) {
  User.remove({})
  .then(() => {
    let userOne = new User(seedUsers[0]).save()
    let userTwo = new User(seedUsers[1]).save()

    return Promise.all([userOne, userTwo])
    .then(() => done())
  })
}


module.exports = {
  seedTodos,
  populateTodos,
  seedUsers,
  populateUsers
}