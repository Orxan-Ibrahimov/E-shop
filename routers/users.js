const bcrypt = require('bcryptjs/dist/bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const { User } = require('../models/user')
const router = express.Router()

router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash')

    if (!userList) {
        res.status(400).send("User list wasn't found!")
    }

    res.status(200).send(userList)
})

router.get('/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId)

    if (!user) {
        res.status(400).send("User wasn't found!")
    }

    res.status(200).send(user)
})

router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments()

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.status(200).send({
        count: userCount,
    })
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
    })

    user = await user.save()

    if (!user) res.status(400).send('User can not added!')

    res.status(200).send(user)
})

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
    })

    user = await user.save()

    if (!user) res.status(400).send('User can not added!')

    res.status(200).send(user)
})

router.put('/:userId', async (req, res) => {
    const oldUser = await User.findById(req.params.userId)
    let newPassword = req.body.passwordHash
    if (newPassword) {
        newPassword = bcrypt.hashSync(newPassword, 10)
    } else {
        newPassword = oldUser.passwordHash
    }

    const user = await User.findById(
        req.params.userId,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
        },
        { new: true }
    )

    if (!user) return res.status(400).send('User can not be updated')

    res.status(200).send(user)
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
        const secret = process.env.secret
        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '1d',
            }
        )
        res.status(200).json({
            message: 'User was Authentificated',
            token:token
        })
    } else {
        res.status(400).send("User wasn't founded")
    }
    if (!user) res.status(400).send('User can not added!')
})

router.delete('/:userId', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.userId))
        return res.status(400).send('User is Invalid')

    User.findByIdAndRemove(req.params.userId)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User can not be deleted!',
                })
            }
            res.status(200).send(deletedUser)
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                error: err,
            })
        })
})

module.exports = router