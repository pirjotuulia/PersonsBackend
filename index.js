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

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

// const Person = mongoose.model('Person', {
//     name: String,
//     number: String,
//     id: Number
// })
let nextPersonId;

// app.get('/', (request, response) => {
//     response.send('wow')
// })

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
        .findOne({ 'id': request.params.id })//tämä on toteutettu niin, että se hakee "oman" id:n, ei mongon id:tä
        .then(person => {
            if (person) {
                response.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .deleteOne({ 'id': request.params.id })//tämä on toteutettu niin, että se hakee "oman" id:n, ei mongon id:tä
        .then(response.status(200).end())
        .catch(error => {
            console.log(error)
            response.status(404).end()
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
    Person
        .find({ name: body.name })
        .then(result => {
            if (result && result.length > 0) {
                return response.status(400).json({ error: 'name must be unique' })
            }
        })
        .then(result => {
            if (!result||!result.statusCode === 400) {
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                        response.status(400).end()
                    })
            }
        })
        .catch(error => {
            console.log(error)
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    Person //tämä on toteutettu niin, että se hakee "oman" id:n, ei mongon id:tä
        .updateOne({ 'id': request.params.id }, { $set: { 'name': body.name, 'number': body.number } })
        .then(savedPerson => {
            response.json(Person.format(savedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/info', (request, response) => {
    Person.count({}, function (err, c) {
        return c
    }).then(amount => {
        const date = new Date()
        const info = `Puhelinluettelossa on ${amount} henkilön tiedot <br> ${date}`
        response.send(info)
    })

})

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
