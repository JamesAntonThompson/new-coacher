(function () {
"use strict";

	angular.module('coacher').controller('gameTimer', gameTimer);
	gameTimer.$inject = ['$rootScope', '$timeout', 'Players'];
	function gameTimer( $rootScope, $timeout, Players ) {
		var $ctrl = this;

		// Debugging code
		var debugging = true;
		function DebugConsoleLog(msg) { if ( debugging == true ) { console.log(msg); }}

		$ctrl.$onInit = function() {
			DebugConsoleLog('gameTimer.$onInit()');
			$ctrl.gameStatus = '1st Half Setup';
			$ctrl.gameLength = 1 * 60 * 1000;	// 25 minutes
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
			$ctrl.timeOfLastTick = null;
			
			$ctrl.prevClick = null;
		};

		$ctrl.onTimeout = function() {
			// var timeRemaining = $ctrl.gameLength - (($ctrl.gameTimeStart - new Date()) * -1);
			$ctrl.gameRemaining = $ctrl.gameLength - (($ctrl.gameTimeStart - new Date()) * -1);
			if ( $ctrl.gameRemaining < 0 ) { $ctrl.gameRemaining = 0; }
			// console.log( $ctrl.gameRemaining );
			$ctrl.gameLengthMinutes = Math.floor( $ctrl.gameRemaining / 60000 );
			$ctrl.gameLengthSeconds = Math.floor(( $ctrl.gameRemaining / 1000 ) % 60 );
			if ( $ctrl.timeOfLastTick ) {
				var increment = Math.round(((( $ctrl.timeOfLastTick - new Date()) / 1000) % 60) * -1);
				// DebugConsoleLog( 'Increment: ' + increment );
				Players.incrementTime( increment );
			}
			$ctrl.timeOfLastTick = new Date();
			if ( $ctrl.timerStatus == 'on' ) {
				var mytimeout = $timeout($ctrl.onTimeout, 1000);
			}
		}

		$ctrl.start = function() {
			$ctrl.timerStatus = 'on';
			if ( $ctrl.gameStatus == '1st Half Setup') {
				console.log( 'here');
				$ctrl.gameStatus = '1st Half';
				$ctrl.gameTimeStart = new Date();
				DebugConsoleLog( $ctrl.gameTimeStart );
				$ctrl.gameRemaining = $ctrl.gameLength;
			}
			if ( $ctrl.gameStatus == '2nd Half Setup') {
				$ctrl.gameStatus = '2nd Half';
				$ctrl.gameTimeStart = new Date();
				$ctrl.gameRemaining = $ctrl.gameLength;
			}
			$timeout( $ctrl.onTimeout,1000 );
		}

		$ctrl.stop = function() {
			$ctrl.timerStatus = 'off';
		}

    	$ctrl.displayTime = function( time ) {
    		return displayMinutes(time) + ':' + displaySeconds(time);
    	}
    	
		$ctrl.end = function() {
			// Send all players to the bench
			if ( $ctrl.gameHalf == 1 ) {
				$ctrl.modalMessage = 'Are you sure you want to end the 1st half?';
			} else {
				$ctrl.modalMessage = 'Are you sure you want to end the game?';
			}
			$('#endTimer').modal();
		}

		$ctrl.endPeriod = function() {
			// console.log('here');
			$ctrl.timerStatus = 'off';
			// Let's put all the players on the bench
			Players.allToBench();
			// Let's reset the clocks
			if ( $ctrl.gameStatus == '1st Half' ) {
				// It is the end of the 1st half.  Let's set up for the 2nd half
				$ctrl.gameStatus = '2nd Half Setup';
				// $ctrl.gameHalf = 2;
				$ctrl.gameRemaining = $ctrl.gameLength;
			} else {
				// It is the end of the game
				$ctrl.gameStatus = 'Game Over';
				$ctrl.gameRemaining = 0;				
			}
			// Final step - refresh everyting
			$ctrl.playersBench = Players.getBench();
			$ctrl.playersForwards = Players.getForwards();
			$ctrl.playersMidfielders = Players.getMidfielders();
			$ctrl.playersDefenders = Players.getDefenders();
			$ctrl.playersGoalKeepers = Players.getGoalKeepers();
		}

		var displaySeconds = function( time ) {
			var seconds = Math.floor( time % 60 );
			// var result = -1
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

		$ctrl.isPlayerSelected = function( id ) {
			// console.log( id );
			if ( $ctrl.prevClick && $ctrl.prevClick[ 0 ].data.id == id ) { 
				return true;
			} else {
				return false;
			}
		}

		$ctrl.addForwardClick = function() {
			DebugConsoleLog( 'gameTimer.addForwardClick()' );
			$ctrl.click({ type: 'button', data: 'ATT' });
		}


		$ctrl.addMidfielderClick = function() {
			DebugConsoleLog( 'gameTimer.addMidfielderClick()' );
			$ctrl.click({ type: 'button', data: 'MID' });
		}

		$ctrl.addDefenderClick = function() {
			DebugConsoleLog( 'gameTimer.addDefenderClick()' );
			$ctrl.click({ type: 'button', data: 'DEF' });			
		}

		$ctrl.addGoalKeeperClick = function() {
			DebugConsoleLog( 'gameTimer.addGoalKeeperClick()' );
			$ctrl.click({ type: 'button', data: 'GK' });			
		}

		$ctrl.isLongestInPos = function( id, pos ) {
			if ( pos == 'ATT' ) { return Players.isLongestForward( id ); }
			if ( pos == 'BEN' ) { return Players.isLongestOnBench( id ); }
			if ( pos == 'MID' ) { return Players.isLongestMidfield( id ); }
			if ( pos == 'DEF' ) { return Players.isLongestDefender( id ); }
		}

		$ctrl.click = function( ref ) {
			DebugConsoleLog( 'gameTimer.click()' );
			if ( !$ctrl.prevClick ) {
				// There is no previous click registered
				console.log('there is no previous click');
				$ctrl.prevClick = [];
				$ctrl.prevClick.push( ref );
			} else {
				// There is a previous click registered, we may need to perform an action
				if ( ref.type == 'button' ) {
					// The new click is a position button
					if ( $ctrl.prevClick[ 0 ].type == 'button' ) {
						// A new click is a position button, but so is the previous click, so do nothing
						// console.log( 'here 2');
						$ctrl.prevClick = null;
					} else {
						// The new click is a position button, and the previous click was a player button, so move the player to the position
						// console.log('here');
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