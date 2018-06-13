/// <reference path="../ref/screeps.d.ts" />

var roleUpgrader = require("role.upgrader");

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.working && creep.carry.energy == 0) {
			creep.memory.working = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true;
			creep.say('🚧 build');
		}

		if (creep.memory.working) {
			let target = undefined;

			if (creep.memory.targetId) {
				target = Game.getObjectById(creep.memory.targetId);
			}

			if (!target) {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length) {
					target = targets[0];
					creep.memory.targetId = target.id;
				}
			}

			if (!target) {
				creep.say("up")
				roleUpgrader.run(creep);
				return;
			}

			if (creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
			}
		}
		else {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: c => c.structureType == STRUCTURE_CONTAINER && c.store.energy >= 50
			});
			if (containers.length > 0) {
				var container = containers[0];
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				}
			} else {
				var source = creep.pos.findClosestByPath(FIND_SOURCES);
				if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
		}
	}
};

module.exports = roleBuilder;
