/// <reference path="../ref/screeps.d.ts" />

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
		if (creep.memory.workRoom && creep.room.name != creep.memory.workRoom) {
            let exit = creep.room.findExitTo(creep.memory.workRoom);
			creep.moveTo(creep.pos.findClosestByPath(exit));
			return;
		}

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
			var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: c => (c.structureType == STRUCTURE_CONTAINER || c.structureType == STRUCTURE_STORAGE) && c.store.energy >= 50
			});
			if (container) {
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				}
			} else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE, { filter: s => s.energy > 0 }) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	}
};

module.exports = roleUpgrader;
