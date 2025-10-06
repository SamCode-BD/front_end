// lib/sendVerificationEmail.js
const {Resend} = require('resend');
const jwt = require('jsonwebtoken');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(user) {
  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.EMAIL_JWT_SECRET,
    { expiresIn: '1d' }
  );

  const verifyUrl = `http://localhost:3001/api/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Verify your email',
    html: `
      <p>Hello!</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
module.exports={sendVerificationEmail}
