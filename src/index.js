const express = require('express')
require('./db/mongoose.js')
const app = express()
const port = process.env.PORT
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const multer = require('multer')


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on the port ' + port)
})


//const upload = multer({
//    dest: 'pdfs',
//    limits: {
//        fileSize: 5000000
//    },
//    fileFilter(req, file, cb) {
//        if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
//            return cb(new Error('File must be a PDF or word document'))
//        }

//        cb(undefined, true)
//        //cb(undefined, false)
//    }
//})

////const errorMiddleware = (req, res, next) => {
////    throw new Error('From my middleware')
////}

//app.post('/upload', upload.single('upload'), (req, res) => {
//    res.send('success')
//}, (error, req, res, next) => {
//        res.status(400).send({error: error.message})
//})

//const Task = require('./models/task')
//const User = require('./models/user')
//const main = async () => {
//    //const task = await Task.findById('5eed685a1a87436368c5aa1a')
//    //await task.populate('owner').execPopulate()
//    //console.log(task.owner)

//    const user = await User.findById('5eed67c1319e4458ec87da28')
//    await user.populate('tasks').execPopulate()
//    console.log(user.tasks)

//}

//main()

//const myFunction = async () => {
//    const pet = {
//        name: 'Hal'
//    }

//    console.log(JSON.stringify(pet))

//    pet.toJSON = function () {
//        console.log(this)
//        return this
//    }

//    console.log(JSON.stringify(pet))
//}

//myFunction()

// without middleware -> new request -> run route handler

// with middleware -> new request -> do something -> run route handler

//app.use((req, res, next) => {
//    if (req.method === 'GET') {
//        res.send('GET Requests are disabled')
//    } else {
//        next()
//    }
//    //console.log(req.method, req.path)
//    //next()
//})

//app.use((req, res, next) => {
//    return res.status(503).send('Service is temporarily unavailable try again later')
//})

//const router = new express.Router()
//router.get('/test', (req, res) => {
//    res.send("This from my another Router")
//})
