const express = require('express');
const app = express()
const fs = require('fs');
const port = 3002;

function getBlogPosts() {
    let text = fs.readFileSync('database.json');
    return JSON.parse(text);
}

function savePosts(posts) {
    let text = JSON.stringify(posts);
    fs.writeFileSync('database.json', text);
}

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/blogposts', (req, res) => {
    let blogposts = getBlogPosts();
    return res.json(blogposts);
})

app.get('/postbyid/:postid', (req, res) => {
    const idpost = req.params.postid;
    const id = parseInt(idpost);
    const data = getBlogPosts().filter(post => post.id === id)
    res.json(data[0])
})

app.get('/postbyauthor/:author', (req, res) => {
    const authorName = req.params.author;
    const data = getBlogPosts().filter(post => post.Author === authorName);
    res.json(data[0])
})

app.post('/post', (req, res) => {
    const createPost = req.body;
    const posts = require('./database.json');
    createPost.id = posts.length + 1;
    posts.push(createPost);
    savePosts(posts);

    return res.json(createPost);

});

app.put('/post/:id', (req, res) => {
    const updatePost = req.body;
    const idPost = parseInt(req.params.id);
    const posts = require('./database.json');
    let postUpdate = posts.filter(post => post.id === idPost)[0];

    postUpdate.date = updatePost.date;
    postUpdate.author = updatePost.author;
    postUpdate.title = updatePost.title;
    postUpdate.content = updatePost.content;
    savePosts(posts);

    return res.json(postUpdate);

})

app.delete('/post/:id', (req, res) => {
    let postId = parseInt(req.param.id);
    const posts = require('./database.json');
    let indexOf = posts.findIndex(post => post.id === postId);
    posts.splice(indexOf, 1);
    savePosts(posts);

    return res.json(postId);
})





app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))