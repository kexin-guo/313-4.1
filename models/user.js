const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
	country: {
		type: String,
        required: true,
	},
    first_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
	last_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
	address: {
		type: String,
		required: true,
		minlength: 1,
	},
	city: {
		type: String,
		required: true,
		minlength: 1,
	},
	state: {
		type: String,
		required: true,
		minlength: 1,
	},
	zip: {
		type: String
	},
	phone: {
		type: String
	}
}));

function validateUser(user) {
    const schema = Joi.object({
		country: Joi.string().min(1).max(50).required(),
        first_name: Joi.string().min(1).max(50).required(),
		last_name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
		address: Joi.string().min(1).max(255).required(),
		city: Joi.string().min(1).max(255).required(),
		state: Joi.string().min(1).max(255).required(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;