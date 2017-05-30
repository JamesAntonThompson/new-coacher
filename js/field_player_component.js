
(function () {
"use strict";

	angular.module("coacher", []).component("fieldPlayer",{
		templateUrl: "js/field_player_component.html",
		controller: FieldPlayerController,
		bindings: { pos: '@', id: '<' }
	});

  	FieldPlayerController.$inject = ['Players'];
	function FieldPlayerController(Players) {
		var $ctrl = this;

		$ctrl.player = Players.getById( $ctrl.id );

		$ctrl.isLongestInPos = function() {
			if ( $ctrl.pos == 'ATT' ) { return Players.isLongestForward( $ctrl.id ); }
			if ( $ctrl.pos == 'BEN' ) { return Players.isLongestOnBench( $ctrl.id ); }
			if ( $ctrl.pos == 'MID' ) { return Players.isLongestMidfield( $ctrl.id ); }
			if ( $ctrl.pos == 'DEF' ) { return Players.isLongestDefender( $ctrl.id ); }
			return false;
		}

		$ctrl.isShortestPlayingTimeInPos = function() {
			if ( $ctrl.pos == 'ATT' ) { return Players.isShortestPlayingTimeForward( $ctrl.id ); }
			if ( $ctrl.pos == 'BEN' ) { return Players.isShortestPlayingTimeBench( $ctrl.id ); }
			if ( $ctrl.pos == 'MID' ) { return Players.isShortestPlayingTimeMidfield( $ctrl.id ); }
			if ( $ctrl.pos == 'DEF' ) { return Players.isShortestPlayingTimeDefender( $ctrl.id ); }
			return false;
		}

    	$ctrl.displayTime = function( time ) {
    		return displayMinutes(time) + ':' + displaySeconds(time);
    	}

		var displaySeconds = function( time ) {
			var seconds = Math.floor( time % 60 );
			if ( seconds < 10 ) {
				return '0' + seconds.toString();
			} else {
				return seconds.toString();
			}
		}

		var displayMinutes = function( time ) {
			var minutes = Math.floor( time / 60 );
			if ( minutes < 10 ) {
				return '0' + minutes.toString();
			} else {
				return minutes.toString();
			}
		}

	}	// end of function LocationSearchController()

})();