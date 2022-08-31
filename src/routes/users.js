const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req,res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    //podemos usar express validation para este tipo de validaciones en formularios
    if(name.length <= 0){
        errors.push({text: 'Please Insert youy Name'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if(password.length  < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }  
    if(errors.length > 0 ){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        /* const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('success_msg', 'You email fail ');
            res.redirect('/users/signin');
        }5 */
        const newUser = new User ({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/signin');

    }
});

router.get('/users/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
})

// creando otro cierre de sesion cambio la manera de cerrar en su funccion de sincrona por asincrona el 11 de agosto 2022 me di cuenta del cambio

// router.get('/logout', function(req, res, next) {
//     req.logout(function(err) {
//         if (err) { return next(err); }
//         res.redirect('/signin');
//     });
// });

module.exports = router;

