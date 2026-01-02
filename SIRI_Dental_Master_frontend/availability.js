const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

const ALL_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM"
];

router.get("/", async (req, res) => {
  const { doctor, date } = req.query;

  const booked = await Appointment.find({ doctor, date });
  const bookedSlots = booked.map(a => a.timeSlot);

  const availableSlots = ALL_SLOTS.filter(
    slot => !bookedSlots.includes(slot)
  );

  if (availableSlots.length === 0) {
    return res.json({
      status: "FULL",
      message: "All slots are booked. Please choose another doctor or date."
    });
  }

  res.json({
    status: "AVAILABLE",
    slots: availableSlots
  });
});

module.exports = router;
