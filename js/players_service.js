(function () {
'use strict';

	angular.module('coacher').service('Players', Players);

	// SetiAPI.$inject = ['$http'];
	function Players() {
		var service = this;

		// debugging switch
		var runTests = false;
		var debugging = false;
		function DebugConsoleLog(msg) { if ( debugging == true ) { console.log(msg); }}


		DebugConsoleLog('Players()');

		var teamList = [];

		
		DebugConsoleLog('Players().$onInit()');
		teamList = [{ id: 1, name: 'Elvie', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 2, name: 'Sienna', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 3, name: 'Jess', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
				 	{ id: 4, name: 'Louise', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 5, name: 'Milla', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 6, name: 'Grace', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 7, name: 'Maddie', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 8, name: 'Sadie', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 9, name: 'Daisy', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 10, name: 'Scarlett', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 11, name: 'Gabby', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 12, name: 'Clara', tgt: 0, cgt: 0, tbt: 0, cbt: 0 },
					{ id: 13, name: 'Kate', tgt: 0, cgt: 0, tbt: 0, cbt: 0 }];

		service.positionForwardList = [];
		service.positionBenchList = [];
		service.positionMidList = [];
		service.positionDefenceList = [];
		service.positionGoalKeeperList = [];

		// Forwards functions
		function addToForward( id ) {
			DebugConsoleLog( 'Players.addToForward()');
			service.positionForwardList.push( id );
		}

		service.swapForwards = function( id1, id2 ) {
			var id1_index = service.positionForwardList.indexOf( id1 );
			var id2_index = service.positionForwardList.indexOf( id2 );
			if ( id1_index && id2_index ) {
				service.positionForwardList[ id1_index ] = id2;
				service.positionForwardList[ id2_index ] = id1;
			}
		}

		function removeFromForwards( id ) {
			DebugConsoleLog( 'Players.removeFromForwards( ' + id + ' )');
			var id_index = service.positionForwardList.indexOf( id );
			if ( id_index != -1 ) {
				if ( id_index == 0 ) {
					service.positionForwardList.shift();
				} else { 
					service.positionForwardList.splice( id_index, 1 );
				}
			}
		}

		service.getForwards = function() {
			// DebugConsoleLog('Players.getForwards()');
			var result = [];
			var len = service.positionForwardList.length;
			var j = 0;
			for ( var i = 0; i < len; i++ ) {
				j = 0;
				while ( j < teamList.length && teamList[ j ].id != service.positionForwardList[ i ]) { j++; }
				if ( j >= teamList.length ) { 
					return [];			// Abort, something went wrong
				} else {
					result.push(teamList[ j ]);
				}
			}
			return result;
		}

		function isForward( id ) {
			// console.log( )
			return ( indexForward( id ) != -1 );
		}

		function indexForward( id ) {
			return service.positionForwardList.indexOf( id );
		}

		service.isLongestForward = function( id ) {
			var result = true;
			var player = service.getById( id );
			if ( player ) {
				for ( var i = 0; i < service.positionForwardList.length; i++ ) {
					var comp = service.getById( service.positionForwardList[ i ]);
					if ( comp.cgt > player.cgt ) {
						return false;
					}
				}
			} else {
				// Something went wrong
				result = false;
			}
			return result;
		}


		///////////////////////////////////////////////// Bench functions
		function addToBench( id ) {
			DebugConsoleLog( 'Players.addToBench()');	
			service.positionBenchList.push( id );
		}

		function removeFromBench( id ) {
			DebugConsoleLog( 'Players.removeFromBench( ' + id + ' )');
			var id_index = service.positionBenchList.indexOf( id );
			if ( id_index != -1 ) {
				if ( id_index == 0 ) {
					service.positionBenchList.shift();
				} else { 
					service.positionBenchList.splice( id_index, 1 );
				}
			}
		}

		service.getBench = function() {
			// DebugConsoleLog( 'Players.getBench()');
			// sort the bench first
			if ( service.positionBenchList ) {
				// console.log( 'sorting the bench');
				// service.positionBenchList.sort( function(a, b) { 
					// console.log( a + ',' + b );
					// return teamList[ a ].cbt - teamList[ b ].cbt; } );
				// service.positionBenchList.sort( function(a, b) { 
					// return ( teamList[ a-1 ].cbt > teamList[ b-1 ].cbt );
					// console.log( a + ',' + b );
					// console.log( teamList[ a ].id );
					// console.log( teamList[ a ].id );

				// });//teamList[ a ].cbt > teamList[ b ].cbt; } )
			}
			// Now let's get it
			var result = [];
			var len = service.positionBenchList.length;
			var j = 0;
			for ( var i = 0; i < len; i++ ) {
				// console.log( 'looking for: ' + service.positionBenchList[ i ]);
				j = 0;
				while ( j < teamList.length && teamList[ j ].id != service.positionBenchList[ i ]) { j++; }
				if ( j >= teamList.length ) { 
					return [];			// Abort, something went wrong
				} else {
					// console.log( 'found ');
					result.push(teamList[ j ]);
				}
			}
			return result;
		}

		service.allToBench = function() {
			DebugConsoleLog( 'Players.allToBench()');
			// Add everyone to the bench
			service.positionBenchList = [];
			for ( var i = 0; i < teamList.length; i++ ) {
				if ( !isOnBench( teamList[ i ].id )) {
					// The player is not already on the bench
					teamList[i].cgt = 0;
					teamList[i].cbt = 0;
					service.positionBenchList.push( teamList[ i ].id );
				}
			}
			// clear the other positions
			service.positionForwardList = [];
			service.positionMidList = [];
			service.positionDefenceList = [];
			service.positionGoalKeeperList = [];
		}

		function isOnBench( id ) {
			var i = 0;
			while ( i < service.positionBenchList.length && service.positionBenchList[ i ] != id ) { i++; }
			return ( i < service.positionBenchList.length );
		}

		function indexBench( id ) {
			return service.positionBenchList.indexOf( id );
		}

		service.isLongestOnBench = function( id ) {
			var result = true;
			var player = service.getById( id );
			if ( player ) {
				for ( var i = 0; i < service.positionBenchList.length; i++ ) {
					var comp = service.getById( service.positionBenchList[ i ]);
					if ( comp.cbt > player.cbt ) {
						return false;
					}
				}
			} else {
				// Something went wrong
				result = false;
			}
			return result;
		}

		////////////////////////////////////////// MIDFIELD FUNCTIONS
		function addToMidfield( id ) {
			DebugConsoleLog( 'Players.addToMidfield()');
			service.positionMidList.push( id );
		}

		service.swapMidfielders = function( id1, id2 ) {
			var id1_index = service.positionMidList.indexOf( id1 );
			var id2_index = service.positionMidList.indexOf( id2 );
			if ( id1_index && id2_index ) {
				service.positionMidList[ id1_index ] = id2;
				service.positionMidList[ id2_index ] = id1;
			}
		}

		function removeFromMidfield( id ) {
			DebugConsoleLog( 'Players.removeFromMidfield( ' + id + ' )');
			var id_index = service.positionMidList.indexOf( id );
			if ( id_index != -1 ) {
				if ( id_index == 0 ) {
					service.positionMidList.shift();
				} else { 
					service.positionMidList.splice( id_index, 1 );
				}
			}
		}

		service.getMidfielders = function() {
			// DebugConsoleLog('Players.getMidfielders()');
			var result = [];
			var len = service.positionMidList.length;
			var j = 0;
			for ( var i = 0; i < len; i++ ) {
				j = 0;
				while ( j < teamList.length && teamList[ j ].id != service.positionMidList[ i ]) { j++; }
				if ( j >= teamList.length ) { 
					return [];			// Abort, something went wrong
				} else {
					result.push(teamList[ j ]);
				}
			}
			return result;
		}

		function isMidfielder( id ) {
			return ( indexMidfielder( id ) != -1 );
		}

		function indexMidfielder( id ) {
			return service.positionMidList.indexOf( id );
		}


		service.isLongestMidfield = function( id ) {
			var result = true;
			var player = service.getById( id );
			if ( player ) {
				for ( var i = 0; i < service.positionMidList.length; i++ ) {
					var comp = service.getById( service.positionMidList[ i ]);
					if ( comp.cgt > player.cgt ) {
						return false;
					}
				}
			} else {
				// Something went wrong
				result = false;
			}
			return result;
		}

		////////////////////////////////////////// DEFENDER FUNCTIONS
		function addToDefence( id ) {
			DebugConsoleLog( 'Players.addToDefence()');
			service.positionDefenceList.push( id );
		}

		service.swapDefenders = function( id1, id2 ) {
			var id1_index = service.positionDefenceList.indexOf( id1 );
			var id2_index = service.positionDefenceList.indexOf( id2 );
			if ( id1_index && id2_index ) {
				service.positionDefenceList[ id1_index ] = id2;
				service.positionDefenceList[ id2_index ] = id1;
			}
		}

		function removeFromDefence( id ) {
			DebugConsoleLog( 'Players.removeFromDefence( ' + id + ' )');
			var id_index = service.positionDefenceList.indexOf( id );
			if ( id_index != -1 ) {
				if ( id_index == 0 ) {
					service.positionDefenceList.shift();
				} else { 
					service.positionDefenceList.splice( id_index, 1 );
				}
			}
		}

		service.getDefenders = function() {
			// DebugConsoleLog('Players.getDefenders()');
			var result = [];
			var len = service.positionDefenceList.length;
			var j = 0;
			for ( var i = 0; i < len; i++ ) {
				j = 0;
				while ( j < teamList.length && teamList[ j ].id != service.positionDefenceList[ i ]) { j++; }
				if ( j >= teamList.length ) { 
					return [];			// Abort, something went wrong
				} else {
					result.push(teamList[ j ]);
				}
			}
			return result;
		}

		function isDefender( id ) {
			return ( indexDefender( id ) != -1 );
		}

		function indexDefender( id ) {
			return service.positionDefenceList.indexOf( id );
		}

		service.isLongestDefender = function( id ) {
			var result = true;
			var player = service.getById( id );
			if ( player ) {
				for ( var i = 0; i < service.positionDefenceList.length; i++ ) {
					var comp = service.getById( service.positionDefenceList[ i ]);
					if ( comp.cgt > player.cgt ) {
						return false;
					}
				}
			} else {
				// Something went wrong
				result = false;
			}
			return result;
		}

		////////////////////////////////////////// GOAL-KEEPER FUNCTIONS
		function addGoalKeeper( id ) {
			DebugConsoleLog( 'Players.addGoalKeeper()');
			service.positionGoalKeeperList.push( id );
		}

		service.swapGoalKeepers = function( id1, id2 ) {
			var id1_index = service.positionGoalKeeperList.indexOf( id1 );
			var id2_index = service.positionGoalKeeperList.indexOf( id2 );
			if ( id1_index && id2_index ) {
				service.positionGoalKeeperList[ id1_index ] = id2;
				service.positionGoalKeeperList[ id2_index ] = id1;
			}
		}

		function removeFromGoalKeeper( id ) {
			DebugConsoleLog( 'Players.removeFromGoalKeeper( ' + id + ' )');
			var id_index = service.positionGoalKeeperList.indexOf( id );
			if ( id_index != -1 ) {
				if ( id_index == 0 ) {
					service.positionGoalKeeperList.shift();
				} else { 
					service.positionGoalKeeperList.splice( id_index, 1 );
				}
			}
		}

		service.getGoalKeepers = function() {
			// DebugConsoleLog('Players.getGoalKeepers()');
			var result = [];
			var len = service.positionGoalKeeperList.length;
			var j = 0;
			for ( var i = 0; i < len; i++ ) {
				j = 0;
				while ( j < teamList.length && teamList[ j ].id != service.positionGoalKeeperList[ i ]) { j++; }
				if ( j >= teamList.length ) { 
					return [];			// Abort, something went wrong
				} else {
					result.push(teamList[ j ]);
				}
			}
			return result;
		}

		function isGoalKeeper( id ) {
			return ( indexGoalKeeper( id ) != -1 );
		}

		function indexGoalKeeper( id ) {
			return service.positionGoalKeeperList.indexOf( id );
		}




		service.movePlayerToForward = function( id ) {
			DebugConsoleLog('Players.movePlayerToForward(' + id + ')');
			// First, let's find where the player currently is
			if ( isForward( id )) { return; }								// Do nothing, the player is already in a forward position
			if ( isOnBench( id )) { removeFromBench( id ); }				// The player is currently on the bench
			if ( isMidfielder( id )) { removeFromMidfield( id ); }			// The player is currently a midfielder
			if ( isDefender( id )) { removeFromDefence( id ); }				// The player is currently a defender
			if ( isGoalKeeper( id )) { removeFromGoalKeeper( id ); }		// The player is currently a goal keeper
			addToForward( id );
		}

		service.movePlayerToMidfield = function( id ) {
			DebugConsoleLog('Players.movePlayerToMidfield()');
			// First, let's find where the player currently is
			if ( isMidfielder( id )) { return; }		// Do nothing, the player is already in a forward position
			if ( isOnBench( id )) { removeFromBench( id ); }				// The player is currently on the bench
			if ( isForward( id )) { removeFromForwards( id ); }				// The player is currently a forward
			if ( isGoalKeeper( id )) { removeFromGoalKeeper( id ); }		// The player is currently a goal keeper
			if ( isDefender( id )) { removeFromDefence( id ); }				// The player is currently a defender
			addToMidfield( id );
		}

		service.movePlayerToBench = function( id ) {
			DebugConsoleLog('Players.movePlayerToBench()');
			// First, let's find where the player currently is
			if ( isOnBench( id )) { return; }								// Do nothing, the play is currently on the bench
			if ( isForward( id )) { removeFromForwards( id ); }				// The player is currently a forward
			if ( isMidfielder( id )) { removeFromMidfield( id ); }			// The player is currently a midfielder
			if ( isGoalKeeper( id )) { removeFromGoalKeeper( id ); }		// The player is currently a goal keeper
			if ( isDefender( id )) { removeFromDefence( id ); }				// The player is currently a defender
			addToBench( id );
		}

		service.movePlayerToDefence = function( id ) {
			DebugConsoleLog('Players.movePlayerToDefence()');
			// First, let's find where the player currently is
			if ( isDefender( id )) { return; }								// Do nothing, the play is currently a defender
			if ( isOnBench( id )) { removeFromBench( id ); }				// The player is currently on the bench
			if ( isForward( id )) { removeFromForwards( id ); }				// The player is currently a forward
			if ( isGoalKeeper( id )) { removeFromGoalKeeper( id ); }		// The player is currently a goal keeper
			if ( isMidfielder( id )) { removeFromMidfield( id ); }			// The player is currently a midfielder
			addToDefence( id );
		}

		service.movePlayerToGoalKeeper = function( id ) {
			DebugConsoleLog('Players.movePlayerToDefence()');
			// First, let's find where the player currently is
			if ( isGoalKeeper( id )) { return; }							// Do nothing, the play is currently a goal keeper
			if ( isOnBench( id )) { removeFromBench( id ); }				// The player is currently on the bench
			if ( isForward( id )) { removeFromForwards( id ); }				// The player is currently a forward
			if ( isMidfielder( id )) { removeFromMidfield( id ); }			// The player is currently a midfielder
			if ( isDefender( id )) { removeFromDefence( id ); }				// The player is currently a defender
			addGoalKeeper( id );
		}


		////////////////////////////
		function getPlayerPositionIndex( id ) {
			// result = {};
			var id_index = indexForward( id );
			if ( id_index != -1 ) {
				// Player is a forward
				return { pos: 'ATT', index: id_index };
			}
			id_index = indexBench( id );
			if ( id_index != -1 ) {
				// Player is on the bench
				return { pos: 'BEN', index: id_index };
			}
			id_index = indexMidfielder( id );
			if ( id_index != -1 ) {
				// Player is in midfield
				return { pos: 'MID', index: id_index };
			}
			id_index = indexDefender( id );
			if ( id_index != -1 ) {
				// Player is in midfield
				return { pos: 'DEF', index: id_index };
			}
			id_index = indexGoalKeeper( id );
			if ( id_index != -1 ) {
				// Player is in midfield
				return { pos: 'GK', index: id_index };
			}
			// something is wrong
			return null;

		}


		service.swapPlayers = function( id1, id2 ) {
			DebugConsoleLog('Players.swapPlayers()');
			if ( id1 == id2 ) { return; }	// Do nothing, these are the same player

			var id1_info = getPlayerPositionIndex( id1 );
			// console.log( 'player 1:' + id1 );
			// console.log( id1_info );
			var id2_info = getPlayerPositionIndex( id2 );
			// console.log( 'player 2:' + id2 );
			// console.log( id2_info );
			if ( id1_info && id2_info ) {
				if ( id1_info.pos == 'ATT') { service.positionForwardList[ id1_info.index ] = id2; }	// Player 2 is now a forward
				if ( id1_info.pos == 'MID') { service.positionMidList[ id1_info.index ] = id2; }		// Player 2 is now in midfield
				if ( id1_info.pos == 'DEF') { service.positionDefenceList[ id1_info.index ] = id2; }	// Player 2 is now in defender
				if ( id1_info.pos == 'GK') { service.positionGoalKeeperList[ id1_info.index ] = id2; }	// Player 2 is now in goal keeper
				if ( id1_info.pos == 'BEN') { service.positionBenchList[ id1_info.index ] = id2; }		// Player 2 is now on the bench

				if ( id2_info.pos == 'ATT') { service.positionForwardList[ id2_info.index ] = id1; }	// Player 1 is now a forward
				if ( id2_info.pos == 'MID') { service.positionMidList[ id2_info.index ] = id1; }		// Player 1 is now in midfield
				if ( id2_info.pos == 'DEF') { service.positionDefenceList[ id2_info.index ] = id1; }	// Player 1 is now in defender
				if ( id2_info.pos == 'GK') { service.positionGoalKeeperList[ id2_info.index ] = id1; }	// Player 1 is now in goal keeper
				if ( id2_info.pos == 'BEN') { service.positionBenchList[ id2_info.index ] = id1; }		// Player 1 is now on the bench
			}
			// Final step is to reset-timers if moving on or off the bench
			if ( id1_info.pos == 'BEN') {
				// console.log( 'player 2 is now on the bench');
				for ( var i = 0; i < teamList.length; i++ ) {
					if ( teamList[ i ].id == id2 ) {
						teamList[ i ].cgt = 0;
						teamList[ i ].cbt = 0;
					}
				}
				// teamList[ service.positionDefenceList[ id1_info.index ] ].cgt = 0;
				// teamList[ service.positionDefenceList[ id1_info.index ] ].cbt = 0;
			}
			if ( id2_info.pos == 'BEN') {
				// console.log( 'player 1 is now on the bench');
				for ( var i = 0; i < teamList.length; i++ ) {
					if ( teamList[ i ].id == id1 ) {
						teamList[ i ].cgt = 0;
						teamList[ i ].cbt = 0;
					}
				}				
				// teamList[ service.positionDefenceList[ id2_info.index ] ].cgt = 0;
				// teamList[ service.positionDefenceList[ id2_info.index ] ].cbt = 0;
			}
		}


		if ( runTests ) {
			// We are going to run some tests
			console.log( 'Start Players Testing' );
			addToForward( 5 );
			console.log( service.positionForwardList );
			addToForward( 7 );
			addToForward( 9 );
			addToForward( 11 );
			indexForward( 12 );
			console.log( service.positionForwardList );
			service.swapForwards( 7, 11 );
			console.log( service.positionForwardList );
			service.removeFromForwards( 11 );
			console.log( service.positionForwardList );
			var forwardList = service.getForwards();
			console.log( forwardList );

			console.log( 'BENCH TESTS');
			addToBench( 1 );
			addToBench( 3 );
			addToBench( 4 );
			console.log( service.positionBenchList );
			removeFromBench( 1 );
			console.log( service.positionBenchList );
			removeFromBench( 4 );
			console.log( service.positionBenchList );
			removeFromBench( 5 );
			console.log( service.positionBenchList );
			console.log( isOnBench( 4 ));
			console.log( isOnBench( 6 ));
			console.log( 'End Players Testing' );
		}

		service.incrementTime = function( increment ) {
			for ( var i = 0; i < teamList.length; i++ ) {
				if ( isOnBench( teamList[ i ].id )) {
					// The player is on the bench
					teamList[i].tbt += increment;
					teamList[i].cbt += increment;
				} else {
					// The player is on the field
					teamList[i].cgt += increment;
					teamList[i].tgt += increment;
				}
			}
		}

		service.getById = function( id ) {
			for ( var i = 0; i < teamList.length; i++ ) {
				if ( teamList[ i ].id == id ) {
					return teamList[ i ];
				}
			}
			return null;			
		}

		service.getByName = function( name ) {
			for ( var i = 0; i < teamList.length; i++ ) {
				if ( teamList[ i ].name == name ) {
					return teamList[ i ];
				}
			}
			return null;
		}


		// This is done once as part of initial setup
		service.allToBench();
	}
})();