const {mongoose} = require('../server/db/db')
const {Todo} = require('../server/models/Todo')
const {ObjectID} = require('mongodb')

// Three methods for removing a document from a collection

// Document.remove({}) - Removes everything
// Document.remove({key: value}) - Removes matched
// Document.findOneAndRemove({key: value}) - Removes atmost one
// Document.findByIdAndRemove({_id: _id}) - Removes by Id