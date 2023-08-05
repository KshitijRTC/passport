const express = require('express');
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");




app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: "long secret key",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(
'mongodb+srv://kshitijupmanyu101:Kshitij_01@cluster0.tiqebv1.mongodb.net/?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
	email: String,
	password: String
});


userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {

	if (req.isAuthenticated()) {

		res.send(
"You have already logged in. No need to login again");
	}

	else {

		res.sendFile(__dirname + "/Index.html");
	}
})


app.get("/login", (req, res) => {
	if (req.isAuthenticated()) {

		res.send(
"You have already logged in. No need to login again");
	}
	else {

		res.sendFile(__dirname + "/login.html");
	}
})

app.post("/register",  (req, res) => {
	console.log(req.body);
	var email = req.body.username;
	var password = req.body.password;
	User.register({ username: email },
		req.body.password, (err, user) => {
			if (err) {
				console.log(err);
			}
			else {
				passport.authenticate("local")
				(req, res, () => {
					res.send("successfully saved!");
				})
			}
		})
})

app.post("/login",  (req, res) => {
	console.log(req.body);

	const userToBeChecked = new User({
		username: req.body.username,
		password: req.body.password
	});

	req.login(userToBeChecked,  (err) => {
		if (err) {
			console.log(err);
			res.redirect("/login");
		}
		else {
			passport.authenticate("local")
				(req, res, () => {
				User.find({ email: req.user.username },
					 (err, docs) => {
					if (err) {
						console.log(err);
					}
					else {

					console.log("credentials are correct");
					res.send("login successful");
						}
					});
			});
		}
	})
})

app.listen(3000, function () {
	console.log("server started successfully");
})
