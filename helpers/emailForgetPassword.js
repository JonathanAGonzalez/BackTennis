const nodemailer = require('nodemailer');

const templateForgetPassword = require('../templates/templateForgetPassword');

const emailForgetPassword = async (data) => {
  const { email, name, token } = data;

  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST_GMAIL_APP,
      port: 465,
      auth: {
        user: process.env.ACCOUNT_GMAIL_APP,
        pass: process.env.PASSWORD_GMAIL_APP,
      },
    });

    await transport
      .sendMail({
        from: 'Tennis Club',
        to: email,
        subject: `Recupera tu password ${name} 🎾!!`,
        text: 'Falta muy poquito para tener tu cuenta!! ',
        html: templateForgetPassword({ token, email, name }),
      })
      .catch((err) => console.log(err));

    return;
  } catch (error) {
    console.log(error, 'error');
  }
};

module.exports = emailForgetPassword;
