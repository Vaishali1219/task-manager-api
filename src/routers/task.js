const express = require('express')
const Tasks = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

//--------------------------------------------------------------------------------------------------
// DELETE
//--------------------------------------------------------------------------------------------------

// Tasks-

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return response.status(404).send()
        }
        //const task = await Tasks.findByIdAndDelete(req.params.id)
        res.status(200).send('Deleted')
    } catch (e) {
        return res.status(500).send(e)
    }
})

//--------------------------------------------------------------------------------------------------
// UPDATE
//--------------------------------------------------------------------------------------------------

// Tasks-

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send('Error: Invalid update')
    }

    try {

        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        
        //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return response.status(404).send()
        }


        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//--------------------------------------------------------------------------------------------------
// GET
//--------------------------------------------------------------------------------------------------

// Tasks-

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0 (getting 1st page)
// GET/tasks?sortBy=createdAt_asc or desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const task = await Tasks.find({owner: req.user._id})
        //await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            //match: {
            //    completed: false
            //}
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
    //Tasks.find({}).then((task) => {
    //    res.send(task)
    //}).catch((e) => {
    //    res.status(500).send()
    //})
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Tasks.findById(_id)

        const task = await Tasks.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
    //Tasks.findById(_id).then((task) => {
    //    if (!task) {
    //        return res.status(404).send()
    //    }
    //    res.send(task)
    //}).catch((e) => {
    //    res.status(500).send()
    //})
})

//------------------------------------------------------------------------------
// POST
//------------------------------------------------------------------------------

// Task-

router.post('/tasks', auth,async (req, res) => {
    //const task = new Tasks(req.body)

    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }
    //task.save().then(() => {
    //    res.status(201)
    //    res.send(task)
    //}).catch((error) => {
    //    res.status(400)
    //    res.send(error)
    //})
})

module.exports = router