const express = require("express");

const db = require('./data/db');

const server = express();

server.use(express.json());

server.get("/", (req, res) => { // Always pass in the homies 
    res.send({api: "API is running"});
})

server.post("/api/posts", (req, res) => {
    const postData = req.body;
    if(!postData.title || !postData.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." }) 
    }
    else {
        db.insert(postData).then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.json({ error: "There was an error while saving the post to the database" })
        });
    } 
});

server.post("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const postData = req.body;
    bd.findeById(id).then(post => {
       if(!postData.text || !post) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
       }
    })
    .catch(error => {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    });
})

server.get("/api/posts", (req, res) => {
    db.find().then(posts => {
        res.status(201).json(posts)
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

server.get("api/posts/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id).then(post => {
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        else {
            res.json(post);
        }
    })
});

server.get("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    db.findById(id).then(post => {
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        else {
            res.json(post);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

server.delete("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id).then(post => {
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        else {
            db.remove(id).then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({ error: "The post could not be removed" })
            });
        }
    });
});

server.put("/api/posts/:id", (req,res) => {
    const id = req.params.id;
    const change = req.body;
    db.findById(id).then(post => {
        if(!post) {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
        else if(!change.title || !change.contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }
        else {
            db.update(id, change).then(post => {
                res.status(200).json(post);
            })
            .catch(error => {
                res.status(500).json({ error: "The post information could not be changed." })
            })
        }
    })
})

const port = 8000;
server.listen(port, () => {
    console.log(`API is running on port ${port}`);
})