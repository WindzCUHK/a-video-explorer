
const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

const includePaths = [
	path.resolve(__dirname, './app/sass/')
];
const file = path.resolve(__dirname, './app/sass/style.sass');
const outFile = path.resolve(__dirname, './app/dist/style.css');

const result = sass.render({
	includePaths, file, outFile
}, (err, result) => {

	if (err) return console.error(err);

	fs.writeFile(outFile, result.css, function(err) {

		if (err) return console.error(err);

	});
});
