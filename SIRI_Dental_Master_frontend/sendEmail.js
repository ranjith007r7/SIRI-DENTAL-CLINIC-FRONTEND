const nodemailer = require("nodemailer");

const sendEmail = async ({ to, name, doctor, date, time, type = "confirm" }) => {
  if (!to) {
    throw new Error("No recipient email provided");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const isCancel = type === "cancel";

  const mailOptions = {
    from: `"SIRI Dental Clinic" <${process.env.EMAIL_USER}>`,
    to,
    subject: isCancel
      ? "Appointment Cancelled – SIRI Dental Clinic"
      : "Appointment Confirmed – SIRI Dental Clinic",
    html: `
      <h2>${isCancel ? "Appointment Cancelled" : "Appointment Confirmation"}</h2>

      <p>Dear <b>${name}</b>,</p>

      <p>
        ${
          isCancel
            ? "Your appointment has been <b> cancelled </b> successfully. You may book a new appointment at your convenience. The details of the cancelled appointment are provided below"
            : "Your appointment has been successfully <b> booked</b>.The details of the booked appointment are provided below"
        }
      </p>

      <ul>
        <li><b>Doctor:</b> ${doctor}</li>
        <li><b>Date:</b> ${date}</li>
        <li><b>Time:</b> ${time}</li>
      </ul>

      <p>📍 SIRI Dental Clinic</p>
      <p>📞 Contact: 75400 60604</p>

      <br>
      <p>Regards,<br>SIRI Dental Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
