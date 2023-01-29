// Import Nodes built-in webserver module
// const http = require('http')
const express = require('express')
const moment = require('moment')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

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

morgan.token('id', function getId(req) {
  const { name, number } = req.body
  return JSON.stringify({ name, number })
})

app.use(morgan(':method :url :status :id - :response-time ms'))

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

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params
  const person = persons.filter((person) => person.id === Number(id))
  if (person.length > 0) return res.json(person)
  return res.status(404).end()
})

app.delete('/api/persons/delete/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((p) => p.id !== id)
  res.json().status(204).end()
})

app.post('/api/persons/', (req, res) => {
  const { name, number } = req.body
  if (name === undefined || number === undefined) return res.json({ error: 'The name or number is missing' }).status(404)
  const checkName = persons.filter(({ name: _name }) => _name === name)
  if (checkName.length > 0) return res.json({ error: 'name must be unique' }).status(404)
  const id = Math.floor(Math.random() * 999)
  persons.push({ id, name, number })
  return res.json({ id, name, number }).status(204).end()
})

const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
