const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

// mongoose connection to the Data Base
mongoose.connect(process.env.MONGO_URI, console.log('connected to MongoDB succesfull')
);

//create schema for user
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
}, {
  versionKey: false
});
//Create schema for users exercise 
const exerciseSchema = mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
  userId: String
}, {
  versionKey: false
});

//Create model
const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);


app.use(cors())
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Get all users
app.get('/api/users/', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/api/users', async (req, res) =>{
  const username = req.body.username;
  const foundUser = await User.findOne({username});

  // Checks if user was already created and if so then return the user
  if(foundUser){
    res.json(foundUser);
  }
   // Creates user
  const user = await User.create({
    username
  });


  res.json(user);
});


app.get("/api/users/:_id/logs", async (req, res) =>{
  let {from, to, limit} = req.query;
  const userId = req.params._id;
  const foundUser =  await User.findById(userId);
  if(!foundUser){
      res.json("No user exist for that Id");
  } 
  
  let filter = {userId};
  let dateFilter = {};
  if(from){
    dateFilter['$gte'] = new Date(from);
  }
  if(to){
    dateFilter['lte'] = new Date(to);
  }
  if(from || to){
    filter.date = dateFilter;
  }
  if(limit){
    limit = 100;
  }

  let exercises = await Exercise.find(filter).limit(limit);
  exercises = exercises.map((exercise) => {
     return {
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
     }
  });
  
  res.send({
    username: foundUser.username,
    count: exercises.length,
    _id: userId,
    log: exercises
  });
});

// Add exercise to user
app.post("/api/users/:_id/exercises", async (req, res) => {
    const userId = req.body[':_id'];
    let { description, duration, date}  = req.body;
    const foundUser =  await User.findById(userId); 

    if(!foundUser){
      res.json("No user exist for that Id");
    }

    if(!date){
      date = new Date();
    }else{
      date = new Date(date);
    }

    await Exercise.create({
      username: foundUser.username,
      description,
      duration,
      date,
      userId
    });

    res.send({
      username: foundUser.username,
      description,
      duration,
      date: date.toDateString(),
      _id: userId,
    });
  }
);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
