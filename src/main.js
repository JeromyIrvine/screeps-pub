/// <reference path="../ref/screeps.d.ts" />
/// <reference path="../ref/custom.d.ts" />

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require("role.repairer");
var roleRemoteHarvester = require("role.remoteHarvester");
var roleCombatEngineer = require("role.combatEngineer");
var roleSkirmisher = require("role.skirmisher");
var roleLinkHarvester = require("role.linkHarvester");
var roleLinkHauler = require("role.linkHauler");
var roleClaimer = require("role.claimer");
var roleDismantler = require("role.dismantler");
var roleHeavyHauler = require("role.heavyHauler");
var linkBrain = require("linkBrain");

const roleModuleMap = {
    linkHarvester: roleLinkHarvester,
    linkHauler: roleLinkHauler,
    harvester: roleHarvester,
    upgrader: roleUpgrader,
    builder: roleBuilder,
    repairer: roleRepairer,
    remoteHarvester: roleRemoteHarvester,
    combatEngineer: roleCombatEngineer,
    skirmisher: roleSkirmisher,
    claimer: roleClaimer,
    dismantler: roleDismantler,
    heavyHauler: roleHeavyHauler
};

module.exports.loop = function () {

    garbageCollect();

    var hr = [
        {
            room: "E43S1", 
            roster: [
                // { role: "harvester", targetPop: 1, memory: { sourceId: "5983005eb097071b4adc4288" } },
                // { role: "harvester", targetPop: 1, memory: { workRoom: "E44S1" } },
                { role: "linkHarvester", targetPop: 1, memory: { sourceId: "5983005eb097071b4adc4286", linkId: "5b25dd2395593b53c85cadae" } },
                { role: "linkHarvester", targetPop: 1, memory: { sourceId: "5983005eb097071b4adc4288", linkId: "5b2fe7746ef2600f13dc2fb8" } },
                { role: "linkHauler", targetPop: 2, memory: { linkId: "5b25ced2c20f5b53b28a2732" } },
                { role: "upgrader", targetPop: 1 },
                { role: "repairer", targetPop: 1 },
                { role: "remoteHarvester", targetPop: 1, workRoom: "E42S1" },
                { role: "remoteHarvester", targetPop: 1, workRoom: "E43S2" },
                { role: "builder", targetPop: 1 },
                { role: "combatEngineer", targetPop: 1 }
            ]
        },
        {
            room: "E44S1", 
            roster: [
                { role: "harvester", targetPop: 1, memory: { sourceId: "5983006cb097071b4adc441f" } },
                { role: "linkHarvester", targetPop: 1, memory: { sourceId: "5983006cb097071b4adc4420", linkId: "5b401d50c4315938e7f84dd2" } },
                { role: "linkHauler", targetPop: 1, memory: { linkId: "5b40208f36223a3a08993428" } },
                { role: "builder", targetPop: 1 },
                { role: "upgrader", targetPop: 2 },
                { role: "repairer", targetPop: 1 },
                { role: "combatEngineer", targetPop: 1 }
            ]
        }
    ];

    var bodies = [
        { energy: 2300, body: [
            WORK, WORK, WORK, WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ] },
        { energy: 1800, body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
        { energy: 1500, body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] },
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
        { energy: 550, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] },
        { energy: 450, body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE] },
        { energy: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
        { energy: 300, body: [WORK, CARRY, CARRY, MOVE, MOVE] }
    ];

    for (let key in Game.spawns) {
        let spawn = Game.spawns[key];
        let roster = _.find(hr, x => x.room == spawn.room.name).roster;
        runRoom(spawn, roster, bodies);
    }

    linkBrain.transfer(Game.getObjectById("5b25dd2395593b53c85cadae"), Game.getObjectById("5b25ced2c20f5b53b28a2732"));
    linkBrain.transfer(Game.getObjectById("5b2fe7746ef2600f13dc2fb8"), Game.getObjectById("5b25ced2c20f5b53b28a2732"));
    linkBrain.transfer(Game.getObjectById("5b401d50c4315938e7f84dd2"), Game.getObjectById("5b40208f36223a3a08993428"));

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        roleModuleMap[creep.memory.role].run(creep);
    }
}

/**
 * Runs the room for a tick.
 * @param {StructureSpawn} spawn 
 * @param {CreepDescription[]} hiring 
 * @param {BodyPlan[]} bodies 
 */
