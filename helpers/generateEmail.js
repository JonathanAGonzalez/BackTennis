const nodemailer = require('nodemailer');

const templateEmailConfirm = require('../templates/templateEmailConfirm');
const templateForgetPassword = require('../templates/templateForgetPassword');

const templateEmail = async (data) => {
  const { email, name, token, type } = data;

  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST_GMAIL_APP,
      port: 465,
      auth: {
        user: process.env.ACCOUNT_GMAIL_APP,
        pass: process.env.PASSWORD_GMAIL_APP,
      },
    });

    switch (type) {
      case 'confirm-account':
        //url
        const href = `${process.env.FRONTEND_URL}/user/confirm-account/${token}`;

        await transport
          .sendMail({
            from: 'Tennis Club',
            to: email,
            subject: `Bienvenid@ ${name} 🎾!!`,
            text: 'Falta muy poquito para tener tu cuenta!! ',
            html: templateEmailConfirm({
              type,
              email,
              name,
              href,
              token,
            }),
          })
          .catch((err) => console.log(err));

        return;

      case 'forget-password':
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
    }
  } catch (error) {
    console.log(error, 'error');
  }
};

module.exports = templateEmail;
