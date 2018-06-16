/// <reference path="../ref/screeps.d.ts" />

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require("role.repairer");
var roleRemoteHarvester = require("role.remoteHarvester");
var roleCombatEngineer = require("role.combatEngineer");
var roleSkirmisher = require("role.skirmisher");

module.exports.loop = function () {

    garbageCollect();

    var hiring = [
        { role: "harvester", targetPop: 2 },
        { role: "upgrader", targetPop: 2 },
        { role: "repairer", targetPop: 1 },
        { role: "remoteHarvester", targetPop: 1, workRoom: "E42S1" },
        { role: "remoteHarvester", targetPop: 1, workRoom: "E43S2" },
        { role: "builder", targetPop: 1 },
        { role: "combatEngineer", targetPop: 2 }
    ];

    var bodies = [
        { energy: 1300, body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 1200, body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 1100, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 1000, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 900, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 800, body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 750, body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 700, body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] },
        { energy: 650, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 600, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] },
        { energy: 550, body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] },
        { energy: 450, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] },
        { energy: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
        { energy: 300, body: [WORK, CARRY, CARRY, MOVE, MOVE] }
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
        
        if (ct.role == "remoteHarvester")
        {
            if (_.sum(Game.creeps, c => c.memory.role == ct.role && c.memory.workRoom == ct.workRoom) < ct.targetPop)
            {
                spawn.spawnRemoteHarvester(spawn.room.name, ct.workRoom);
                break;
            }
        } else {
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
    }

    let towers = spawn.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER });
    for (let tower of towers) {
        runTower(tower);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == "repairer") {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == "remoteHarvester") {
            roleRemoteHarvester.run(creep);
        }
        if (creep.memory.role == "combatEngineer") {
            roleCombatEngineer.run(creep);
        }
        if (creep.memory.role == "skirmisher") {
            roleSkirmisher.run(creep);
        }
    }
}

/** @param {StructureTower} tower **/
function runTower(tower) {
    let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        tower.attack(target);
    }

    //TODO: oops. Towers have refill priority, and the immediately use it to buff ramparts, so they
    // always need energy and we never build up enough to spawn new creeps. D'oh!

    // let ramparts = tower.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_RAMPART });
    // let targets = undefined;
    // for (let pct = 0.001; pct <= 1; pct += 0.001) {
    //     targets = _.filter(ramparts, w => w.hits / w.hitsMax < pct);
    //     if (targets.length > 0) {
    //         break;
    //     }
    // }
    // if (targets.length > 0) {
    //     tower.repair(tower.pos.findClosestByRange(targets));
    // }
}

function garbageCollect() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    for (let name in Memory) {
        if (name.startsWith("dropped") && !Game.getObjectById(name)) {
            delete Memory[name];
        }
    };
}

StructureSpawn.prototype.spawnRemoteHarvester = 
    function (homeRoom, workRoom) {
        let role = "remoteHarvester";
        let bodyDesign = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

        if (this.room.energyAvailable >= 1300) {
            let name = `rh${Memory.creepCount}`;
            let creep = this.spawnCreep(bodyDesign, name, { memory: { role, homeRoom, workRoom } });
            if (creep == OK) {
                Memory.creepCount++;
                console.log(`Spawned new ${role} creep: ${name}`);
            }
        }
    };

StructureSpawn.prototype.spawnSkirmisher = 
    function (workRoom) {
        let role = "skirmisher";
        let bodyDesign = [
            TOUGH, TOUGH, TOUGH, TOUGH, 
            MOVE, MOVE, MOVE, MOVE, 
            RANGED_ATTACK, 
            ATTACK, ATTACK, 
            MOVE, MOVE, 
            HEAL, 
            MOVE, MOVE
        ];

        if (this.room.energyAvailable >= 1000) {
            let name = `sk${Memory.creepCount}`;
            let creep = this.spawnCreep(bodyDesign, name, { memory: { role, workRoom } });
            if (creep == OK) {
                Memory.creepCount++;
                console.log(`Spawned new ${role} creep: ${name}`);
            }
        }
    };

