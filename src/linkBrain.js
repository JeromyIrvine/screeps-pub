/// <reference path="../ref/screeps.d.ts" />

var linkBrain = {

    /** @param {StructureLink} fromLink */
    /** @param {StructureLink} toLink */
    transfer: function(fromLink, toLink) {
        if (fromLink.energy > 0 && fromLink.cooldown == 0) {
            fromLink.transferEnergy(toLink);
        }
    }

};

module.exports = linkBrain;
