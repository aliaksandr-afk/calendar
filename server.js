var express = require('express');
var app = express();
var path = require('path');
var request = require('request');

app.use(express.static(path.join(__dirname, '/public')));

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 20
});
app.use(limiter);

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/darkSky/:some', (req,res) => {
    var dsURL = 'https://api.darksky.net/forecast/';
    var secret = '83b6660876df25f1d7d419c755b6846b';
    var settings = '?exclude=minutely,hourly,alerts,flags&units=auto';
    var lat = '53.893009';
    var long = '27.567444';
    var time = req.query.time;
    var url = dsURL + secret + '/' + lat + ',' + long + ',' + time + settings;
    req.pipe(request(url)).pipe(res);
});


app.listen(3000, function(){
    console.log('server on port 3000');
});