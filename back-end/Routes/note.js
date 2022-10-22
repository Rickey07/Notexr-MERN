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
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errorMsg:"The values cannot be empty",success})
    }
    const {title,description,tag} = req.body;
    try {
        const note = new Notes({
            title,description,tag,user:req.user.id
        })
       const newNote = await note.save();
       success = true;
        res.json({newNote,success,msg:"Note has been successfully created"});
    } catch (error) {
        console.log(error);
    }
})

// To update existing Note

router.put('/editnote/:id' , fetchUser,[body('title').exists(),body('description').isLength({min:5})], async (req,res) => {
    let success = false;

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
     if(!note){ return res.status(404).json({success,msg:"Note Not found"})}

     if(note.user.toString() !== req.user.id) {
        return res.status(401).json({success,msg:"Not Allowed"})
     }

     note = await Notes.findByIdAndUpdate(req.params.id , {$set:newNote} , {new:true})
     success=true
     res.json({note,success,msg:"Note has been successfully updated"});
        
    } catch (error) {
        console.log(error);
    }
})

// To delete an existing note

router.delete('/deletenote/:id' , fetchUser, async (req,res) => {
    let success = false;

    try {
     // Find the note to be deleted.

     let note = await Notes.findById(req.params.id)
     if(!note){ return res.status(404).json({msg:"Note Not found",success})}

     if(note.user.toString() !== req.user.id) {
        return res.status(401).json({msg:"Not Allowed",success})
     }

     note = await Notes.findByIdAndDelete(req.params.id)
     success = true;
     res.json({msg:"Note has been successfully deleted",success});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;