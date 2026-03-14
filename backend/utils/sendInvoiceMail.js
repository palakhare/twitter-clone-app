import nodemailer from "nodemailer"

const sendInvoiceMail = async (email, path) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: email,
    subject: "Subscription Invoice",
    text: "Your Subscription Activated",
    attachments: [
      {
        filename: "invoice.pdf",
        path: path
      }
    ]
  })
}

export default sendInvoiceMail