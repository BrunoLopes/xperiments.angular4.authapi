var User = require('./models/User')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()
var moment = require('moment')
require('dotenv/config')

SECRET_KEY = process.env.JWT_SECRET_KEY

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

        //var user = { _id:'sdfdsfsdfsdfdfds', pwd:'dsfsdfd', email: 'email@email.com', name:'name' }
            
        createSendToken(res, user)
    })
})

function createSendToken(res, user){
    var payload = { sub: user._id }
    
    var expires = moment().add(1, 'minutes').valueOf()

    var token = jwt.encode({ payload, exp: expires }, process.env.JWT_SECRET_KEY)
    res.status(200).send({token: token})
}

var auth = {
    router, 
    checkAuthenticated : (req, res, next) => {
        if(!req.header('authorization'))
            return res.status(401).send({ message: 'Unauthorized. Missing Auth header' })
        
        try
        {
            var token = req.header('authorization').split(' ')[1]
            if(!token)
                return res.status(401).send({ message: 'Unauthorized. Missing token' })

            var payload = jwt.decode(token, process.env.JWT_SECRET_KEY)

            if(!payload)
                return res.status(401).send({ message: 'Unauthorized. Auth header invalid' })
        
            if (payload.exp <= Date.now())
                return res.status(401).send({ message: 'Access token has expired' })
            
            req.userId = payload.sub
        
            next()
        }
        catch(error)
        {
            console.error(error)
            res.status(500).send({ message: 'Ocorreu um erro interno no servidor.'})
        }
    }
}

module.exports = auth
