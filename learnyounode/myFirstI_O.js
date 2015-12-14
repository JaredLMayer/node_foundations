var fs = require('fs');
var str = fs.readFileSync(process.argv[2]).toString(); 
var arr = str.split('\n');
console.log(arr.length-1);