const mongoose = require("mongoose");
const moment = require("moment");

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const getAllPersons = async (next) => {
  try {
    const result = await Person.find({});
    return result;
  } catch (e) {
    console.log(e);
    next({ status: 500, message: "Error: getAllPersons failed" });
  }
};

const addPerson = async (name, number, res, next) => {
  if (name === undefined || number === undefined) {
    return res.next({ status: 404, message: "The name or number is missing" })
  }
  const persons = await Person.find({});
  const checkName = persons.filter(({ name: _name }) => _name === name);
  if (checkName.length > 0)
    return next({ status: 404, message: "Name must be unique" });
  try {
    await Person.insertMany({ name, number });
    res.status(204).end();
  } catch (e) {
    console.log(e);
    next({ status: 500, message: "Internal server error" });
  }
};

const deleteOnePerson = async ({ id }, res, next) => {
  try {
    await Person.deleteOne({ _id: id });
    res.status(204).end();
  } catch (e) {
    console.log(e);
    next({ status: 500, message: "Internal server error" });
  }
};

const findPersonById = async (id, res, next) => {
  try {
    const person = await Person.findById(id);
    if (person) return res.json(person);
    next({ status: 404, message: "Person not found" });
  } catch (e) {
    console.log(e);
    next({ status: 500, message: "Internal server error" });
  }
};

const getInfo = async (res, next) => {
  try {
    const totalPerson = await Person.countDocuments();
    const info = `
  Phonebook has info for ${totalPerson} people<br>
  <br>
  ${moment().format("MMMM Do YYYY, h:mm:ss a")}
  `;
    res.send(info);
  } catch (e) {
    console.log(e);
    next({ status: 500, message: "Internal server error" });
  }
};

module.exports = {
  getAllPersons,
  addPerson,
  deleteOnePerson,
  findPersonById,
  getInfo,
};
