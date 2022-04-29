const path = require('path');
const os = require('os')

var pathObject = path.parse(__filename);

console.log(pathObject.dir);
console.log(os.cpus())