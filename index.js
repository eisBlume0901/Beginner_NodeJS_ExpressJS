require('dotenv').config()
const express = require('express')
const app = express()

const port = process.env.PORT

let userList = [
    {
        name: "Kate Kraft",
        age: 24,
        country: "Germany"
    },
    {
        name: "Lara Croft",
        age: 30,
        country: "UK"
    },
    {
        name: "Maria Clara",
        age: 28,
        country: "Philippines"
    }
]

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

// app.param - useful for preprocessing route parameters (in layman's terms, it helps to clean up and standardize the input)
app.param('country', (req, res, next, value) => {
    req.country = String(value || '').trim().toLowerCase()
    next()
})

app.get('/users/:country', (req, res) => {
    const country = req.country
    const filtered = userList.filter(u => u.country.toLowerCase() === country.toLowerCase())
    res.json(filtered)
})

app.get('/users', (req, res) => {
    res.json(userList)
})

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`)
    console.log("http://localhost:" + port)
})
