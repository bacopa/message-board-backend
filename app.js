"use strict";

const PORT = process.env.PORT || 3000;

var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var uuid = require("uuid");

var Message = require("./models/message");

var app = express();

app.set("view engine", "jade");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( express.static("public") );

app.route("/messages")
	.get( (req, res, next) => {
		Message.findAll( (err, messages) => {
			if(err) {
				return res.status(400).send(err)
			}
			console.log(messages);
			res.render("index", { messages: messages });

		})
	})
	.post( (req, res, next) => {
		Message.create(req.body, err => {
			Message.findAll( (err, messages) => {
				if(err) {
					return res.status(400).send(err);
				}
				res.send(messages);
			})
		});
	});

app.route("/messages/:id")
	.get( (req, res, next) => {

		var id = req.params.id;

		Message.findById( id, (err, message) => {
			if(err){
				return res.status(400).send(err);
			}
			res.send(message);
		})
	})
	.delete( (req, res, next) => {

		var id = req.params.id;

		Message.delete( id, (err, message) => {
			if(err){
				return res.status(400).send(err)
			}
			Message.findAll( (err, messages) => {
				if(err) {
					return res.status(400).send(err);
				}
				res.send(messages);
			})
		})
	})
	.put( (req, res, next) => {

		Message.edit( req, (err, message) => {
			if(err){
				return res.status(400).send(err)
			}
			Message.findAll( (err, messages) => {
				if(err) {
					return res.status(400).send(err);
				}
				res.send(messages);
			});
		});
	});

app.get("/", (req, res, next) => {
	res.render("index", { text: "adding text from app.js"});
});

// 404 handler
app.use((req,res, next) => {
	res.status(404).send("Not Found");
})

//create server, listen to PORT
app.listen(PORT, err => { 
	console.log(err || `Server listening on port ${PORT}`);
});