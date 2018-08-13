const mongoose = require('mongoose')

mongoose.Promise = global.Promise
// const PROD_MONGODB = 'mongodb://admin:admin987@ds119572.mlab.com:19572/todos-app'

// Connect to the mongodb using mongoose ORM
mongoose.connect(process.env.PROD_MONGODB , {useNewUrlParser: true})

module.exports = {
  mongoose
}