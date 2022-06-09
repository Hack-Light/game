var { Schema, model } = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	12,
);

const userSchema = new Schema({
	unique_id: { type: String, default: () => nanoid(), unique: true },
	email: String,
	username: String,
	firstname: String,
	lastname: String,
	password: String,
	passwordConf: String,
});
module.exports = model('user', userSchema);
