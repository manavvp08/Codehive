import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const mailOptions = {
        from: "codeoverflow@gmail.com",
        to: email,
        subject: "Verify your email",
        text: "This token expires in 10 minutes.",
        html: `<p>This is your token: <h1>${token}</h1></p>`
    };

    await transporter.sendMail(mailOptions);
};