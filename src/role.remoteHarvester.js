/// <reference path="../ref/screeps.d.ts" />

var roleRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('📦 unload');
        }
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }

        if (creep.memory.harvesting) {
            harvestEnergy(creep);
        } else {
            deliverEnergy(creep);
        }
    }
};

/** @param {Creep} creep **/
function harvestEnergy(creep) {
    let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 5);
    if (tombs.length > 0) {
        if (creep.withdraw(tombs[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(tombs[0]);
        }
        return;
    }

    let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, { filter: { resourceType: RESOURCE_ENERGY } });
    if (drops.length > 0) {
        if (creep.pickup(drops[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(drops[0]);
        }
        return;
    }

    if (creep.room.name != creep.memory.workRoom) {
        let exit = creep.room.findExitTo(creep.memory.workRoom);
        creep.moveTo(creep.pos.findClosestByPath(exit));
    } else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

/** @param {Creep} creep **/
function deliverEnergy(creep) {
    if (creep.room.name != creep.memory.homeRoom) {
        let exit = creep.room.findExitTo(creep.memory.homeRoom);
        creep.moveTo(creep.pos.findClosestByPath(exit));
    } else {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure => filterToSinks(structure)
        });
        // Prioritize towers, then other items.
        let target = _.find(targets, x => x.structureType == STRUCTURE_TOWER);
        if (!target) {
            target = creep.pos.findClosestByPath(targets);
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else if (creep.room.storage) {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        else {
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

/** @param {Structure} structure **/
function filterToSinks(structure) {
    let st = structure.structureType;
    return (st == STRUCTURE_EXTENSION || st == STRUCTURE_SPAWN || st == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
}

module.exports = roleRemoteHarvester;
