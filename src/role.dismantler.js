/// <reference path="../ref/screeps.d.ts" />

var roleDismantler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.room.name != creep.memory.workRoom) {
            let exit = creep.room.findExitTo(creep.memory.workRoom);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        } else {

            // Tempory - dismantle the wall that's in our way
            let wall = Game.getObjectById("5a92f63bbb1b9b3775dd879a");
            if (wall) {
                if (creep.dismantle(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
                return;
            } else {
                let wall = creep.room.find(FIND_STRUCTURES, { 
                    filter: s => s.structureType == STRUCTURE_WALL && s.pos.x < 4 && s.pos.y < 16 
                });
                if (wall && creep.dismantle(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
            }
        }

    }
};

module.exports = roleDismantler;
