# screeps-pub - Screeps code for the public server

## Setup

1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install -g grunt-cli` to install Grunt command line support.
3. In your project folder, run `npm init` and setup your package.json file.
4. Run `npm install grunt`
5. Run `npm install grunt-screeps`
6. Create a .screeps.json file for your credentials as directed [here](https://docs.screeps.com/contributed/advanced_grunt.html).
7. Create a gruntfile.js - see this project's for structure.

## TODO

- [ ] LD Harvesters, have a home room and work room. Do not pick up dropped energy in home room or less than a certain threshold. Prioritize carry, then move, then work.
- [ ] Workers should task-lock when in range of task until done - no switching because a 'higher priority' task came up. This applies both to work and energy collection.
- [ ] Harvesters should only pursue dropped energy if they are not already harvesting a source
- [x] Only one harvester should pursue a dropped energy - they should not all divert
- [x] Harvesters should also looks for tombstones and grab that energy
- [ ] Advanced tower logic: repair and heal
