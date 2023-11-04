const router = require("express").Router();
const User = require('../models/user')
const bcrypt = require("bcrypt")

//  Creating User
router.post('/register', async (req, res) => {
    try {
        const { username, fullname, password, picture } = req.body
        console.log(req.body);
        const user = await User.create({ username, fullname, password, picture });
        res.status(201).json(user)
    }
    catch (e) {
        let msg;
        if (e.code == 11000) {
            msg = "Bu foydalanuvchi nomi mavjud"
        }
        else {
            msg = e.message
        }
        console.log(e)
        res.status(400).json(msg)
    }
})

//  Login User
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findByCredentials({ username, password });
//         user.status = 'online';
//         await user.save();
//         res.status(200).json(user);
//     } catch (e) {
//         res.status(400).json(e.message)
//     }
// })

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: 'Username xato...!' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        user.status = 'Online';
        await user.save();
        // res.json({ user });
        res.status(200).json(user);
    } else {
        res.status(401).json({ error: 'Parol xato...!' });
    }
});

module.exports = router