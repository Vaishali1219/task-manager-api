const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail } = require('../emails/account')
const { sendCancelEmail } = require('../emails/account')

router.get('/test', (req, res) => {
    res.send('From a new file')
})

//--------------------------------------------------------------------------------------------------
// UPLOADS
//--------------------------------------------------------------------------------------------------

const upload = multer({
    limits: 1000000,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jfif|png|jpeg|gif)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 100, height: 100 }).png().toBuffer()
    req.user.avatar = buffer
    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.status(200).send('successfully updated')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send('successfully removed')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png').send(user.avatar)
    } catch (e) {
        res.status(400).send()
    }
})

//--------------------------------------------------------------------------------------------------
// DELETE
//--------------------------------------------------------------------------------------------------

// Users - 

router.delete('/users/me', auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id)

        //if (!user) {
        //    return res.status(404).send()
        //}
        
        await req.user.remove() 
        sendCancelEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

//--------------------------------------------------------------------------------------------------
// UPDATE
//--------------------------------------------------------------------------------------------------

// Users - 

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    //const isValidOperation = updates.every((update) => {
    //    return allowedUpdates.includes(update)
    //})

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('Error: Invalid update')
    }

    try {
        //const user = await req.user

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        //if (!user) {
        //    return response.status(404).send()
        //}
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//--------------------------------------------------------------------------------------------------
// GET
//--------------------------------------------------------------------------------------------------

// Users - 

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    //try {
    //    const user = await User.find({})
    //    res.status(200).send(user)
    //} catch (e) {
    //    res.status(500).send(e)
    //}
    //User.find({}).then((users) => {
    //    res.send(users)
    //}).catch((e) => {
    //    res.status(500).send()
    //})
})

//router.get('/users/me', auth, async (req, res) => {
//    res.send(req.user)
//})

//router.get('/users/:id', auth, async (req, res) => {
//    const _id = req.params.id
//    try {
//        const user = await User.findById(_id)
//        if (!user) {
//            return res.status(404).send()
//        }
//        res.status(200).send(user)
//    } catch (e) {
//        res.status(500).send()
//    }
//    //User.findById(_id).then((user) => {
//    //    if (!user) {
//    //        return res.status(404).send()
//    //    }
//    //    res.send(user)
//    //}).catch((e) => {
//    //    res.status(500).send()
//    //})
//})

//------------------------------------------------------------------------------
// POST
//------------------------------------------------------------------------------

// Users Signup-

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
    //user.save().then(() => {
    //    res.status(201)
    //    res.send(user)
    //}).catch((error) => {
    //    res.status(404)
    //    res.send(error)
    //    console.log(error)
    //})
    //console.log(req.body)
    //res.send('<h1>testing</h1>')
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router