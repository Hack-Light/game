var { Schema, model } = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	12,
);

const gameSchema = new Schema({
	unique_id: { type: String, default: () => nanoid(), unique: true },
	vendor: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
	number: Number,
	odd: Number,
	lastname: String,
	price: Number,
	tries: Number,
	hint: Number,
	max: Number,
	min: Number,
});
module.exports = model('game', gameSchema);
