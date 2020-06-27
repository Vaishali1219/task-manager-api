const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//const me = new User({
//    name: ' Sharath Kumar ',
//    age: 29,
//    email: '   sharathemalone@gmail.com                  ',
//    password: 'vai  password'
//})

//me.save().then(() => {
//    console.log(me)
//}).catch((error) => {
//    console.error(error)
//})


//const task = new Tasks({
//    description: "Upper Body Challenge",
//    completed: false
//})

//task.save().then(() => {
//    console.log(task)
//}).catch((error) => {
//    console.error(error)
//})



