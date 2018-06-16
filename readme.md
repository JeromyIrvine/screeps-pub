# screeps-pub

This repo contains my code for the [Screeps game](https://screeps.com). The
project is set up for development using Visual Studio Code, with Grunt tasks
configured to deploy to the Screeps public server.

The code is written in JavaScript (ES6), but uses some TypeScript hinting to
provide IntelliSense in VS Code.

## Setup for development with Visual Studio Code

1. Install [VS Code](https://code.visualstudio.com/)
2. Install [Node.js](https://nodejs.org/en/)
3. Update `package.json` with your information, or run `npm init` to recreate it.
4. Run `npm install -g grunt-cli` to install Grunt command line support.
5. Run `npm install grunt`
6. Run `npm install grunt-screeps`
7. Create a .screeps.json file for your credentials as described [here](https://docs.screeps.com/contributed/advanced_grunt.html).

The `jsconfig.json` and `gruntfile.js` files should be usable as is if no change
is made to the project structure.

### Project Structure

Most of the files in the root project directory are for project configuration.
The actual scripts that we'll be deploying to game are in the `/src` directory.
The `/ref` folders contains the TypeScript definition file from
[the Screeps-Typescript-Declarations project](https://github.com/screepers/Screeps-Typescript-Declarations),
which lets us get IntelliSense in VS Code by including a triple slash reference
directive at the top of our JS files. Including JS Doc comments on methods will
enable IntelliSense for the method arguments, as well.

If you follow the instructions above for setup, you should be able to run the
task `grunt screeps` to upload your `/src` folder to the Screeps server.

## TODO

This is a list of things that I plan to add to my script. This will grow and
change over time, as I finish items and think of new ideas.

- [x] Add Skirmisher unit that can hunt Invaders in remote rooms.
- [ ] Figure out how to detect if an Invader is in a work room and spawn a Skirmisher in response.
- [ ] Spawn logic should honor priority before available energy. Lower-cost items are jumping the list, currently.
- [x] Remote Harvesters should scan immediate area for tombstones / dropped energy and grab it during travel to work site.
- [ ] Workers should task-lock when in range of task until done - no switching because a 'higher priority' task came up. This applies both to work and energy collection.
- [ ] Harvesters should only pursue dropped energy if they are not already harvesting a source
- [ ] Advanced worker management: upgraders, builders, and repairers are all *workers* who can be reassigned based on jobs available. New workers should only be built if the target population for a given job can't be filled.
- [ ] Advanced tower logic: repair and heal **don't let towers repair ramparts until they've been maxed by workers**

## Roles

These are some of the roles that I've defined for my screeps.

### Harvester

Harvests energy sources and brings them to the spawn, extensions, storage, and
containers. Harvesters also scavenge tombstones and dropped energy sources > 40
in size.

### Long Distance / Remote Harvester

LDH's harvest energy from other rooms and bring it back to the home room for use.

### Upgrader

Upgraders use energy from containers or sources to upgrade the control point.

### Builder

Builders use energy from containers or sources to build structures. If there is
nothing to build, they will fall back to an Upgrader role.

### Repairer

Repairers use energy from containers or sources to repair structures. If there
is nothing to repair, they will fall back to a Builder role, and if nothing to
build, to an Upgrader role.

### Wall Repairer *not yet coded*

Wall repairers are a specialized unit that repair walls and ramparts.
