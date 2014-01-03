var options = require('optimist').argv;
var express = require('express');
var app = express();

app.configure(function(){
  app.set('port', options.port || process.env.PORT || 3000);
});

app.get('/', (function(){
  var started = new Date();
  return function(req,res) {
    res.send({
      started: started,
      uptime: (Date.now() - Number(started)) / 1000
    });
  }
})());

app.listen(app.get('port'), function() {
  console.log('module-app listening on http://localhost:%d', app.get('port'));
  console.log('argv: ', process.argv);
});