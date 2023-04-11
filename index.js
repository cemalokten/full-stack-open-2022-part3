// const http = require('http')
const express = require("express");
const moment = require("moment");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const { getAllPersons, deleteOnePerson, findPersonById } = require("./mongo");
const { connectDB, disconnectDB } = require("./connection");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
// app.use(express.static('build'))

connectDB()

let persons;

app.get("/api/persons", async (req, res) => {
  persons = await getAllPersons();
  res.json(persons);
});

morgan.token("id", function getId(req) {
  const { name, number } = req.body;
  return JSON.stringify({ name, number });
});

app.use(morgan(":method :url :status :id - :response-time ms"));

const info = `
Phonebook has info for ${persons?.length} people<br>
<br>
${moment().format("MMMM Do YYYY, h:mm:ss a")}
`;

// Routes

app.get("api/info", (req, res) => {
  res.send(info);
});

app.get("/api/persons/:id", async (req, res) => {
  const { id } = req.params;
  await findPersonById(id, res)
});

app.delete("/api/persons/delete/:id", async (req, res) => {
  const id = req.params.id;
  await deleteOnePerson({id, res})
});

app.post("/api/persons/", async (req, res) => {
  const { name, number } = req.body;

  if (name === undefined || number === undefined) {
    return res.json({ error: "The name or number is missing" }).status(404);
  }

  const checkName = persons.filter(({ name: _name }) => _name === name);

  if (checkName.length > 0)
    return res.json({ error: "name must be unique" }).status(404);

  try {
    await Person.insertMany({ name, number });
    res.status(204).end();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM disconnected from database')
  await disconnectDB()
})

process.on('SIGINT', async () => {
  console.log('SIGINT disconnected from database')
  await disconnectDB()
})
