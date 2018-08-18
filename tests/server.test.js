const expect = require('expect')
const request = require('supertest')
const  {ObjectID} = require('mongodb')

const { app } = require('../server/server')
const {Todo} = require('../server/models/Todo')
const {User} = require('../server/models/User')
const {seedTodos, seedUsers, populateTodos, populateUsers} = require('./seeds/seed')


beforeEach(populateTodos)
beforeEach(populateUsers)

describe('POST /todos', () => {
  it('should add todo to the database via POST request', (done) => {
    let text = 'Todo from test file'
    request(app)
    .post('/todos')
    .set('x-auth', seedUsers[0].tokens[0].token)
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
    .set('x-auth', seedUsers[0].tokens[0].token)
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
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body.todos.length).toBe(1)
    })
    .end(done)
  })
})

describe('GET /todoId' , () => {
  it('should return todo by id ', (done) => {
    request(app)
    .get('/todos/' + seedTodos[0]._id.toHexString())
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body.todo.text).toBe(seedTodos[0].text)
    })
    .end(done)
  })

  it('should return 404 on invalid id', (done) => {
    request(app)
    .get('/todos/2234')
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return 404 on empty todo id', (done) => {
    const noneExistingId = new ObjectID()
    request(app)
    .get('/todos/' + noneExistingId)
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
})

describe('DELETE /todos:id', () => {
  it('should delete by id', (done) => {
    const deleteId = seedTodos[0]._id.toHexString()
    request(app)
    .delete('/todos/' + deleteId)
    .set('x-auth', seedUsers[0].tokens[0].token)
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

  it('should not delete another person todo', (done) => {
    const deleteId = seedTodos[1]._id.toHexString()
    request(app)
    .delete('/todos/' + deleteId)
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) return done(err)
      Todo.findById(deleteId)
      .then(todo => {
        expect(todo).toExist()
        done()
      }).catch(err => done(err))
    })
  })

  it('should return 404 when id is not invalid', (done) => {
    request(app)
    .delete('/todos/123434')
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should 404 when id is not found', (done) => {
    request(app)
    .delete('/todos/' + new ObjectID())
    .set('x-auth', seedUsers[0].tokens[0].token)
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
    .set('x-auth', seedUsers[0].tokens[0].token)
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

  it('should not update the todo of the other user', (done) => {
    request(app)
    .patch('/todos/' + seedTodos[0]._id.toHexString())
    .set('x-auth', seedUsers[1].tokens[0].token)
    .send(data)
    .expect(404)
    .end(done)
  })


  it('should completedAt not exist when completed is false', (done) => {
    const data = {
      "text": "Fifth text from postman",
      "completed": false,
    }
    const id = seedTodos[0]._id.toHexString()
    request(app)
    .patch('/todos/' + id)
    .set('x-auth', seedUsers[0].tokens[0].token)
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


// Test cases for User

describe('GET /users/me', () => {
  it('should return user email and id if the auth token is correct', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toBe(seedUsers[0]._id.toHexString())
      expect(res.body.email).toBe(seedUsers[0].email)
    })
    .end(done)
  })

  it('should return forbidden for invalid or null token', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect(res => {
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})

describe('POST /users', () => {
  let email = 'kishoredevaraj@gmail.com'
  let password = 'password'
  it('should create user on valid username and password', (done) => {
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect(res => {
      expect(res.body.email).toBe(email)
      expect(res.body._id).toExist()
      expect(res.header['x-auth']).toExist()
    })
    .end((err, res) => {
      if (err) return done(err)
      
      
      User.findOne({email})
      .then(user => {
        expect(user.email).toBe(email)
        expect(user._id.toHexString()).toBe(res.body._id)
        expect(user.password).toNotBe(password)
        expect(user.tokens[0].token).toExist()
        expect(user.tokens[0].access).toExist()
        done()
      }).catch(e => done(err))
    })
  })

  it('should not create users with unmet criteria', (done) => {
    request(app)
    .post('/users')
    .send({email: 'kishore', password: 3455})
    .expect(400)
    .end(done)
  })

  it('should not create duplicate users', (done) => {
    request(app)
    .post('/users')
    .send({email: seedUsers[0].email, password: 'somepassword'})
    .expect(400)
    .end(done)
  })
})

describe('POST /users/login', () => {
  it('should user login and token exists', (done) => {
    request(app)
    .post('/users/login')
    .send({email : seedUsers[1].email, password: seedUsers[1].password})
    .expect(200)
    .expect(res => {
      expect(res.body._id).toExist()
      expect(res.body.email).toBe(seedUsers[1].email)
      expect(res.header['x-auth']).toExist()
    })
    .end((err, res) => {
      if (err) return done(err)
      
    User.findById({_id: seedUsers[1]._id})
    .then(user => {
      expect(user.tokens[1]).toInclude({
        access: 'auth',
        token: res.header['x-auth']
      })
      done()
    }).catch(err => done(err))
  })
  })

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({email: seedUsers[1].email, password: seedUsers[1].password + 1})
    .expect(400)
    .expect(res => {
      expect(res.header['x-auth']).toNotExist()
    })
    .end((err, res) => {
      if (err) return done(err)

      User.findOne({email: seedUsers[1].email})
      .then(user => {
        expect(user.tokens.length).toBe(1)
        done()
      }).catch(err => done(err))
    })
  })
})


describe('DELETE /users/me/token' , () => {
  it('should delete token when user signout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', seedUsers[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)

      User.findById(seedUsers[0]._id)
      .then( user => {  
        expect(user.tokens.length).toBe(0)
        done()
      }).catch(err => done(err))
    })
  })
})

