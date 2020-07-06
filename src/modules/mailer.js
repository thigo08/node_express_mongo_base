const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/auth');

const transport = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
        user,
        pass
    }
});

transport.use('compile', hbs({
    /*viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',*/

    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./resources/mail/'),
        layoutsDir: path.resolve('./resources/mail/'),
        defaultLayout: 'auth/forgot_password.html',
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html'
}));

module.exports = transport;