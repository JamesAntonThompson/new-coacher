(function () {
"use strict";

	angular.module('coacher').controller('gameTimer', gameTimer);
	gameTimer.$inject = ['$rootScope', '$timeout'];
	function gameTimer( $rootScope, $timeout ) {
		var $ctrl = this;

		// Debugging code
		var debugging = true;
		function DebugConsoleLog(msg) { if ( debugging == true ) { console.log(msg); }}

		$ctrl.$onInit = function() {
			DebugConsoleLog('gameTimer.$onInit()');
			$ctrl.gameHalf = 1;					// Starts with the first half
			$ctrl.gameLength = 5 * 60 * 1000;	// 25 minutes
			$ctrl.gameRemaining = $ctrl.gameLength;
			$ctrl.gameLengthMinutes = Math.floor( $ctrl.gameLength / 60000 );
			$ctrl.gameLengthSeconds = Math.floor(( $ctrl.gameLength / 1000 ) % 60 );
			$ctrl.gameTimeStart = new Date();
			$ctrl.timerStatus = 'off';

			$ctrl.teamList = [{ name: 'Elvie', pos: 'ATT', rml: 3, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Sienna', pos: 'ATT', rml: 2, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Jess', pos: 'ATT', rml: 1,  selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Louise', pos: 'MID', rml: 1, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Milla', pos: 'MID', rml: 2, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Grace', pos: 'BEN', rml: 1, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Maddie', pos: 'DEF', rml: 2, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Sadie', pos: 'DEF', rml: 3, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Daisy', pos: 'DEF', rml: 1, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Scarlett', pos: 'BEN', rml: 0, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Gabby', pos: 'GK', rml: 1, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Clara', pos: 'BEN', rml: 0, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
							  { name: 'Kate', pos: 'BEN', rml: 0, selected: false, tgt: 0, cgt: 0, tbt: 0, cbt: 0 }];
			for ( var i; i < $ctrl.teamList.length; i++ ) {
				$ctrl.teamList[i].id = i;
				$ctrl.teamList[i].selected = false;
				$ctrl.teamList[i].tgt = 0;
				$ctrl.teamList[i].tgtDisplay = $ctrl.displayTime( $ctrl.teamlist[i].tgt );
				$ctrl.teamList[i].cgt = 0;
				$ctrl.teamList[i].cgtDisplay = $ctrl.displayTime( $ctrl.teamlist[i].cgt );
				$ctrl.teamList[i].cbt = 0;
				$ctrl.teamList[i].cbtDisplay = $ctrl.displayTime( $ctrl.teamlist[i].cbt );
				$ctrl.teamList[i].tbt = 0;
				$ctrl.teamList[i].tgtDisplay = $ctrl.displayTime( $ctrl.teamlist[i].tbt );
			}
		};

		$ctrl.onTimeout = function() {
			var timeRemaining = $ctrl.gameLength - (($ctrl.gameTimeStart - new Date()) * -1);
			$ctrl.gameRemaining = $ctrl.gameLength - (($ctrl.gameTimeStart - new Date()) * -1);
			$ctrl.gameLengthMinutes = Math.floor( timeRemaining / 60000 );
			$ctrl.gameLengthSeconds = Math.floor(( timeRemaining / 1000 ) % 60 );
			for ( var i = 0; i < $ctrl.teamList.length; i++ ) {
				if ( $ctrl.teamList[i].pos == 'BEN' ) {  // The player is on the bench
					$ctrl.teamList[i].tbt += 1;
					$ctrl.teamList[i].cbt += 1;
				} else {
					$ctrl.teamList[i].cgt += 1;
					$ctrl.teamList[i].tgt += 1;
				}
				$ctrl.teamList[i].cgtDisplay = $ctrl.displayTime( $ctrl.teamList[i].cgt );
				$ctrl.teamList[i].tgtDisplay = $ctrl.displayTime( $ctrl.teamList[i].tgt );
				$ctrl.teamList[i].cbtDisplay = $ctrl.displayTime( $ctrl.teamList[i].cbt );
				$ctrl.teamList[i].tbtDisplay = $ctrl.displayTime( $ctrl.teamList[i].tbt );
			}
			if ( $ctrl.timerStatus == 'on' ) {
				var mytimeout = $timeout($ctrl.onTimeout, 1000);
			}
		}

		$ctrl.start = function() {
			$timeout($ctrl.onTimeout,1000);
			$ctrl.timerStatus = 'on';
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
			console.log('here');
			$ctrl.timerStatus = 'off';
			// Let's put all the players on the bench
			for ( var i = 0; i < $ctrl.teamList.length; i++ ) {
				if ( $ctrl.teamList[ i ].pos != 'BEN' ) {
					$ctrl.teamList[ i ].pos = 'BEN';
					$ctrl.teamList[ i ].cbt = 0;
					$ctrl.teamList[ i ].cgt = 0;
				}
			}
			// Let's reset the clocks
			if ( $ctrl.gameHalf == 1 ) {
				// It is the end of the 1st half.  Let's set up for the 2nd half
				$ctrl.gameHalf = 2;
				$ctrl.gameRemaining = $ctrl.gameLength;
			} else {
				// It is the end of the game
				$ctrl.gameRemaining = 0;				
			}
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

    	$ctrl.playerClick = function( name ) {
    		// console.log( name );
    		// Find the index of the player
    		var i = 0;
    		while ( $ctrl.teamList[ i ].name != name ) {
    			i++;
    		}
    		// console.log( name + ':' + i );
    		if ( $ctrl.teamList[ i ].selected == true ) {
    			// We are are unselecting a previously selected player
    			$ctrl.teamList[ i ].selected = false;
			} else {
				$ctrl.teamList[ i ].selected = true;
			}
    		// Now check to see who else is selected and action
    		var swapIndex = -1;
    		for ( var j = 0; j < $ctrl.teamList.length; j++ ) {
    			if ( j != i && $ctrl.teamList[ j ].selected == true ) {
    				swapIndex = j;
    			}
    		}
    		// console.log('swapIndex:' + swapIndex);
    		if ( swapIndex != -1 ) {
				// We have found another selected player. Let's swap them
				var tmp_pos = $ctrl.teamList[ i ].pos;
				var tmp_rml = $ctrl.teamList[ i ].rml;
				$ctrl.teamList[ i ].pos = $ctrl.teamList[swapIndex].pos;
				$ctrl.teamList[ i ].rml = $ctrl.teamList[swapIndex].rml;
				$ctrl.teamList[ i ].selected = false;
				$ctrl.teamList[swapIndex].pos = tmp_pos;
				$ctrl.teamList[swapIndex].rml = tmp_rml;
				$ctrl.teamList[swapIndex].selected = false;

				console.log( $ctrl.teamList[ i ].name + ':' + $ctrl.teamList[ i ].pos );
				console.log( $ctrl.teamList[ swapIndex ].name + ':' + $ctrl.teamList[ swapIndex ].pos );
				// Now, depending on the type of the swap, reset timers
				if ( $ctrl.teamList[ i ].pos == $ctrl.teamList[swapIndex].pos ) {
					// the two players are swapping within the same position, change nothing
					console.log('the two players are swapping within the same position, change nothing');
				} else {
					if ( $ctrl.teamList[ i ].pos == 'BEN') {
						// This player is going to the bench
						console.log( $ctrl.teamList[ i ].name + ' is going to the bench')
						$ctrl.teamList[ i ].cgt = 0;
						$ctrl.teamList[ i ].cbt = 0;
					} else {
						if ( $ctrl.teamList[ swapIndex ].pos == 'BEN' ) {
							// This player has come off the bench
							console.log( $ctrl.teamList[ i ].name + ' is coming off the bench');
							$ctrl.teamList[ i ].cgt = 0;
							$ctrl.teamList[ i ].cbt = 0;
						} else {
							// This player is staying on the field and swapping to another position, change nothing
							console.log( $ctrl.teamList[ i ].name + ' is staying on the field and swapping to another position, change nothing');
						}
					}
					if ( $ctrl.teamList[ swapIndex ].pos == 'BEN') {
						// This player is going to the bench
						console.log( $ctrl.teamList[ swapIndex ].name + ' is going to the bench')
						$ctrl.teamList[ swapIndex ].cgt = 0;
						$ctrl.teamList[ swapIndex ].cbt = 0;
					} else {
						if ( $ctrl.teamList[ i ].pos == 'BEN' ) {
							// This player has come off the bench
							console.log( $ctrl.teamList[ swapIndex ].name + ' is coming off the bench');
							$ctrl.teamList[ swapIndex ].cgt = 0;
							$ctrl.teamList[ swapIndex ].cbt = 0;
						} else {
							// This player is staying on the field and swapping to another position, change nothing
							console.log( $ctrl.teamList[ swapIndex ].name + ' is staying on the field and swapping to another position, change nothing');
						}
					}						
				}
			}
		}
	}

})();