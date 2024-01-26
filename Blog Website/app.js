const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

app.set('view engine', 'ejs'); // Use EJS as the view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the home page
app.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('home', { posts: posts });
    });
});

// Serve the compose page
app.get('/compose', (req, res) => {
    res.render('compose');
});

// Handle new post submission
app.post('/compose', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    newPost.save((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
