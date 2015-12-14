var fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function(err, data){
	try {
		var lines = data.split('\n').length-1
		console.log(lines);
	} catch (err) {
		throw err; 
	}
});