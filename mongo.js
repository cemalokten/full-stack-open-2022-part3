const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const getAllPersons = async () => {
  try {
    const result = await Person.find({});
    return result;
  } catch (e) {
    console.log(e);
  }
};
const deleteOnePerson = async ({id, res}) => {
  try {
    await Person.deleteOne({ _id: id });
    res.status(204).end();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
}

const findPersonById = async (id, res) => {
  try {
    const person = await Person.findById(id)
    if (person) return res.json(person)
    res.status(404).end()
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { getAllPersons, deleteOnePerson, findPersonById };
