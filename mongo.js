const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide a password')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.dnn600n.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number
})

const getAllNames = async () => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 5) {
  return getAllNames()
}

person.save().then(result => {
  console.log(`added ${name} - ${number} to phonebook`)
  mongoose.connection.close()
})

// Note.deleteOne({ _id: "63d035dd2055b84ceae11ded" }).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

// Person.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
// })

// Person.deleteMany({}, () => {
//   console.log('Deleted everything')
//   mongoose.connection.close()
// })

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456"
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523"
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345"
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122"
//   }
// ];

// Person.collection.insertMany(persons).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// }) 
