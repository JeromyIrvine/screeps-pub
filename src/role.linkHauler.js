/// <reference path="../ref/screeps.d.ts" />

var roleLinkHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.collecting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.collecting = false;
            //creep.say('📦 unload');
        }
        if (!creep.memory.collecting && creep.carry.energy == 0) {
            creep.memory.collecting = true;
            //creep.say('🔄 haul');
        }

        if (creep.memory.collecting) {
            harvestEnergy(creep, Game.getObjectById(creep.memory.linkId));
        } else {
            deliverEnergy(creep);
        }
    }
}

/** @param {Creep} creep */
/** @param {StructureLink} link */
function harvestEnergy(creep, link) {
    let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 15, { filter: t => t.store.energy >= 30 && (!Memory["dropped" + t.id] || Memory["dropped" + t.id] == creep.id) });
    if (tombs.length > 0) {
        let target = tombs[0];
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            Memory["dropped" + target.id] = creep.id;
            creep.moveTo(target);
        }
        return;
    }

    let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 15, {
        filter: d => d.resourceType == RESOURCE_ENERGY && (!Memory["dropped" + d.id] || Memory["dropped" + d.id] == creep.id)
    });
    if (drops.length > 0) {
        let target = drops[0];
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            Memory["dropped" + target.id] = creep.id; // who's going to pick it up
            creep.moveTo(target);
        }
        return;
    }
    
    let result = creep.withdraw(link, RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(link);
    } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
        // If there's no new energy, go ahead and distribute what we have.
        creep.memory.collecting = false;
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
