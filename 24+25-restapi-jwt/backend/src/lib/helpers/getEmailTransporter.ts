import nodemailer from 'nodemailer'; //getTransporter()

let transporter: nodemailer.Transporter; // Declare the transporter variable outside the function
//function preps mailer to send emails
export const getEmailTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }
  return transporter;
};
