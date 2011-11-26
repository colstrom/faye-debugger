#!/usr/bin/env node

var argv = require('optimist')
	.usage('Usage: $0')
	.default({
		'host'		: 'localhost',
		'port'		: 8000,
		'location'	: '/faye'
	})
	.boolean('publish')
	.boolean('subscribe')
	.alias('host','h')
	.alias('port','p')
	.alias('location','l')
	.alias('channel','c')
	.alias('message','m')
	.alias('publish','P')
	.alias('subscribe','S')
	.demand('channel')
	.describe('host','Host to connect to')
	.describe('port','Port to connect on')
	.describe('location','Location of Faye (mountpoint)')
	.describe('channel','Channel to use')
	.describe('message','Message to publish')
	.describe('publish','[Boolean] Publish Mode')
	.describe('subscribe','[Boolean] Subscribe Mode')
	.argv;

if ( argv.publish && argv.subscribe ) {
	console.log('Modes are mutually exclusive.');
	process.exit('-1');
}

var Faye	= require('faye'),
	client	= new Faye.Client(
		'http://' + argv.host + ':' + argv.port + '/' + argv.location + '/'
	);

if ( argv.publish ) {
	client.publish(argv.channel, {
		text: argv.message
	});
} else if ( argv.subscribe ) {
	client.subscribe(argv.channel, function (message) {
		console.log('(#' + argv.channel + ') ' + message);
	})
} else {
	console.log('Please specify a mode.');
}
