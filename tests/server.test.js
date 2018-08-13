const expect = require('expect')
const request = require('supertest')
const  {ObjectId} = require('mongodb')

const { app } = require('../server/server')
const {Todo} = require('../server/models/Todo')

const seedTodos = [
  {
    _id: new ObjectId(),
    text: 'First Todo',
    completed: false,
    completedAt: null
  }, {
    _id: new ObjectId(),
    text: 'Second Todo'
  }
]

beforeEach(done => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(seedTodos)
  }).then(() => done())
})


describe('Server Test Cases', () => {
  it('should add todo to the database via POST request', (done) => {
    let text = 'Todo from test file'
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect(res => {
      expect(res.body.text).toBe(text)
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      
      // Check whether it got actually added to the db
      Todo.find({text})
      .then(doc => {
        expect(doc.length).toBe(1)
        expect(doc[0].text).toBe(text)
        done()
      }).catch(err => (done(err)))
    })
  })

  it('should not create Todo with invalid data', (done) => {
    request(app)
    .post('/todos')
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err)
      }

      Todo.find({}).then(doc => {
        expect(doc.length).toBe(2)
        done()
      }).catch(err => done(err))
    })
  })
})

describe('GET /' , () => {
  it('should return all the todos ', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect(res => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done)
  })
})

describe('GET /todoId' , () => {
  it('should return todo by id ', (done) => {
    request(app)
    .get('/todos/' + seedTodos[0]._id.toHexString())
    .expect(200)
    .expect(res => {
      expect(res.body.todo.text).toBe(seedTodos[0].text)
    })
    .end(done)
  })

  it('should return 404 on invalid id', (done) => {
    request(app)
    .get('/todos/2234')
    .expect(404)
    .end(done)
  })

  it('should return 404 on empty todo id', (done) => {
    const noneExistingId = new ObjectId()
    request(app)
    .get('/todos/' + noneExistingId)
    .expect(404)
    .end(done)
  })
})

describe('DELETE /todos:id', () => {
  it('should delete by id', (done) => {
    const deleteId = seedTodos[0]._id.toHexString()
    request(app)
    .delete('/todos/' + deleteId)
    .expect(200)
    .expect(res => {
      expect(res.body.todo.text).toBe(seedTodos[0].text)
    })
    .end((err, res) => {
      if (err) return done(err)
      Todo.findById(deleteId)
      .then(todo => {
        expect(todo).toNotExist()
        done()
      }).catch(err => done(err))
    })
  })

  it('should return 404 when id is not invalid', (done) => {
    request(app)
    .delete('/todos/123434')
    .expect(404)
    .end(done)
  })

  it('should 404 when id is not found', (done) => {
    request(app)
    .delete('/todos/' + new ObjectId())
    .expect(404)
    .end(done)
  })  
})

describe('PATCH /todos/:id', () => {
  const data = {
    "text": "Fifth text from postman",
    "completed": true,
  }

  it('should update the todo', (done) => {
    request(app)
    .patch('/todos/' + seedTodos[0]._id.toHexString())
    .send(data)
    .expect(200)
    .expect(res => {
      expect(res.body.text).toBe(data.text)
      expect(res.body.completed).toBe(data.completed)
    })
    .end((err, res) => {
      if( err ) return done(err)
      Todo.findById(seedTodos[0]._id.toHexString())
      .then(todo => {
        expect(todo.text).toBe(data.text)
        expect(todo.completed).toBe(data.completed)
        expect(todo.completedAt).toExist()
        done()
      }).catch(err => done())
    })
  })

  it('should completedAt not exist when completed is false', (done) => {
    const data = {
      "text": "Fifth text from postman",
      "completed": false,
    }
    const id = seedTodos[0]._id.toHexString()
    request(app)
    .patch('/todos/' + id)
    .send(data)
    .expect(200)
    .expect(res => {
      expect(res.body.text).toBe(data.text)
      expect(res.body.completed).toBe(data.completed)
    })
    .end((err, res) => {
      if (err) return done(err)
      Todo.findById(id)
      .then(todo => {
        expect(todo.text).toBe(data.text)
        expect(todo.completed).toBe(data.completed)
        expect(todo.completedAt).toNotExist()
        done()
      }).catch(err => done(err))
    })
  })
})