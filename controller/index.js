const User = require('../models/user');
const Game = require('../models/game');

exports.createGame = async (req, res) => {
	const data = req.body || {};
	// console.log(req.body);

	if (!data.amount) {
		return res.status(422).send({ success: false, message: 'Server Error' });
	}

	if (!data.vendor) {
		return res.status(422).send({ success: false, message: 'Server Error' });
	}

	// if (!data.price) {
	// 	return fail(res, 422, 'Vendor not specified');
	// }

	if (!data.odds) {
		return res.status(422).send({ success: false, message: 'Server Error' });
	}

	try {
		let vendor = await User.findOne({ unique_id: data.vendor });

		if (vendor == undefined) {
			return res
				.status(200)
				.send({ success: false, message: 'owner not found' });
			// return fail(res, 404, 'User not found');
		} else {
			let number = Math.ceil(Math.random() * 1000);

			let game = await new Game({
				number: number,
				vendor: vendor._id,
				odd: data.odds,
				amount: data.amount,
				price: Number(data.amount) + Number(data.odds) * Number(data.amount),
				tries: 3,
				hint: 2,
				max: 1000,
				min: 0,
			});

			game = await game.save();
			return res.send({ success: true, id: game.unique_id });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, message: 'Server Error' });
	}
};

exports.playGame = async (req, res) => {
	const data = req.body || {};

	// Validate request

	try {
		if (!data.guess) {
			return res.status(422).send({ success: false, message: 'Server Error' });
		}

		if (!data.game_id) {
			return res.status(422).send({ success: false, message: 'Server Error' });
		}

		// if (!data.vendor) {
		// 	return fail(
		// 		res,
		// 		422,
		// 		'User address can not be empty and must be alphanumeric.',
		// 	);
		// }

		let game = await Game.findOne({ game_id: data.game_id });

		console.log(data.vendor, user);

		if (game == undefined) {
			return res
				.status(200)
				.send({ success: false, message: 'Game not found' });
			// return fail(res, 404, 'User not found');
		}

		if (game.correctNumber !== data.guess) {
			return res
				.status(200)
				.send({ success: false, message: 'Incorrect guess' });
		}

		if (game.correctNumber == data.guess) {
			game.won = true;
			await game.save();
			return res.status(200).send({ success: true, message: 'correct' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, message: 'Server Error' });
	}
};
