const { User } = require('../models/User')

let authenicate = ((req, res, next) => {
  let token = req.header('x-auth')
  User.findUserByToken(token)
  .then(user => {
    if (!user) {
      console.log('No User Found')
      return Promise.reject()
    }
    req.user = user
    req.token = token
    next()
  }).catch(e => res.status(401).send())
})

module.exports = {
  authenicate
}