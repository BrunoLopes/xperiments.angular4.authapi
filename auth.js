var User = require('./models/User')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()
var moment = require('moment')

SECRET_KEY = 'secret123'

router.post('/register', (req, res) => {
    var userData = req.body;

    var user = new User(userData)

    user.save((err, newUser) => {
        if (err)
            return res.status(500).send({ message: 'Error saving user' })

        createSendToken(res, newUser)
    });

}),
    
router.post('/login', async (req, res) => {
    var loginData = req.body;

    var user = await User.findOne({ email: loginData.email })

    if(!user)
        return res.status(401).send({ message: 'Email or password invalid' })

    var hashedPwd = bcrypt.compare(loginData.pwd, user.pwd, (err, isMatch) => {
        if(!isMatch)
            return res.status(401).send({ message: 'Email or password invalid' })
        
        var payload = { sub: user._id }
            
        createSendToken(res, user)
    })
})

function createSendToken(res, user){
    var payload = { sub: user._id }
    
    var expires = moment().add(2, 'minutes').valueOf()

    var token = jwt.encode({ payload, exp: expires }, SECRET_KEY)
    res.status(200).send({token: token})
}

var auth = {
    router, 
    checkAuthenticated : (req, res, next) => {
        if(!req.header('authorization'))
            return res.status(401).send({ message: 'Unauthorized. Missing Auth header' })
        
        var token = req.header('authorization').split(' ')[1]
        var payload = jwt.decode(token, SECRET_KEY)

        if(!payload)
            return res.status(401).send({ message: 'Unauthorized. Auth header invalid' })
     
        if (payload.exp <= Date.now())
            return res.status(401).send({ message: 'Access token has expired' })
        
        req.userId = payload.sub
    
        next()
    }
}

module.exports = auth