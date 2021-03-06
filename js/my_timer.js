(function () {
"use strict";

	angular.module('coacher').controller('gameTimer', gameTimer);
	gameTimer.$inject = ['$rootScope', '$timeout', 'Players', 'PlayersEventLog' ];
	function gameTimer( $rootScope, $timeout, Players, PlayersEventLog ) {
		var $ctrl = this;

		// Debugging code
		var debugging = true;
		function DebugConsoleLog(msg) { if ( debugging == true ) { console.log(msg); }}

		$ctrl.$onInit = function() {
			DebugConsoleLog('gameTimer.$onInit()');
			$ctrl.gameStatus = '1st Half Setup';
			$ctrl.gameLength = 25 * 60 * 1000;	// 25 minutes
			$ctrl.gameRemaining = $ctrl.gameLength;
			$ctrl.gameLengthMinutes = Math.floor( $ctrl.gameLength / 60000 );
			$ctrl.gameLengthSeconds = Math.floor(( $ctrl.gameLength / 1000 ) % 60 );
			$ctrl.gameTimeStart = null;

			$ctrl.timerStatus = 'off';
			$ctrl.playersBench = Players.getBench();
			$ctrl.playersForwards = Players.getForwards();
			$ctrl.playersMidfielders = Players.getMidfielders();
			$ctrl.playersDefenders = Players.getDefenders();
			$ctrl.playersGoalKeepers = Players.getGoalKeepers();
			$ctrl.players = Players.getPlayers();
			$ctrl.timeOfLastTick = null;
			$ctrl.prevClick = null;
			$('#removePlayers').modal();
		};

		$ctrl.removePlayer = function( id ) {
			Players.removePlayer( id );
			$ctrl.playersBench = Players.getBench();
		}

		$ctrl.onTimeout = function() {
			$ctrl.gameRemaining = $ctrl.gameLength - (($ctrl.gameTimeStart - new Date()) * -1);
			if ( $ctrl.gameRemaining < 0 ) { 
				$ctrl.gameRemaining = 0;
			}
			$ctrl.gameLengthMinutes = Math.floor( $ctrl.gameRemaining / 60000 );
			$ctrl.gameLengthSeconds = Math.floor(( $ctrl.gameRemaining / 1000 ) % 60 );
			if ( $ctrl.timeOfLastTick ) {
				var increment = Math.round(((( $ctrl.timeOfLastTick - new Date()) / 1000) % 60) * -1);
				Players.incrementTime( increment );
			}
			if ( $ctrl.gameStatus != '2nd Half Setup' ) {
				$ctrl.timeOfLastTick = new Date();
			}
			if ( $ctrl.timerStatus == 'on' ) {
				var mytimeout = $timeout($ctrl.onTimeout, 1000);
			}
		}

		function eventLogPos( array, msg, time ) {
			for ( var i = 0; i < array.length; i++ ) {
				PlayersEventLog.eventLogAdd( array[ i ].name, msg + ' ' + i, time );
			}
		}

		$ctrl.start = function() {
			$ctrl.timerStatus = 'on';
			if ( $ctrl.gameStatus == '1st Half Setup') {
				// We are starting the first half
				eventLogPos( $ctrl.playersBench, 'started 1st half on the bench', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersForwards, 'started 1st half at Forward', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersMidfielders, 'started 1st half at Midfield', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersDefenders, 'started 1st half at Defence', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersGoalKeepers, 'started 1st half as Goal Keeper', $ctrl.gameLength - $ctrl.gameRemaining );
				console.log( PlayersEventLog.getLog() );
				$ctrl.gameStatus = '1st Half';
				$ctrl.gameTimeStart = new Date();
				$ctrl.gameRemaining = $ctrl.gameLength;
			}
			if ( $ctrl.gameStatus == '2nd Half Setup') {
				eventLogPos( $ctrl.playersBench, 'ended 1st half on the bench', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersForwards, 'ended 1st half at Forward', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersMidfielders, 'ended 1st half at Midfield', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersDefenders, 'ended 1st half at Defence', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersGoalKeepers, 'ended 1st half as Goal Keeper', $ctrl.gameLength - $ctrl.gameRemaining );
				console.log( PlayersEventLog.getLog() );
				$ctrl.gameStatus = '2nd Half';
				$ctrl.gameTimeStart = new Date();
				$ctrl.gameRemaining = $ctrl.gameLength;
			}
			$timeout( $ctrl.onTimeout,1000 );
		}

		$ctrl.stop = function() {
			$ctrl.timerStatus = 'off';
		}

		$ctrl.timeTrackingClick = function( id ) {
			Players.toggleTimeTracking( id );
		}

		$ctrl.isTimeTracking = function( id ) {
			return Players.isTimeTracking( id );
		}

		$ctrl.end = function() {
			// Send all players to the bench
			if ( $ctrl.gameStatus == '1st Half' ) {
				$ctrl.modalMessage = 'Are you sure you want to end the 1st half?';
			} else {
				$ctrl.modalMessage = 'Are you sure you want to end the game?';
			}
			$('#endTimer').modal();
		}

		$ctrl.endPeriod = function() {
			$ctrl.timerStatus = 'off';
			// Let's put all the players on the bench
			Players.allToBench();
			// Let's reset the clocks
			if ( $ctrl.gameStatus == '1st Half' ) {
				// It is the end of the 1st half.  Let's set up for the 2nd half
				eventLogPos( $ctrl.playersBench, 'ended 1st half on the bench', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersForwards, 'ended 1st half at Forward', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersMidfielders, 'ended 1st half at Midfield', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersDefenders, 'ended 1st half at Defence', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersGoalKeepers, 'ended 1st half as Goal Keeper', $ctrl.gameLength - $ctrl.gameRemaining );
				console.log( PlayersEventLog.getLog() );
				$ctrl.gameStatus = '2nd Half Setup';
				$ctrl.gameRemaining = $ctrl.gameLength;
				$ctrl.timeOfLastTick = null;
			} else {
				// It is the end of the game
				eventLogPos( $ctrl.playersBench, 'ended the game on the bench', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersForwards, 'ended the game at Forward', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersMidfielders, 'ended the game at Midfield', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersDefenders, 'ended the game at Defence', $ctrl.gameLength - $ctrl.gameRemaining );
				eventLogPos( $ctrl.playersGoalKeepers, 'ended the game as Goal Keeper', $ctrl.gameLength - $ctrl.gameRemaining );
				console.log( PlayersEventLog.getLog() );
				$ctrl.gameStatus = 'Game Over';
				$ctrl.gameRemaining = 0;
				$ctrl.gameRemaining = 0;			
			}
			// Final step - refresh everyting
			$ctrl.playersBench = Players.getBench();
			$ctrl.playersForwards = Players.getForwards();
			$ctrl.playersMidfielders = Players.getMidfielders();
			$ctrl.playersDefenders = Players.getDefenders();
			$ctrl.playersGoalKeepers = Players.getGoalKeepers();
		}

		$ctrl.isButtonSelected = function( pos ) {
			return ( $ctrl.prevClick && $ctrl.prevClick[ 0 ].data == pos );
		}

		$ctrl.isPlayerSelected = function( id ) {
			return ( $ctrl.prevClick && $ctrl.prevClick[ 0 ].data.id == id );
		}

		$ctrl.addToPosition = function( pos ) {
			DebugConsoleLog( 'gameTimer.addToPosition( ' + pos + ')' );
			$ctrl.click({ type: 'button', data: pos });
		}

		$ctrl.click = function( ref ) {
			// DebugConsoleLog( 'gameTimer.click()' );
			if ( !$ctrl.prevClick ) {
				// There is no previous click registered
				$ctrl.prevClick = [];
				$ctrl.prevClick.push( ref );
			} else {
				// There is a previous click registered, we may need to perform an action
				if ( ref.type == 'button' ) {
					// The new click is a position button
					if ( $ctrl.prevClick[ 0 ].type == 'button' ) {
						// A new click is a position button, but so is the previous click, so do nothing
						$ctrl.prevClick = null;
					} else {
						// The new click is a position button, and the previous click was a player button, so move the player to the position
						if ( ref.data == 'ATT' ) { Players.movePlayerToForward( $ctrl.prevClick[ 0 ].data.id ); }
						if ( ref.data == 'MID' ) { Players.movePlayerToMidfield( $ctrl.prevClick[ 0 ].data.id ); }
						if ( ref.data == 'BEN' ) { Players.movePlayerToBench( $ctrl.prevClick[ 0 ].data.id ); }
						if ( ref.data == 'DEF' ) { Players.movePlayerToDefence( $ctrl.prevClick[ 0 ].data.id ); }
						if ( ref.data == 'GK' ) { Players.movePlayerToGoalKeeper( $ctrl.prevClick[ 0 ].data.id ); }
					}
					$ctrl.prevClick = null;
				} else {
					// A player button has just been clicked
					if ( $ctrl.prevClick[ 0 ].type == 'button' ) {
						// A position button, then a player button has been clicked, so move the Player into that position
						if ( $ctrl.prevClick[ 0 ].data == 'ATT' ) { Players.movePlayerToForward( ref.data.id ); }
						if ( $ctrl.prevClick[ 0 ].data == 'MID' ) { Players.movePlayerToMidfield( ref.data.id ); }
						if ( $ctrl.prevClick[ 0 ].data == 'BEN' ) { Players.movePlayerToBench( ref.data.id ); }						
						if ( $ctrl.prevClick[ 0 ].data == 'GK' ) { Players.movePlayerToGoalKeeper( ref.data.id ); }						
					} else {
						// A player, then a player button has been clicked, so swap the players positions
						Players.swapPlayers( $ctrl.prevClick[ 0 ].data.id, ref.data.id );
					}
				}
				$ctrl.prevClick = null;
			}
			// Final step - refresh everyting
			$ctrl.playersBench = Players.getBench();
			$ctrl.playersForwards = Players.getForwards();
			$ctrl.playersMidfielders = Players.getMidfielders();
			$ctrl.playersDefenders = Players.getDefenders();
			$ctrl.playersGoalKeepers = Players.getGoalKeepers();
		}

		$ctrl.playerClick = function( id ) {
			DebugConsoleLog( 'gameTimer.playerClick( ' + id + ' )');
			// Find the index of the player
			var i = 0;
			var playerClicked = Players.getById( id );
			// DebugConsoleLog.log(playerClicked);
			if ( !playerClicked ) {
				// If we do not find a match for the name, abandon This operation
				return
			} else {
				$ctrl.click( { type: 'player', data: playerClicked });
			}
		}

	}

})();