const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster0.wmr95.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    phonenumber: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    id: 5,
    name: "Utsav Kafley",
    phonenumber: "757-359-9726"
})