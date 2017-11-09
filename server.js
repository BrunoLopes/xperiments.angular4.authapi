var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')

var User = require('./models/User')

var posts = [
    { message: 'hello' },
    { message: 'hi' }
]

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/posts', (req, res) => {
    res.send(posts)
});

app.get('/users', async (req, res) => {

try
{
    var users = await User.find( {  }, '-pwd -__v' )
    res.send(users)
}
catch(error)
{
    console.error(error)
    res.send(500)
}


    
});

app.post('/register', (req, res) => {
    var userData = req.body;

    var user = new User(userData)

    user.save((err, result) => {
        if (err)
            console.log('saving user error')

        res.sendStatus(200)
    });

});

app.post('/login', async (req, res) => {
    var userData = req.body;

    var user = await User.findOne({ email: userData.email })

    if(!user)
        return res.status(401).send({ message: 'Email or password invalid' })

    if(userData.pwd != user.pwd)
        return res.status(401).send({ message: 'Email or password invalid' })
    
    var payload = {}

    var token = jwt.encode(payload, 'secret123')

    console.log(token)

    res.status(200).send({token: token})

});

//mongoose.connect('mongodb://localhost:27017/xperiment-mongodb', { useMongoClient: true }, (err) => {
mongoose.connect('mongodb://xperiment:xperiment@ds151955.mlab.com:51955/xperiment-mongodb', { useMongoClient: true }, (err) => {
    if (err)
        console.log(err)
    else
        console.log('Connected to mongodb')
});

app.listen(6799)