/// <reference path="../ref/screeps.d.ts" />

var roleLinkHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let source = Game.getObjectById(creep.memory.sourceId);
        let link  = Game.getObjectById(creep.memory.linkId);

        let result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_ENERGY) {
            creep.moveTo(source);
        } else if (result == OK) {
            if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(link);
            }
        }
    },

};

module.exports = roleLinkHarvester;
