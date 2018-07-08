/// <reference path="../ref/screeps.d.ts" />

var roleHeavyHauler = {

    /** Body of the hauler. We'll be on roads almost all of the time,
     *  so we don't need many move parts. */
    body: [
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ],

    spawnCost: 2300,

    /** @param {Creep} creep **/
    run: function (creep) {
        
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('📦 unload');
        }
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 acquire');
        }

        if (creep.memory.harvesting) {
            acquireEnergy(creep);
        } else {
            deliverEnergy(creep);
        }
    }
}

/** @param {Creep} creep **/
function acquireEnergy(creep) {
    let tombs = creep.pos.findInRange(FIND_TOMBSTONES, 5, { filter: x => x.store.energy > 0 });
    if (tombs.length > 0) {
        if (creep.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(tombs[0]);
        }
        return;
    }

    let drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, { filter: x => x.resourceType == RESOURCE_ENERGY && x.amount > 0 });
    if (drops.length > 0) {
        if (creep.pickup(drops[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(drops[0]);
        }
        return;
    }

    if (creep.room.name != creep.memory.sourceRoom) {
        let exit = creep.room.findExitTo(creep.memory.sourceRoom);
        creep.moveTo(creep.pos.findClosestByPath(exit));
    } else {
        if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffff00' } });
        }
    }
}

/** @param {Creep} creep **/
function deliverEnergy(creep) {
    if (creep.room.name != creep.memory.targetRoom) {
        let exit = creep.room.findExitTo(creep.memory.targetRoom);
        creep.moveTo(creep.pos.findClosestByPath(exit));
    } else {
        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffff00' } });
        }
    }
}

module.exports = roleHeavyHauler;
