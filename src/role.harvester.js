/// <reference path="../ref/screeps.d.ts" />

var roleHarvester = {

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

/** @param {Creep} creep **/
function harvestEnergy(creep) {

    //TODO: opportunistically get dropped resources, but don't switch away from a source
    // that we're already harvesting from unless that source runs out of energy.

    var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: res => res.resourceType == RESOURCE_ENERGY && res.amount >= 40
    });
    if (dropped && (!Memory["dropped" + dropped.id] || Memory["dropped" + dropped.id] == creep.id)) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            Memory["dropped" + dropped.id] = creep.id; // who's going to pick it up
            creep.moveTo(dropped);
        }
    }
    else {
        var tomb = creep.pos.findClosestByPath(FIND_TOMBSTONES);
        if (tomb && tomb.store.energy >= 40 && (!Memory["dropped"] + tomb.id || Memory["dropped" + tomb.id] == creep.id)) {
            let result = creep.withdraw(tomb, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE) {
                Memory["dropped" + tomb.id] = creep.id;
                creep.moveTo(tomb);
            }
            else if (result == OK) {
                console.log(`${creep.name} harvested the tombstone of ${tomb.creep.name}`);
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: s => s.energy > 0 });
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
}

/** @param {Structure} structure **/
function filterToSinks(structure) {
    let st = structure.structureType;
    return (st == STRUCTURE_EXTENSION || st == STRUCTURE_SPAWN || st == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
}

module.exports = roleHarvester;