function runRoom(spawn, hiring, bodies) {
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

    if (Memory.skirmisher && spawn.room.energyAvailable >= 1000) {
        if (spawn.spawnSkirmisher(Memory.skirmisher) == OK) {
            delete Memory.skirmisher;
        }
    }

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
        } else if (ct.role == "linkHarvester") {

            let harvesters = _.filter(creepsInRoom, c => 
                c.memory.role == ct.role 
                && c.memory.sourceId == ct.memory.sourceId);

            if ((harvesters.length == 0 || (harvesters.length == 1 && harvesters[0].ticksToLive <= 30)) && spawn.room.energyAvailable >= 600) {
                let body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
                let name = `lha${Memory.creepCount}`;
                let memory = Object.assign({ role: ct.role }, ct.memory);
                let creep = spawn.spawnCreep(body, name, { memory });
                if (creep == OK) {
                    Memory.creepCount++;
                    logSpawn("link harvester", name, spawn.room.name);
                    break;
                }
            }

        } else if (ct.role == "linkHauler") {
            let haulers = _.filter(creepsInRoom, c => c.memory.role == ct.role);
            if ((haulers.length < ct.targetPop || (haulers.length == ct.targetPop && _.any(haulers, h => h.ticksToLive <= 54)))
                && spawn.room.energyAvailable >= 900)
            {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                let name = `haul${Memory.creepCount}`;
                let memory = Object.assign({ role: ct.role }, ct.memory);
                let creep = spawn.spawnCreep(body, name, { memory });
                if (creep == OK) {
                    Memory.creepCount++;
                    logSpawn("hauler", name, spawn.room.name);
                    break;
                }
            }
        } else {
            let pop = _.sum(creepsInRoom, c => c.memory.role == ct.role);

            if (pop < ct.targetPop && spawn.room.energyAvailable >= energyNeeded) {
                let name = `${ct.role.substring(0, 2)}${Memory.creepCount}`;
                let memory = Object.assign({ role: ct.role }, ct.memory);
                let creep = spawn.spawnCreep(bodyDesign, name, { memory });
                if (creep == OK) {
                    Memory.creepCount++;
                    logSpawn(ct.role, name, spawn.room.name);
                    break;
                }
            }
        }
    }

    let towers = spawn.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER });
    for (let tower of towers) {
        runTower(tower);
    }
}

/** @param {StructureTower} tower **/
function runTower(tower) {
    let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        tower.attack(target);
    }
}

function logSpawn(role, name, room) {
    console.log(`Spawned ${role} '${name}' in room ${room}`);
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
        let bodyDesign = [
            WORK, WORK, WORK, WORK,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
            MOVE, MOVE
        ];

        if (this.room.energyAvailable >= 1500) {
            let name = `rh${Memory.creepCount}`;
            let creep = this.spawnCreep(bodyDesign, name, { memory: { role, homeRoom, workRoom } });
            if (creep == OK) {
                Memory.creepCount++;
                logSpawn(role, name, this.room.name);
            }
        }
    };

StructureSpawn.prototype.queueSkirmisherFor = 
    function (room) {
        Memory.skirmisher = room;
        console.log("Queue skirmisher for room " + room);
    }
    
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
                logSpawn(role, name, this.room.name);
            }
            return creep;
        }
    };

StructureSpawn.prototype.spawnClaimer = 
    function (workRoom) {
        let role = "claimer";
        let bodyDesign = [WORK, CLAIM, MOVE, MOVE];

        if (this.room.energyAvailable >= 80) {
            let name = `claim${Memory.creepCount}`;
            let creep = this.spawnCreep(bodyDesign, name, { memory: { role, workRoom } });
            if (creep == OK) {
                Memory.creepCount++;
                logSpawn(role, name, this.room.name);
            }
        }
    };

StructureSpawn.prototype.spawnHeavyHauler = 
    function(sourceRoom, targetRoom) {
        let role = "heavyHauler";
        let body = roleHeavyHauler.body;

        if (this.room.energyAvailable >= roleHeavyHauler.spawnCost) {
            let name = `hh${Memory.creepCount}`;
            let creep = this.spawnCreep(body, name, { memory: { role, sourceRoom, targetRoom }});
            if (creep == OK) {
                Memory.creepCount++;
                logSpawn(role, name, this.room.name);
            }
            return creep;
        }
    };
