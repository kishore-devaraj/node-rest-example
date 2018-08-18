const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('../../server/models/Todo')
const {User} = require('../../server/models/User')


const userOneId = new ObjectID()
const userTwoId = new ObjectID()

// Todo Seed Data
const seedTodos = [
  {
    _id: new ObjectID(),
    text: 'First Todo',
    completed: false,
    completedAt: null,
    _creator: userOneId
  }, {
    _id: new ObjectID(),
    text: 'Second Todo',
    _creator: userTwoId
  }
]

function populateTodos (done) {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(seedTodos)
  }).then(() => done())
}



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
  password: 'someDumbPasswordTwo',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'someSecret').toString()
  }]
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