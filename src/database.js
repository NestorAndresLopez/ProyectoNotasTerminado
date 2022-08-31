const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app',{


useNewUrlParser: true, 

useUnifiedTopology: true 

}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});