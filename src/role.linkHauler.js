/// <reference path="../ref/screeps.d.ts" />

var roleLinkHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.hauling = false;
            creep.say('📦 unload');
        }
        if (!creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = true;
            creep.say('🔄 haul');
        }

        if (creep.memory.hauling) {
            harvestEnergy(creep, Game.getObjectById(creep.memory.linkId));
        } else {
            deliverEnergy(creep);
        }
    }
}

/** @param {Creep} creep */
/** @param {StructureLink} link */
function harvestEnergy(creep, link) {
    if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(link);
    }
}

/** @param {Creep} creep **/
function deliverEnergy(creep) {
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

/** @param {Structure} structure **/
function filterToSinks(structure) {
    let st = structure.structureType;
    return (st == STRUCTURE_EXTENSION || st == STRUCTURE_SPAWN || st == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
}

module.exports = roleLinkHauler;
