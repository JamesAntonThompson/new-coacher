(function () {
'use strict';

	angular.module('coacher').service('PlayersEventLog', PlayersEventLog);

	// PlayersEventLog.$inject = ['Players'];
	function PlayersEventLog() {
		var service = this;

		var eventLog = [];


		service.eventLogAdd = function( name, event, time ) {
			eventLog.push( { name: name, event: event, time: time });
		}

		service.getLog = function() {
			return eventLog;			
			// for (var i = 0; i < eventLog.length; i++ ) {
				// console.log( eventLog[ i ]);
			// }
		}

		service.getPlayerLog = function( name ) {
			var result = [];
			for ( var i = 0; i < eventLog.length; i++ ){
				if ( eventLog[ i ].name == name ) {
					result.push( eventLog[ i ]);
				}
			}
			return result;
		}
	}
})();