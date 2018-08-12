const mongoose = require('mongoose')

mongoose.Promise = global.Promise

// Connect to the mongodb using mongoose ORM
mongoose.connect('mongodb://localhost:27017/TodosApp',{useNewUrlParser: true})

module.exports = {
  mongoose
}