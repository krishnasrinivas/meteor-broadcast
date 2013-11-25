/*
 * Copyright (c) 2013 Krishna Srinivas
 * MIT License
 */

Meteor.Broadcast = function() {
	EventEmitter.call(this);
	var streamName = '_meteor_peerbroadcast_';
	var methods = {};
	var peerbroadcastserver = this;

	Meteor.publish(streamName, function (sharecode, clientid) {
		var self = this;

		var pushData = function (_clientid, data) {
			if (_clientid === clientid) {
				return;
			}
			var id = Random.id();
			self.added (streamName, id, data);
		};

		peerbroadcastserver.on(sharecode, pushData);

		this.onStop(function () {
			peerbroadcastserver.off(sharecode, pushData);
		});

		this.ready();
	});

	methods[streamName] = function (sharecode, _clientid, data) {
		peerbroadcastserver.emit(sharecode, _clientid, data);
	}

	Meteor.methods (methods);
}

util.inherits(Meteor.Broadcast, EventEmitter);
