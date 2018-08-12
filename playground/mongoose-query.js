const {mongoose} = require('../server/db/db')
const {Todo} = require('../server/models/Todo')
const {ObjectID} = require('mongodb')


const _id = '5b708ab6558f491c6927187a'
if(!ObjectID.isValid(_id)) return console.log('Invalid Id')

// Todo.find({
//   _id
// }).then(doc => {
//   if (doc.length === 0) {
//     return console.log('No record found')
//   }
//   console.log(JSON.stringify(doc, undefined, 2))
// }, (e) => console.log(e))


// Todo.findOne({
//   _id
// }).then(doc => {
//   if (!doc) {
//     return console.log('No record found in findOne')
//   }
//   console.log(JSON.stringify(doc, undefined, 2))
// }, (e) => console.log(e))

Todo.findById(_id)
.then(doc => {
  if (!doc) {
    return console.log('No record found by id')
  }
  console.log(JSON.stringify(doc, undefined, 2))
}, (e) => console.log(e))