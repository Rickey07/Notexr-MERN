const express = require('express');
const router = express.Router();
const fetchUser = require('../Middlewares/fetchUser')
const Notes = require('../Models/Notes')
const {body,validationResult} = require('express-validator')


// To Fetch All the Notes 
router.get('/allnotes' , fetchUser, async (req ,res) => {
    try {
        const notes = await Notes.find({user:req.user.id})
        res.json(notes)
    } catch (error) {
        console.log(error)
    }
    
});

// To create a new Note 

router.post('/createnote' , fetchUser,[body('title').exists(),body('description').isLength({min:5})], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errorMsg:"The values cannot be empty"})
    }
    const {title,description,tag} = req.body;
    try {
        const note = new Notes({
            title,description,tag,user:req.user.id
        })
       const newNote = await note.save();
        res.json(newNote)
    } catch (error) {
        console.log(error);
    }
})

// To update existing Note

router.put('/editnote/:id' , fetchUser,[body('title').exists(),body('description').isLength({min:5})], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errorMsg:"The values cannot be empty"})
    }

    try {
     const {title,description,tag} = req.body

     // Create a new Object

     const newNote = {};
     if(title){newNote.title = title}
     if(description){newNote.description = description}
     if(tag){newNote.tag = tag}

     // Find the note to be updated.

     let note = await Notes.findById(req.params.id)
     if(!note){ return res.status(404).json({errorMsg:"Note Not found"})}

     if(note.user.toString() !== req.user.id) {
        return res.status(401).json({errorMsg:"Not Allowed"})
     }

     note = await Notes.findByIdAndUpdate(req.params.id , {$set:newNote} , {new:true})
     res.json(note);
        
    } catch (error) {
        
    }
})

// To delete an existing note

router.delete('/deletenote/:id' , fetchUser, async (req,res) => {

    try {
     const {title,description,tag} = req.body

     // Find the note to be deleted.

     let note = await Notes.findById(req.params.id)
     if(!note){ return res.status(404).json({errorMsg:"Note Not found"})}

     if(note.user.toString() !== req.user.id) {
        return res.status(401).json({errorMsg:"Not Allowed"})
     }

     note = await Notes.findByIdAndDelete(req.params.id)
     res.json({successMsg:"Note has been successfully deleted"});
        
    } catch (error) {
        
    }
})

module.exports = router;