const mongoose = require('mongoose')

const url = 'mongodb://username:password@ds249992.mlab.com:49992/fullstackkanta'

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

const Person = mongoose.model('Person',personSchema)

module.exports = Person