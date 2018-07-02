/// <reference path="../ref/screeps.d.ts" />

var roleUpgrader = require("role.upgrader");

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.workRoom && creep.room.name != creep.memory.workRoom) {
            let exit = creep.room.findExitTo(creep.memory.workRoom);
			creep.moveTo(creep.pos.findClosestByPath(exit));
			return;
		}
		
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

module.exports = roleBuilder;
