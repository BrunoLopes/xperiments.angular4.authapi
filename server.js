var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var User = require('./models/User')
var auth = require('./auth')
var Post = require('./models/Post')
var jwt = require('jwt-simple')

mongoose.Promise = Promise

app.use(cors())
app.use(bodyParser.json())



app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts)
});

app.post('/post', auth.checkAuthenticated, (req, res) => {
    var postData = req.body
    postData.author = req.userId

    var post = new Post(postData)
    //console.log(post)
    post.save((err, result) => {
        if (err){
            console.log('saving post error')
            return res.status(500).send({message:'saving post error'})
        }
        res.sendStatus(200)
    })
});

app.get('/users', auth.checkAuthenticated, async (req, res) => 
{
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

app.get('/profile/:id', async (req, res) => 
{
    //console.log(req.params.id)
    try
    {
        var user = await User.findById( req.params.id, '-pwd -__v' )
        res.send(user)
    }
    catch(error)
    {
        console.error(error)
         res.send(500)
    }
});


//mongoose.connect('mongodb://localhost:27017/xperiment-mongodb', { useMongoClient: true }, (err) => {
mongoose.connect('mongodb://xperiment:xperiment@ds151955.mlab.com:51955/xperiment-mongodb', { useMongoClient: true }, (err) => {
    if (err)
        console.log(err)
    else
        console.log('Connected to mongodb')
});

app.use('/auth', auth.router)

app.listen(process.env.PORT || 6799)