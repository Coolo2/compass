const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/HTML/index.html'));
});

router.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/HTML/index.html'));
});
/*
router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});
*/
//add the router
router.get('*', function(req, res){
    res.sendFile(path.join(__dirname+'/HTML/404.html'));
  });

app.use('/', router);
app.listen(process.env.port || 5000);