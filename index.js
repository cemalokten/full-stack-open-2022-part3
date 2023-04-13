// const http = require('http')
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  getAllPersons,
  addPerson,
  deleteOnePerson,
  findPersonById,
  getInfo,
} = require("./mongo");
const { connectDB, disconnectDB } = require("./connection");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
// app.use(express.static('build'))

connectDB();

morgan.token("id", function getId(req) {
  const { name, number } = req.body;
  return JSON.stringify({ name, number });
});

app.use(morgan(":method :url :status :id - :response-time ms"));

app.get("/api/persons", async (req, res, next) => {
  const persons = await getAllPersons(next);
  res.json(persons);
});

app.get("/api/info", async (req, res, next) => {
  await getInfo(res, next);
});

app.get("/api/persons/:id", async (req, res, next) => {
  await findPersonById(req.params.id, res, next);
});

app.delete("/api/persons/delete/:id", async (req, res, next) => {
  await deleteOnePerson({ id: req.params.id }, res, next);
});

app.post("/api/persons/", async (req, res, next) => {
  const { name, number } = req.body;
  await addPerson(name, number, res, next);
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .json({ error: err.message })
    .end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM disconnected from database");
  await disconnectDB();
});

process.on("SIGINT", async () => {
  console.log("SIGINT disconnected from database");
  await disconnectDB();
});

