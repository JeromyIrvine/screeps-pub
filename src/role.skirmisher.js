/// <reference path="../ref/screeps.d.ts" />

var roleSkirmisher = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.room.name != creep.memory.workRoom) {
            let exit = creep.room.findExitTo(creep.memory.workRoom);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        } else {
            let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (enemy && creep.attack(enemy) == ERR_NOT_IN_RANGE || creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            } else {
                creep.heal(creep);
            }
        }

    }
};

module.exports = roleSkirmisher;
