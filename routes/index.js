const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Game = require('../models/game');
const { createGame } = require('../controller/index');

router.get('/register', function (req, res, next) {
	return res.render('index.ejs');
});

router.post('/register', async function (req, res, next) {
	// console.log(req.body);
	let personInfo = req.body;

	try {
		if (
			!personInfo.email ||
			!personInfo.username ||
			!personInfo.password ||
			!personInfo.firstname ||
			!personInfo.lastname ||
			!personInfo.passwordConf
		) {
			res.redirect('/register');
		} else {
			if (personInfo.password == personInfo.passwordConf) {
				let user = await User.findOne({ email: personInfo.email });
				console.log(user);
				if (user != undefined) return res.redirect('/login');

				let newPerson = new User({
					email: personInfo.email,
					username: personInfo.username,
					password: personInfo.password,
					passwordConf: personInfo.passwordConf,
				});

				await newPerson.save();

				res.redirect('/login');
			} else {
				res.send({ Success: 'password is not matched' });
			}
		}
	} catch (error) {
		res.redirect('/register');
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', async function (req, res, next) {
	//console.log(req.body);
	let user = await User.findOne({ email: req.body.email });
	if (user != null) {
		if ((user.password = req.body.password)) {
			//console.log("Done Login");
			req.session.userId = user.unique_id;

			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	}
});

router.get('/', function (req, res, next) {
	console.log('profile');
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log('data');
		console.log(data);
		if (!data) {
			res.redirect('/login');
		} else {
			//console.log("found");
			return res.render('odd.ejs', { vendor: req.session.userId });
		}
	});
});

router.post('/game/create', createGame);
// router.post('/game/create', createGame);

router.get('/play/:id', async function (req, res, next) {
	console.log('e');
	console.log('profile');
	User.findOne({ unique_id: req.session.userId }, async function (err, data) {
		console.log('data');
		console.log(data);
		if (!data) {
			res.redirect('/login');
		} else {
			let game = await Game.findOne({ unique_id: req.params.id });
			console.log(game);
			res.render('play.ejs', { number: game.number });
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log('logout');
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/login');
			}
		});
	}
});

router.get('/forgetpass', function (req, res, next) {
	res.render('forget.ejs');
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ Success: 'This Email Is not regestered!' });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save(function (err, Person) {
					if (err) console.log(err);
					else console.log('Success');
					res.send({ Success: 'Password changed!' });
				});
			} else {
				res.send({
					Success: 'Password does not matched! Both Password should be same.',
				});
			}
		}
	});
});

module.exports = router;
