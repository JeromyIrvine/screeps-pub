# screeps-pub - Screeps code for the public server

## Setup

1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install -g grunt-cli` to install Grunt command line support.
3. In your project folder, run `npm init` and setup your package.json file.
4. Run `npm install grunt`
5. Run `npm install grunt-screeps`
6. Create a gruntfile.js with the contents below

```js
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'jeromy.irvine+screeps@gmail.com',
                password: 'O@6C6UoniqoMa9rg%dd3Bdn2',
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
}
```
