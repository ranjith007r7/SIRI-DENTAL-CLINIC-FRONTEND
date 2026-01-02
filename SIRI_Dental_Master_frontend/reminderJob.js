const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const sendEmail = require("./sendEmail");

cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running reminder job...");

  const now = new Date();
  const next24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const start = new Date(next24);
  start.setMinutes(0, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  const appointments = await Appointment.find({
    reminderSent: false,
    dateTime: { $gte: start, $lt: end }
  });

  for (let appt of appointments) {
    await sendEmail(
      appt.email,
      "Appointment Reminder – SIRI Dental Clinic",
      `
      <h2>Appointment Reminder</h2>
      <p>Dear ${appt.name},</p>

      <p>This is a reminder for your appointment tomorrow.</p>

      <ul>
        <li><b>Doctor:</b> ${appt.doctor}</li>
        <li><b>Date:</b> ${appt.date}</li>
        <li><b>Time:</b> ${appt.timeSlot}</li>
      </ul>

      <p>Please arrive 10 minutes early.</p>

      <p>Regards,<br/>SIRI Dental Team</p>
      `
    );

    appt.reminderSent = true;
    await appt.save();
  }
});
