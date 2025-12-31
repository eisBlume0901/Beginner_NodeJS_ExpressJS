require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json()) // Middleware to parse JSON bodies (only for raw JSON, not form-data when using Postman)

const port = process.env.PORT

let userList = [
    {
        id: 1,
        name: "Kate Kraft",
        age: 24,
        country: "Germany"
    },
    {
        id: 2,
        name: "Lara Croft",
        age: 30,
        country: "UK"
    },
    {
        id: 3,
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

// To test with postman, use raw JSON body not form-data
app.post('/users/add', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing. Did you set Content-Type: application/json?' })
    }

    const { id, name, age, country } = req.body

    if (!id || !name || !age || !country) {
        return res.status(400).json({ error: 'Missing required fields: name, age, country' })
    }
    const newUser = {
        id: Number(id),
        name: String(name),
        age: Number(age),
        country: String(country)
    }

    userList.push(newUser)
    res.status(201).json({
        message: 'User added successfully',
        user: newUser
    })
})

// To test with postman, use raw JSON body not form-data
app.put('/users/update/:id', (req, res) => {
    const userId = Number(req.params.id)
    const newData = req.body
    const userIndex = userList.findIndex(u => u.id === userId)
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' })
    }
    userList[userIndex] = { ...userList[userIndex], ...newData }
    res.status(201).json({
        message: 'User updated successfully',
        user: userList[userIndex]
    })
})

app.delete('/users/delete/:id', (req, res) => {
    const userId = Number(req.params.id)
    const userIndex = userList.findIndex(u => u.id === userId)
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' })
    }
    const deletedUser = userList.splice(userIndex, 1)
    res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser[0]
    })

})


app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`)
    console.log("http://localhost:" + port)
})
