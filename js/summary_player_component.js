
(function () {
"use strict";

	angular.module("coacher", []).component("summaryPlayer",{
		templateUrl: "js/summary_player_component.html",
		controller: SummaryPlayerController,
		bindings: { id: '<' }
	});

	SummaryPlayerController.$inject = ['Players'];
	// SummaryPlayerController.$inject = [];
	// function SummaryPlayerController() {
	function SummaryPlayerController(Players) {
		var $ctrl = this;

		$ctrl.player = Players.getById( $ctrl.id );

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