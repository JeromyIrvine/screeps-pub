/// <reference path="../ref/screeps.d.ts" />

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    garbageCollectDeadCreeps();

    var hiring = [
        { role: "harvester", targetPop: 2 },
        { role: "builder", targetPop: 3 },
        { role: "upgrader", targetPop: 4 }
    ];

    var bodies = [
        { energy: 550, body: [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE] },
        { energy: 450, body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE] },
        { energy: 400, body: [WORK,WORK,CARRY,CARRY,MOVE,MOVE] },
        { energy: 300, body: [WORK,CARRY,CARRY,MOVE,MOVE] }
    ];

    let spawn = Game.spawns.Spawn1;
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

    let energyNeeded = 0;
    let bodyDesign = [];
    for (let i = 0; i < bodies.length; i++) {
        if (spawn.room.energyCapacityAvailable >= bodies[i].energy) {
            energyNeeded = bodies[i].energy;
            bodyDesign = bodies[i].body;
            break;
        }
    }

    for (let i = 0; i < hiring.length; i++) {
        let ct = hiring[i];
        let pop = _.sum(creepsInRoom, c => c.memory.role == ct.role);

        if (pop < ct.targetPop && spawn.room.energyAvailable >= energyNeeded) {
            let name = `${ct.role.substring(0, 2)}${Memory.creepCount}`;
            let creep = spawn.spawnCreep(bodyDesign, name, { memory: { role: ct.role } });
            if (creep == OK) {
                Memory.creepCount++;
                console.log(`Spawned new ${ct.role} creep: ${name}`);
                break;
            }
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

function garbageCollectDeadCreeps() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}
