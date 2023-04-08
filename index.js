const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

// mongoose connection to the Data Base
mongoose.connect(process.env.MONGO_URI, console.log('connected to MongoDB succesfull')
);

//create schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
}, {
  versionKey: false
});

//Create model
const User = mongoose.model('User', userSchema);

app.use(cors())
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', async (req, res) =>{
  const username = req.body.username;

  const user = await User.create({
    username
  });


  res.json(user);
});



// Add exercise to user
app.post("/api/users/:_id/exercises", bodyParser.urlencoded({extended:false}), (req, res) => {
  
  }
);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
