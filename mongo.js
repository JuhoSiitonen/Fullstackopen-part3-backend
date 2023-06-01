const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://juho:${password}@phonebook.wzqinys.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', phonebookSchema)

const name = process.argv[3]
const phonenumber = process.argv[4]

if (name !== (undefined)) {
  const number = new Number({
    name: name,
    number: phonenumber,
  })

  number.save().then(() => {
    console.log(`added ${number.name} number ${number.number} to phonebook`)
    mongoose.connection.close()
  })
}else {
  console.log('phonebook:')
  Number.find({}).then(result => {
    result.forEach(number => {
      console.log(number.name, number.number)
    })
    mongoose.connection.close()
  })
}