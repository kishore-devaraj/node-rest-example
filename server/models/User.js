const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
    unique: true,
    validate: {
      validator :(value) => {
        return validator.isEmail(value)
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

// Models methods
UserSchema.statics.findUserByToken = function (token) {
  let user = this; 
  let decoded
  try {
    decoded = jwt.verify(token, 'someSecret')
  } catch(e) {
    return Promise.reject()
    // return new Promise( (resolve, reject) => {
    //   return reject()
    // })
  }

  return User.findOne({
    '_id': ObjectID(decoded._id),
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}


// Instance methods
UserSchema.methods.toJSON = function () {
  let user = this
  let userObj = user.toObject()

  return _.pick(userObj, '_id', 'email')
}

UserSchema.methods.generateAuthToken = function () { 
  let user = this
  console.log(user)
  let access = 'auth'
  let token = jwt.sign({_id: user._id.toHexString()}, 'someSecret')
  user.tokens.push({access, token})
  return user.save().then(() => {
    return token
  })
}

const User = mongoose.model('User',UserSchema)

module.exports = {
  User
}