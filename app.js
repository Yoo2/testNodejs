
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var crypto = require('crypto');

//DB connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/japp');
var schema = mongoose.Schema;
var UserSchema = new schema({
      name : String,
      email : String,
      password : String,
      reg_date : Date
  });
var UserModel = mongoose.model('account', UserSchema);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
      UserModel.find({}, function(err, users) {
      userMap = {};
      users.forEach(function(user) {
	  userMap[user._id] = user;
	});
      res.send(userMap);
    });
  });
app.get('/registration',routes.registration);
app.post('/registration',function(req,res){
    UserModel.find({'email':req.body['email']},function(err,docs){
	if (docs.length == 0){
	  var account = new UserModel();
	  account.name = req.body['name'];
	  account.email = req.body['account'];
	  account.password = crypto.createHash('sha1').update(req.body['password']).digest('hex');
	  account.reg_date = new Date();
	  account.save(function(err){
	      if (!err) {
		res.render('Registration', {title:'Registration Success!'});
	      } else {
		res.render('Registration', {title:'Registration Failure!'});
	      }
	    });
	} else {
	  res.render('Registration', {title:'Duplicated Email! Check Plz..'});
	}
      });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
