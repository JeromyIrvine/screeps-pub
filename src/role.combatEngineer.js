/// <reference path="../ref/screeps.d.ts" />

var roleRepairer = require("role.repairer");

var roleCombatEngineer = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.working && creep.carry.energy == 0) {
			creep.memory.working = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true;
			creep.say('🚧 repair');
		}

		if (creep.memory.working) {
			
			let walls = creep.room.find(FIND_STRUCTURES, { 
				filter: s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
			});

			let targets = undefined;
			for (let pct = 0.0001; pct <= 1; pct += 0.0001) {
				targets = _.filter(walls, w => w.hits / w.hitsMax < pct);
				if (targets.length > 0) {
					break;
				}
			}

			if (targets.length > 0) {
				let target = creep.pos.findClosestByPath(targets);
				if (creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			} else {
				roleRepairer.run(creep);
			}

		} else {
			var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: c => (c.structureType == STRUCTURE_CONTAINER || c.structureType == STRUCTURE_STORAGE) && c.store.energy >= 50
			});
			if (container) {
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

module.exports = roleCombatEngineer;
