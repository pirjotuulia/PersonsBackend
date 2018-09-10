const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('response', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :response :status :res[content-length] - :response-time ms'))

const url = 'mongodb://username:password@ds249992.mlab.com:49992/fullstackkanta'

mongoose.connect(url, { useNewUrlParser: true })

// const Person = mongoose.model('Person', {
//     name: String,
//     number: String,
//     id: Number
// })
let nextPersonId;

app.get('/', (request, response) => {
    response.send('wow')
})

app.get('/api/persons', (request, response) => {
    Person
        .find({}, { __v: 0 })
        .then(people => {
            nextPersonId = people.length + 1
            response.json(people.map(Person.format))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findOne({ 'id': request.params.id })
        .then(person => {
            response.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .deleteOne({ 'id': request.params.id })
        .then(response.status(204).end())
        .catch(error => {
            console.log(error)
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name and number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: nextPersonId++
    })

    person
        .save()
        .then(savedPerson => {
            response.json(Person.format(savedPerson))
        })
        .catch(error => {
            console.log(error)
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// app.get('/info', (request, response) => {
//     const amount = persons.length
//     const date = new Date()
//     const info = `puhelinluettelossa on ${amount} henkilön tiedot <br> ${date}`
//     response.send(info)
// })

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(p => p.id === id)
//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(p => p.id !== id)
//     response.status(204).end()
// })

// const generateId = () => {
//     const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 0
//     return maxId + (Math.random * 100)
// }

// app.post('/api/persons', (request, response) => {
//     const body = request.body
//     if (body.name === undefined || body.number === undefined) {
//         return response.status(400).json({ error: 'name and number missing' })
//     } else if (persons.some(p => p.name === body.name)) {
//         return response.status(400).json({ error: 'name must be unique' })
//     }
//     const person = {
//         name: body.name,
//         number: body.number,
//         id: generateId
//     }
//     persons = persons.concat(person)
//     response.json(person)
// })
