/// <reference path="../ref/screeps.d.ts" />

var roleLinkHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let source = Game.getObjectById(creep.memory.sourceId);
        let link  = Game.getObjectById(creep.memory.linkId);

        let result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        } else if (result == OK) {
            creep.transfer(link, RESOURCE_ENERGY);
        }
    },

};

module.exports = roleLinkHarvester;
