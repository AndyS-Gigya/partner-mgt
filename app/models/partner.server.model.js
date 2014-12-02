'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	validators = require('mongoose-validators');

/**
 * Partner Schema
 */
var PartnerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please list the company name',
		trim: true
	},

	type: {
		type: String,
		default: '',
		enum: ['NEXUS', 'Agency', 'Solution Provider'],
		required: true,
		trim: true
	},

	logo: {
		type: String,
		description: 'Filename'
	},

	/* content script */
	overview: {
		type: String,
		description: 'Overview of the Parter\'s Product',
	},
	valueAdd: {
		type: String,
		description: 'How does Gigya add value?'
		
	},
	implementation: {
		type: String,
		description: 'One- or two-paragraph description of implementation/integration details'
	},
	developerPageURL: {
		type: String,
		trim: true,
		validate: [ validators.isURL() ]
	},


	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Partner', PartnerSchema);