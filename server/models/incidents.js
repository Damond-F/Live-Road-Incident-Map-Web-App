const mongoose = require('mongoose')

const incidentSchema = new mongoose.Schema({
    incidentName: {
        type: String,
        required: false
    },
    lng: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    severity: {
        type: Number,
        required: false
    },
    imageURL: {
        type: String,
        required: false
    }
})

const incidentsModel = mongoose.model('incidents', incidentSchema)
module.exports = incidentsModel
