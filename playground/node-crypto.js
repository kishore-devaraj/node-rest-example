// const {SHA256} = require('crypto-js')

// text = 'this is a text'
// hash = SHA256(text).toString()
// // console.log(`Text ${text}`)
// // console.log(`Hash ${hash}`)

// let data = {
//   id: 3
// }

// let token = {
//   data,
//   // We need to add a secret key to make the crypto more secure
//   hash: SHA256(JSON.stringify(data) + 'someSecret').toString()
// }

// console.log(token)

// const jwt = require('jsonwebtoken')

// // Two method to create and verify token
// let data = {
//   id : 23
// }

// let token = jwt.sign(data, 'someSecret')
// console.log(token)

// let recoveredData = jwt.verify(token, 'someSecret')
// console.log(data)

const bcrypt = require('bcryptjs')

let password = 'password1'

bcrypt.genSalt(10, function (err, salt) {
  // bcrypt.hash(password, salt, (err, hash) => {
  //   console.log(hash)
  // })

  let hash1 = '$2a$10$cAvvZIZQAeCU4VSr9d.Ye.Wlz90J9pbECwZlalLZVOP4dZ/n.RShO'
  let hash2 = '$2a$10$BRRRLeJwwdXLfujxWDT8BOmLqIaJt29vbMLzeDjI5jLRwRrsDdlPi'

  bcrypt.compare(password, hash1, (err, res) => console.log(res))
  bcrypt.compare(password, hash2, (err, res) => console.log(res))

})