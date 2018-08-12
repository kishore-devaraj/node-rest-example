const expect = require('expect')
const request = require('supertest')
const  {ObjectId} = require('mongodb')

const { app } = require('../server/server')
const {Todo} = require('../server/models/Todo')

const seedTodos = [
  {
    _id: new ObjectId(),
    text: 'First Todo'
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
    .get('/todos' + noneExistingId)
    .expect(404)
    .end(done)
  })
})
