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

		////////////////////////////// GENERIC FUNCTIONS /////////////////////////
		function addToList( id, list ) {
			list.push( id );
		}

		function removeFromList( id, list ) {
			var id_index = list.indexOf( id );
			if ( id_index != -1 ) {
				if ( id_index == 0 ) {
					list.shift();
				} else { 
					list.splice( id_index, 1 );
				}
			}			
		}

		function getList( list ) {
			var result = [];
			var len = list.length;
			var j = 0;
			for ( var i = 0; i < len; i++ ) {
				j = 0;
				while ( j < teamList.length && teamList[ j ].id != list[ i ]) { j++; }
				if ( j >= teamList.length ) { 
					return [];			// Abort, something went wrong
				} else {
					result.push(teamList[ j ]);
				}
			}
			return result;
		}

		function isLongest( id, list, pos ) {
			var result = true;
			var player = service.getById( id );
			if ( player ) {
				for ( var i = 0; i < list.length; i++ ) {
					var comp = service.getById( list[ i ]);
					if ( pos == 'BEN') {
						if ( comp.cbt > player.cbt ) {
							return false;
						}
					} else {
						if ( comp.cgt > player.cgt ) {
							return false;
						}
					}
				}
			} else {
				// Something went wrong
				result = false;
			}
			return result;
		}

		////////////////////////////////// Forwards functions///////////////////////
		function addToForward( id ) {
			DebugConsoleLog( 'Players.addToForward()');
			addToList( id, service.positionForwardList );
			// service.positionForwardList.push( id );
		}

		function removeFromForwards( id ) {
			DebugConsoleLog( 'Players.removeFromForwards( ' + id + ' )');
			removeFromList( id, service.positionForwardList );
		}

		service.getForwards = function() {
			DebugConsoleLog('Players.getForwards()');
			return getList( service.positionForwardList );
		}

		function isForward( id ) {
			return ( indexForward( id ) != -1 );
		}

		function indexForward( id ) {
			return service.positionForwardList.indexOf( id );
		}

		service.isLongestForward = function( id ) {
			return isLongest( id, service.positionForwardList, 'ATT');
		}


		///////////////////////////////////////////////// Bench functions
		function addToBench( id ) {
			DebugConsoleLog( 'Players.addToBench()');	
			addToList( id, service.positionBenchList );
			// service.positionBenchList.push( id );
		}

		function removeFromBench( id ) {
			DebugConsoleLog( 'Players.removeFromBench( ' + id + ' )');
			removeFromList( id, service.positionBenchList );
		}

		function sortBench( startIndex ) {
			if ( startIndex < service.positionBenchList.length ) {
				for ( var i = startIndex; i < service.positionBenchList.length - 1; i++ ) {
					var compare_1 = service.getById( service.positionBenchList[ i ]);
					var compare_2 = service.getById( service.positionBenchList[ i + 1 ]);
					if ( compare_1.cbt < compare_2.cbt ) {
						var tmp = service.positionBenchList[ i ];
						service.positionBenchList[ i ] = service.positionBenchList[ i + 1 ];
						service.positionBenchList[ i + 1 ] = tmp;
						sortBench( startIndex + 1 );
					}
				}
			}
		}

		service.getBench = function() {
			// DebugConsoleLog( 'Players.getBench()');
			// sort the bench first
			// if ( service.positionBenchList ) {
				for ( var i = 0; i < service.positionBenchList.length ; i++ ) {
					sortBench( 0 );
				}
			// }
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
			return isLongest( id, service.positionBenchList, 'BEN');
		}

		////////////////////////////////////////// MIDFIELD FUNCTIONS
		function addToMidfield( id ) {
			DebugConsoleLog( 'Players.addToMidfield()');
			service.positionMidList.push( id );
		}

		function removeFromMidfield( id ) {
			DebugConsoleLog( 'Players.removeFromMidfield( ' + id + ' )');
			removeFromList( id, service.positionMidList );
		}

		service.getMidfielders = function() {
			DebugConsoleLog('Players.getMidfielders()');
			return getList( service.positionMidList );
		}

		function isMidfielder( id ) {
			return ( indexMidfielder( id ) != -1 );
		}

		function indexMidfielder( id ) {
			return service.positionMidList.indexOf( id );
		}


		service.isLongestMidfield = function( id ) {
			return isLongest( id, service.positionMidList, 'MID');
		}

		////////////////////////////////////////// DEFENDER FUNCTIONS
		function addToDefence( id ) {
			DebugConsoleLog( 'Players.addToDefence()');
			service.positionDefenceList.push( id );
		}

		function removeFromDefence( id ) {
			DebugConsoleLog( 'Players.removeFromDefence( ' + id + ' )');
			removeFromList( id, service.positionDefenceList );
		}

		service.getDefenders = function() {
			DebugConsoleLog('Players.getDefenders()');
			return getList( service.positionDefenceList );
		}

		function isDefender( id ) {
			return ( indexDefender( id ) != -1 );
		}

		function indexDefender( id ) {
			return service.positionDefenceList.indexOf( id );
		}

		service.isLongestDefender = function( id ) {
			return isLongest( id, service.positionDefenceList, 'DEF');
		}

		////////////////////////////////////////// GOAL-KEEPER FUNCTIONS
		function addGoalKeeper( id ) {
			DebugConsoleLog( 'Players.addGoalKeeper()');
			service.positionGoalKeeperList.push( id );
		}

		function removeFromGoalKeeper( id ) {
			DebugConsoleLog( 'Players.removeFromGoalKeeper( ' + id + ' )');
			removeFromList( id, service.positionGoalKeeperList );
		}

		service.getGoalKeepers = function() {
			DebugConsoleLog('Players.getGoalKeepers()');
			return getList( service.positionGoalKeeperList );
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