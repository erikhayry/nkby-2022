  import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
});

export async function mail(text: string){    
    await transporter.sendMail({
        from: process.env.MAIL_USER, 
        to: process.env.MAIL_TO,
        subject: "Crawler result", 
        text
    });
}