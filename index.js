// Import Nodes built-in webserver module
// const http = require('http')
const express = require('express')
const moment = require('moment')
const app = express()


let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

const info = `
Phonebook has info for ${persons.length} people<br>
<br>
${moment().format('MMMM Do YYYY, h:mm:ss a')}
`

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(info)
})

app.get('/api/persons/:_id', (req, res) => {
  const { _id } = req.params
  const person = persons.filter((person) => person.id === Number(_id))
  if (person.length > 0) return res.json(person)
  return res.status(404).end()
})

app.delete('/api/persons/delete/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((p) => p.id !== id)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
