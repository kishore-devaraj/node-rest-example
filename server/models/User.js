const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

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
    decoded = jwt.verify(token, process.env.JWT_SECRET)
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

UserSchema.statics.findUserByCredentials = function (email, password) {
  let user = this
  return user.findOne({email})
  .then(user => {
    if (!user) {
      return Promise.reject('User not found')
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user)
        } else {
          reject('Password not matching')
        }
      })
    })
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
  let access = 'auth'
  let token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET)
  user.tokens.push({access, token})
  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  let user = this
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

// Middleware 
UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User',UserSchema)

module.exports = {
  User
}