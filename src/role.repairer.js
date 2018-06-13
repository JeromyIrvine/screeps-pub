/// <reference path="../ref/screeps.d.ts" />

var roleBuilder = require("role.builder");

var roleRepairer = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.repairing && creep.carry.energy == 0) {
			creep.memory.repairing = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
			creep.memory.repairing = true;
			creep.say('🚧 repair');
		}

		if (creep.memory.repairing) {

			var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: s => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
			});
			if (structure) {
				if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
					creep.moveTo(structure);
				}
			} else {
				roleBuilder.run(creep);
			}
		} else {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: c => c.structureType == STRUCTURE_CONTAINER && c.store.energy >= 50
			});
			if (containers.length > 0) {
				var container = containers[0];
				//var amount = Math.min(creep.carryCapacity, container.store.energy);
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				}
			} else {
				var source = creep.pos.findClosestByPath(FIND_SOURCES);
				if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
		}
	}
};

module.exports = roleRepairer;
