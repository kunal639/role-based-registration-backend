const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendEmail = async (to, name, role, details) => {
  // Logic to build a small summary list of their details
  const detailsHtml = Object.entries(details)
    .filter(([key]) => !['email', 'name'].includes(key)) // Don't repeat name/email
    .map(([key, value]) => `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`)
    .join('');

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `You're in, ${name}! Ready to change the game? 🚀`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #333; line-height: 1.6;">
        <h1 style="color: #007bff;">The stage is set.</h1>
        <p style="font-size: 1.1rem;">Hello <strong>${name}</strong>,</p>
        
        <p>This isn't just a confirmation—it's the start of something big. We've received your registration for <strong>Pitch With Nothing</strong>, and we’re already impressed by the energy you’re bringing to the table.</p>
        
        <div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Registration Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Role:</strong> ${role.toUpperCase()}</li>
            ${detailsHtml}
          </ul>
        </div>

        <p><strong>What’s next?</strong> We’re currently curation the lineup and preparing an environment where ideas turn into impact. Keep an eye on your inbox—we’ll be sharing some exclusive insights and event secrets very soon.</p>
        
        <p>Get ready to redefine what's possible.</p>
        
        <p>Cheers,<br><strong>The Pitch With Nothing Team</strong></p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 0.8rem; color: #888;">You received this because you registered for Pitch With Nothing 2026. If this wasn't you, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Impact email sent to ${to}`);
  } catch (err) {
    console.error("Email failed:", err);
  }
};

module.exports = sendEmail;