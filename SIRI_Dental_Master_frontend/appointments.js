const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const sendEmail = require("../utils/sendEmail");


// GET: Fetch appointments (optional filters)
router.get("/", async (req, res) => {
  try {
    const { doctor, date } = req.query;

    let filter = {};
    if (doctor) filter.doctor = doctor;
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message
    });
  }
});

// GET: Fetch booked slots for doctor + date
router.get("/availability", async (req, res) => {
  try {
    const { doctor, date } = req.query;

    if (!doctor || !date) {
      return res.status(400).json({
        message: "Doctor and date are required"
      });
    }

    const appointments = await Appointment.find({
      doctor,
      date
    });

    const bookedSlots = appointments.map(a => a.timeSlot);

    res.json({ bookedSlots });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching availability",
      error: error.message
    });
  }
});

// POST: Book Appointment
/*router.post("/", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);

    // 1️⃣ Save to MongoDB
    await appointment.save();

    // 2️⃣ Send confirmation email (PASTE HERE)
    await sendEmail(
      appointment.email,
      "Appointment Confirmed – SIRI Dental Clinic",
      `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${appointment.name},</p>

        <p>Your appointment has been successfully booked.</p>

        <ul>
          <li><strong>Doctor:</strong> ${appointment.doctor}</li>
          <li><strong>Date:</strong> ${appointment.date}</li>
          <li><strong>Time:</strong> ${appointment.timeSlot}</li>
        </ul>

        <p>📍 SIRI Dental Clinic</p>
        <p>📞 Contact: 75400 60604</p>

        <br>
        <p>Regards,<br>SIRI Dental Team</p>
      `
    );

    // 3️⃣ Send response to frontend
    res.json({ message: "Appointment booked successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking appointment" });
  }
});
*/

router.post("/", async (req, res) => {
  console.log("📥 Incoming appointment data:", req.body);

  try {
    const appointment = new Appointment(req.body);
    await appointment.save();

    // ✅ SEND EMAIL WITH CORRECT NAME
    await sendEmail({
      to: req.body.email,
      name: req.body.patientName,   // 🔥 THIS WAS MISSING / WRONG
      doctor: req.body.doctor,
      date: req.body.date,
      time: req.body.timeSlot
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(400).json({
      message: "Error booking appointment",
      error: error.message
    });
  }
});


// DELETE: Cancel appointment by ID
// DELETE: Cancel appointment by ID + send email
router.delete("/:id", async (req, res) => {
  try {
    // 1️⃣ Fetch appointment first
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2️⃣ Send cancellation email
    if (appointment.email) {
      await sendEmail({
        to: appointment.email,
        name: appointment.patientName,
        doctor: appointment.doctor,
        date: appointment.date,
        time: appointment.timeSlot,
        type: "cancel"
      });
    }

    // 3️⃣ Delete appointment
    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: "Appointment cancelled successfully" });

  } catch (error) {
    console.error("❌ Cancel failed:", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});







module.exports = router;
