var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var nunjucks = require('nunjucks');
var validator = require('email-validator');
var sassMiddleware = require('node-sass-middleware');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/iServiceDB)');

const { User, validate } = require('./models/user');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

nunjucks.configure(['views/'], {
  autoescape: true,
  express: app
})

app.use(sassMiddleware({
  src: path.join(__dirname, 'bootstrap'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))


app.use(express.static(path.join(__dirname, 'public')))

var PORT = process.env.PORT || 3000;        // set our port

var router = express.Router();
app.use('/', router);
  
router.get('/',function(req, res){
	data = {}
	res.render('register.njk', data)
});

router.post('/register', async (req, res) => {
	errors = [];
	
	// User mongose validation if necessary
	//const { error } = validate(req.body);
	//console.log('errors:', error);
	
	if(req.body.country == undefined || req.body.country.trim() == '') { errors.push('Country or residence required'); }
	
	if(req.body.first_name == undefined || req.body.first_name.trim() == '') { errors.push('Firstname required'); }	
	
	if(req.body.last_name == undefined || req.body.last_name.trim() == '') { errors.push('Lastname required'); }
	
	if(req.body.email == undefined || req.body.email.trim() == '') { errors.push('Email required'); }
	else if(!validator.validate(req.body.email)) { errors.push('Incorrect email format'); }
	
	if(req.body.password == undefined || req.body.password.trim() == '') { errors.push('Password required'); }
	
	if(req.body.password2 == undefined || req.body.password2.trim() == '') { errors.push('Password confirmation required'); }
	
	if(req.body.password != undefined && req.body.password2 != undefined) {
		if(req.body.password.trim() && req.body.password2.trim() && req.body.password.trim() != req.body.password2.trim()) { errors.push('Passwords does not match');  }
		else if(req.body.password.trim().length < 8) { errors.push('Password must be atleast 8 characters long');  }
	}

	if(req.body.address == undefined || req.body.address.trim() == '') { errors.push('Address required'); }
	
	if(req.body.city == undefined || req.body.city.trim() == '') { errors.push('City required'); }
	
	if(req.body.state == undefined || req.body.state.trim() == '') { errors.push('State, Province or Region required'); }
	
	
	// Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
	if (user) { errors.push('Email already taken by another user. Please find new one.'); }
	
	if(errors.length) {
		res.render('register.njk', {
			errors: errors, 
			data: req.body,
		});
		return;
	}
	// Insert the new user if they do not exist yet
	user = new User({
		country: req.body.country,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
		address: req.body.address,
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		phone: req.body.phone,
	});
	await user.save();
	res.json(user);
});

app.use('*', function(req, res) {
	res.send('Error 404: Not Found!');
});
  
app.listen(PORT, function() {
	console.log('Server running at Port 3000');
});