const nodemailer = require('nodemailer');
const templateEmailConfirm = require('../templates/templateEmailConfirm');

const emailConfirmUser = async (data) => {
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

    const href = `${process.env.FRONTEND_URL}/user/confirm-account/${token}`;

    await transport
      .sendMail({
        from: 'Tennis Club',
        to: email,
        subject: `Bienvenid@ ${name} 🎾!!`,
        text: 'Falta muy poquito para tener tu cuenta!! ',
        html: templateEmailConfirm({
          email,
          name,
          href,
          token,
        }),
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error, 'error');
  }
};

module.exports = emailConfirmUser;
