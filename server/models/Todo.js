const mongoose = require('mongoose')
const _ = require('validator')

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    minLength: 1,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
})

const User = mongoose.model('User',{
  email: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
    unique: true,
    validate: {
      validator :(value) => {
        return _.isEmail(value)
      },
      message : '{VALUE} is not valid email'
    }
  },
  password: {
    type: String,
    minLength: 6,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})


module.exports = {
  Todo,
  User
}