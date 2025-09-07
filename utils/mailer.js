const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"Pahari Maggie 🍜" <${process.env.EMAIL}>`,
    to,
    subject: "Your OTP for Password Reset",
    html: `
      <div style="font-family: Poppins, Arial, sans-serif; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#f5a623;">🔐 Password Reset OTP</h2>
        <p>Hello,</p>
        <p>Your OTP code is:</p>
        <h1 style="color:#f5a623; letter-spacing:3px;">${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <br/>
        <p>– Pahari Maggie Team</p>
      </div>
    `
  });
}

module.exports = { sendOtpEmail };
