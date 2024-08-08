var fs = require('fs-extra');
var archiver = require('archiver');
const {name, version} = require('../package.json');

// modify these only
REMOVE_FOLDER_ON_COMPLETE = true;

var canonicalName = name;
var buildFolderPath = './build/';
var temporaryFolderPath = './package_temp';
var zipFileName = `${buildFolderPath}${canonicalName}-${version}.zip`;

if (!fs.existsSync(buildFolderPath)) {
    fs.mkdirSync(buildFolderPath);
    console.log('Adding build folder: ' + buildFolderPath);
}

// Copy things over to new temp game package folder
console.log('Creating game package: ' + zipFileName);

if (fs.existsSync(temporaryFolderPath)) {
    fs.removeSync(temporaryFolderPath);
}

var listOfGameItems = [
    'assets',
    // 'libs',
    'dist',
    'index.html',
];
listOfGameItems.forEach(function (itemPath) {
    var p = fs.lstatSync(itemPath);
    if (p.isFile()) {
        fs.copySync(itemPath, temporaryFolderPath + '/' + itemPath);
    } else if (p.isDirectory()) {
        fs.copySync(itemPath, temporaryFolderPath + '/' + itemPath, {
            filter: function (src, dest) {
                if (src.endsWith('.ts')) {
                    return false;
                }
                return true;
            }
        });
    }
});

var output = fs.createWriteStream(zipFileName);
var zipArchive = archiver('zip');
zipArchive.pipe(output);
output.on('close', function () {
    console.log('Game package created: ', zipFileName);
    if (REMOVE_FOLDER_ON_COMPLETE) {
        fs.removeSync(temporaryFolderPath);
    }
});
zipArchive.directory(temporaryFolderPath, false);
zipArchive.finalize(function (err, bytes) {
    if (err) {
        throw err;
    }
    console.log('done:', base, bytes);
});
