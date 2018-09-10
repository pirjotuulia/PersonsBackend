const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://username:password@ds249992.mlab.com:49992/fullstackkanta'

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})

const person = new Person({
    name: 'Joku muu',
    number: "040-1234567",
    id: 5
})

// person
//     .save()
//     .then(response => {
//         console.log('person saved!')
//         mongoose.connection.close()
//     })

if (process.argv[2]) {
    console.log(process.argv[2])
    person.name = process.argv[2]
    person.number = process.argv[3]
    console.log("lisätään henkilö " + person.name + " numero "+ person.number+" luetteloon")
} else {
    Person
        .find({})
        .then(result => {
            console.log("puhelinluettelo:")
            result.forEach(person => {
                console.log(person.name, " ", person.number)
            })
            mongoose.connection.close()
        })
}