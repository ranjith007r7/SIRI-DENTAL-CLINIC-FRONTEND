const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    doctor: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    problem: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    /*reminderSent: {
        type: Boolean,
        default: false
}*/

});

module.exports = mongoose.model("Appointment", appointmentSchema);
