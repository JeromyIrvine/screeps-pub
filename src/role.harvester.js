/// <reference path="../ref/screeps.d.ts" />

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('📦 unload');
        }
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }

        if (creep.memory.harvesting) {
            //TODO: opportunistically get dropped resources, but don't switch away from a source
            // that we're already harvesting from unless that source runs out of energy.

            var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { 
                filter: res => res.resourceType == RESOURCE_ENERGY
            } );
            if (dropped && creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped);
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: c => c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity
                });
                if (containers.length > 0) {
                    if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;
