const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const Note = require('../models/Note');
const {isAuthenticated} = require('../helpers/auth');


router.get('/notes/add' , isAuthenticated, (req,res)=> {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req,res) => {
    const{title, description} = req.body;
    const erors = [] ;
    if(!title){
        erors.push({text: 'Please Write a Title'});
    }
    if(!description){
        erors.push({text: 'Please Write a Description'});
    }
    if(erors.length > 0 ){
        res.render('notes/new-note', {
        erors,
        title,
        description    
        });
    }else{
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note Added successfully');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req,res)=>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', {notes});
    
    //res.render('notes/all-notes',{notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) =>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) =>{
    const{title, description}= req.body;
    await Note.findByIdAndUpdate(req.params.id,{title, description});
    req.flash('success_msg', 'Note Actualized successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated,  async (req,res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Delete successfully');
    res.redirect('/notes');
} );

//estudiar
//res.status //estandares de respuestas de http // usar postman par probar errores con respuestas de manera correcta 
// manejo de errores // usar mysql // Middlewares


module.exports = router;

