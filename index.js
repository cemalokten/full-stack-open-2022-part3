// const http = require('http')
const express = require("express");
const moment = require("moment");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
// app.use(express.static('build'))

const password = process.env.MONGO_PASSWORD;
const url = `mongodb+srv://admin:${password}@cluster0.dnn600n.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("Error connecting to the database:", err));

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

let persons;

const getAllNames = async () => {
  try {
    const result = await Person.find({});
    return result;
  } catch (e) {
    console.log(e);
  }
};

app.get("/api/persons", async (req, res) => {
  persons = await getAllNames();
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

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.filter((person) => person.id === Number(id));
  if (person.length > 0) return res.json(person);
  return res.status(404).end();
});

app.delete("/api/persons/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Person.deleteOne({ _id: id });
    res.status(204).end();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
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

// Close the database connection when the application terminates
const closeConnectionAndExit = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error closing the database connection:", err);
  }
  process.exit();
};

process.on("SIGINT", closeConnectionAndExit);
process.on("SIGTERM", closeConnectionAndExit);
