var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

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

app.post('/register', (req, res) => {
    var userData = req.body;

    var user = new User(userData)

    user.save((err, result) => {
        if (err)
            console.log('saving user error')

        res.sendStatus(200)
    });

});

mongoose.connect('mongodb://localhost:27017/xperiment-mongodb', { useMongoClient: true }, (err) => {
    if (err)
        console.log(err)
    else
        console.log('Connected to mongodb')
});

app.listen(6799)