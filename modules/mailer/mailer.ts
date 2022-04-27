  import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
});

export default async function mail(text: string): Promise<boolean>{    
    const info = await transporter.sendMail({
        from: process.env.MAIL_USER, 
        to: process.env.MAIL_TO,
        subject: "Crawler result", 
        text
    });

    console.log(info);
    
    if(info.rejected.length > 0){
        return false
    }

    return true
}