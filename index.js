const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = [];
const usersIds = [];
app.post('/api/users', bodyParser.urlencoded({extended:false}), function(req, res) {
  const user = req.body.username;

  if(!users.includes(user)){
    users.push(user);
    let userId = users.length-1;
    usersIds.push(userId);

    res.json({user: user, usersIds: userId});
  }
  else{
    getIndexOfUser = users.indexOf(user);
    let myUser = users[getIndexOfUser];

    res.json({user: myUser, usersIds: getIndexOfUser});
  }  

  console.log(users);
  console.log(usersIds);
  
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
