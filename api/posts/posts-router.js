// const { router } = require("../server")

// implement your posts router here
const express = require("express");
const post = require("./posts-model");
const router = express.Router();

//APIS
//| 1 | GET    | /api/posts | Returns **an array of all the post objects** contained in the database
router.get("/", (req, res)=>{
    post.find(req)
    .then(posts=>{
        res.status(200).json(posts);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(`{ message: "The posts information could not be retrieved" }`)
    })
})
//| 2 | GET    | /api/posts/:id | Returns **the post object with the specified 
router.get("/:id", (req, res)=>{
    post.findById(req.params.id)
    .then(post=>{
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
        else{
            res.status(200).json(post);
        }
    })
    .catch(err=>{
        res.status(500).json({ message: "The post information could not be retrieved"});
    })
})

//| 3 | POST   | /api/posts | Creates a post using the information sent inside the request body and returns **the newly created post object**            

router.post("/", (req, res)=>{
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" });
    }
    else{
        post.insert(req.body)
        .then(post=>{
            console.log("post:",post);
            res.status(201).json({id:post.id,title:req.body.title,contents:req.body.contents});
        })
        .catch(err=>{
            res.status(500).json({ message: "There was an error while saving the post to the database" });
        })
    }

})

//| 4 | PUT    | /api/posts/:id | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
router.put("/:id", (req, res)=>{
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" });
    }
    else{
        post.update(req.params.id, req.body)
        .then(post=>{
            if(!post){
                res.status(404).json({ message: `The post with the specified ID ${req.params.id} does not exist` });
            }
            else{
                // res.status(200).json({id:req.params.id, title:req.body.title, contents:req.body.contents, created_at:post.created_at, updated_at:post.updated_at});
                res.status(200).json({id:post, title:req.body.title, contents:req.body.contents});
            }
        })  //then
        .catch(err=>{
            res.status(500).json({ message: "The post information could not be modified" })
            })  //catch   
    }
    
})
    
//| 5 | DELETE | /api/posts/:id  | Removes the post with the specified id and returns the **deleted post object**  
router.delete("/:id",(req, res)=>{
    post.findById(req.params.id)
    .then(results=>{
        if(results===null || results===undefined){
            res.status(404).json({ message: `The post with the specified ID ${req.params.id} does not exist` })
            }
        else{
                post.remove(req.params.id)
                 .then(()=>{res.status(200).json(results)})      
            .catch(err=>{
                res.status(500).json({ message: "The post could not be removed" });
            })
        }
    })
    .catch(err=>{
        res.status(500).json({ message: "The post could not be removed" });
    })
})
//| 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id 
router.get("/:id/comments", (req, res)=>{
    post.findById(req.params.id)
    .then(results=>{
        if(results===null || results===undefined){
            res.status(404).json({ message: `The post with the specified ID ${req.params.id} does not exist` })
        }
        else{
            post.findPostComments(req.params.id)
            .then(post=>{
                console.log("get comments:", post);
                res.status(200).json(post);    
               })
               .catch(err=>{
                res.status(500).json({ message: "The comments information could not be retrieved" });
            })
        }
    })

    .catch(err=>{
        res.status(500).json({ message: "The comments information could not be retrieved" });
    })
})
module.exports = router;