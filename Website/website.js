const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

//Basic website functions

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/HTML/index.html'));
});

router.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/HTML/index.html'));
});

router.get('*', function(req, res){
    res.sendFile(path.join(__dirname+'/HTML/404.html'));
  });

app.use('/', router);
app.listen(process.env.port || 5000);