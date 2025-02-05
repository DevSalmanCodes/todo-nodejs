import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
function generateOtp() {
  return otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });
}

async function sendEmail(email) {
  const otp = generateOtp();
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 465,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
    return otp;
  } catch (err) {
    throw err;
  }
}

export default sendEmail;
