const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

var Schema = mongoose.Schema

var personSchema = new Schema({
    name: String,
    number: String,
    id: Number
})

personSchema.statics.format = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person.id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person