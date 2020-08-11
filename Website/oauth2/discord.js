const express = require('express');
const fs = require('fs')

const router = express.Router();

const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

const CLIENT_ID = 732208102652379187;
const CLIENT_SECRET = "Qj4t6sMoeE_ecXCWdcAQFoI7L2v2Qxak";
const redirect = encodeURIComponent(address + '/api/discord/callback');

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

module.exports = router;