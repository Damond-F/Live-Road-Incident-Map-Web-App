const express = require('express')
const app = express()
const mongoose = require('mongoose')
const incidentsModel = require('./models/incidents')
require('dotenv').config()

const cors = require('cors')
app.use(cors())

app.use(express.json())

mongoose.connect(`${process.env.REACT_APP_MONGODB_KEY}`)

app.get('/getIncidents', (req, res) => {
    incidentsModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    })
})

app.post('/createIncident', async (req, res) => {
    const incident = req.body
    const newIncident = new incidentsModel(incident)
    await newIncident.save()

    res.json(incident)
})

app.delete('/deleteAll', async (req, res) => {
    await incidentsModel.deleteMany()
})


app.listen(3001, () => {
    console.log('server is running')
})