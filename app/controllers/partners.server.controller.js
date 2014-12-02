'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Partner = mongoose.model('Partner'),
	_ = require('lodash'),
	fs  = require('fs'),
	mkdirp = require('mkdirp'),
	path = require('path');
var util = require('util');

/**
 * Create a Partner
 */
exports.create = function(req, res) {
	var partner = new Partner(req.body);
	partner.user = req.user;

	partner.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

/**
 * Show the current Partner
 */
exports.read = function(req, res) {
	res.jsonp(req.partner);
};




/**
 * Update a Partner
 */
exports.update = function(req, res) {
	var partner = req.partner ;

	partner = _.extend(partner , req.body);
	
	partner.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
}


function logoPath(partner, logo, root) {
	root = root || path.join(__dirname, '../../public');
	var filename = logo || partner.logo || 'logo.png';
	var logoPath = path.join(root, 'uploads/partners', partner.id, filename );
	return logoPath;

}

/**
 * Show the current Partner's logo
 */
exports.logo = function(req, res) {
	if (!req.partner.logo) {
		res.status(404).end();
	} else {
		var path = logoPath(req.partner)
		res.sendFile(path);
	}
};


function moveFile(from, to, callback) {
	fs.readFile(from, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		mkdirp(path.dirname(to), function(err) {
			if (err) {
				callback(err)
				return;
			}
	
  			fs.writeFile(to, data, function (err) {
  				callback(err);
    		});
  		});
    });
}


/**
 * Update a Partner Logo
 */
exports.upload = function(req, res) {
	var partner = req.partner;

	console.log(util.inspect(req.files));

	var from = req.files.file.path;
	var to = logoPath(partner, req.files.file.name);

	moveFile(from, to, uploaded);

	function uploaded(err) {
		if (err) {
			console.log("uploaded", "err:", util.inspect(err));
		
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			partner.logo = path.basename(to);
			
			partner.save(function(err) {
				if (err) {
					console.log("uploaded, partner.save", "err:", util.inspect(err));
		
					res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(partner);
				}
			});
		}
	}
};

/**
 * Delete an Partner
 */
exports.delete = function(req, res) {
	var partner = req.partner ;

	partner.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

/**
 * List of Partners
 */
exports.list = function(req, res) { 
	Partner.find().sort('-created').populate('user', 'displayName').exec(function(err, partners) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partners);
		}
	});
};

/**
 * Partner middleware
 */
exports.partnerByID = function(req, res, next, id) { 
	Partner.findById(id).populate('user', 'displayName').exec(function(err, partner) {
		if (err) return next(err);
		if (! partner) return next(new Error('Failed to load Partner ' + id));
		req.partner = partner;
		
		next();
	});
};

/**
 * Partner authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.partner.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
