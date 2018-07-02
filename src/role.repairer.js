/// <reference path="../ref/screeps.d.ts" />

var roleBuilder = require("role.builder");

var roleRepairer = {

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
			let target = undefined;

			if (creep.memory.repairTargetId) {
				target = Game.getObjectById(creep.memory.repairTargetId);
				if (!target || target.hits >= target.hitsMax) {
					target = undefined;
					creep.memory.repairTargetId = null;
				}
			}

			if (!target) {
				target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: s => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
				});
				if (target) {
					creep.memory.repairTargetId = target.id;
				}
			}

			if (!target) {
				creep.say("bu");
				roleBuilder.run(creep);
				return;
			}

			if (creep.repair(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
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
				var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: s => s.energy > 0 });
				if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
		}
	}
};

module.exports = roleRepairer;
