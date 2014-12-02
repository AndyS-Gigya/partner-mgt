'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var partners = require('../../app/controllers/partners.server.controller');

	// Partners Routes
	app.route('/partners')
		.get(partners.list)
		.post(users.requiresLogin, partners.create);

	app.route('/partners/:partnerId')
		.get(partners.read)
		.put(users.requiresLogin, partners.hasAuthorization, partners.update)
		.delete(users.requiresLogin, partners.hasAuthorization, partners.delete);

	app.route('/partners/:partnerId/logo')
		.get(partners.logo)
		.put(users.requiresLogin, partners.hasAuthorization, partners.upload);

	// Finish by binding the Partner middleware
	app.param('partnerId', partners.partnerByID);
};
