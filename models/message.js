"use strict";

var fs = require("fs");
var uuid = require("uuid");
var path = require("path");
var dataFile = path.join(__dirname, "../data/messages.json");

exports.findAll = function (cb) {

	fs.readFile(dataFile, (err, data) => {
		if(err){
			return cb(err);
		}
		try {
			var messages = JSON.parse(data);
					console.log(messages);
		} catch(err) {
			return cb(err);
		}

		cb(null, messages);
	});
};

exports.create = function(message, cb) {
	if(!message.text || !message.handle) {
		return cb("Missing something!");
	}

	this.findAll( (err, messages) => {

		if(err) {
			return cb(err);
		}
		var newMessage = {
			handle: message.handle,
			text: message.text,
			id: uuid()
		};
		messages.push(newMessage);

		fs.writeFile(dataFile, JSON.stringify(messages), err => {
			cb(err);
		});
	});
};

exports.findById = function(id, cb) {
	if(!id){ return cb("Missing the id.")}

	this.findAll( (err, messages) => {
		if(err){
			return cb(err)
		}
		var message = messages.filter(message => message.id === id)[0];
		cb(null, message);
	});
};


exports.delete = function(id, cb) {
	if(!id){ return cb("Need message id.")}

	this.findAll( (err, messages) => {
		if(err){
			return cb(err)
		}
		var messages = messages.filter(message => message.id !== id);
		fs.writeFile(dataFile, JSON.stringify(messages), err => {
			cb(err);
		});

	});
};


exports.edit = function(req, cb) {
	
	var id = req.params.id;
	if(!id){ return cb("Message is missing")}

	this.findAll( (err, messages) => {

		if(err){
			return cb(err)
		}
		
		var messages = messages.filter(message =>
			message.id !== id);

		var editedMsg = {
			text: req.body.text,
			handle: req.body.handle,
			id: id
		};
		
		messages.push(editedMsg);
		
		fs.writeFile(dataFile, JSON.stringify(messages), err => {
				cb(err);
		});
	});
};























