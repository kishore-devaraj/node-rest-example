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

const jwt = require('jsonwebtoken')

// Two method to create and verify token
let data = {
  id : 23
}

let token = jwt.sign(data, 'someSecret')
console.log(token)

let recoveredData = jwt.verify(token, 'someSecret')
console.log(data)