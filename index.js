require('dotenv').config()
const express = require('express')
const app = express()
let morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', function (req, res) {return JSON.stringify(req.body)})

app.get('/api/persons', (req, res) => {
  Number.find({}).then( persons =>{
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  let date = new Date().toUTCString()
  Number.count('name').then(count =>{
    const amount = count
    res.send(
      `<p>Phonebook has info for ${amount} people</p>
      ${date}`
    )
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  Number.findById(req.params.id).then(number => {
    if (number){
      res.json(number)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Number.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const number = {
    name: body.name,
    number: body.number,
  }

  Number.findByIdAndUpdate(req.params.id, number, { new: true })
    .then(updatedNumber => {
      res.json(updatedNumber)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = new Number({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  }
  next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})