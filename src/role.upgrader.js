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
			let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 10, { filter: t => t.store.energy >= 30 && (!Memory["dropped" + t.id] || Memory["dropped" + t.id] == creep.id) });
			if (tombs.length > 0) {
				let target = tombs[0];
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					Memory["dropped" + target.id] = creep.id;
					creep.moveTo(target);
				}
				return;
			}
			
			let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10, {
			filter: d => d.resourceType == RESOURCE_ENERGY && d.amount >= 30 && (!Memory["dropped" + d.id] || Memory["dropped" + d.id] == creep.id)
			});
			if (drops.length > 0) {
				let target = drops[0];
				if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
					Memory["dropped" + target.id] = creep.id; // who's going to pick it up
					creep.moveTo(target);
				}
				return;
			}

			var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: c => (c.structureType == STRUCTURE_CONTAINER || c.structureType == STRUCTURE_STORAGE) && c.store.energy >= 50
			});
			if (container) {
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				}
			} else {
				var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: s => s.energy > 0 });
				if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
            }
        }
	}
};

module.exports = roleUpgrader;
