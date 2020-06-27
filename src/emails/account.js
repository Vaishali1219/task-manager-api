const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vaishsvs12@gmail.com',
        subject: 'Thanks for joining in!',
        text: `<h1>Welcome ${name}, let me know how you get along the app</h1>`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vaishsvs12@gmail.com',
        subject: 'Cancellation',
        text: `Ooo ${name} Sorry may I knw the reason for your cancellation`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

//sgMail.send({
//    to: 'clearexamseasy@gmail.com',
//    from: 'vaishsvs12@gmail.com',
//    subject: 'Hi Panni Kutti',
//    text: 'I Love You'
//})