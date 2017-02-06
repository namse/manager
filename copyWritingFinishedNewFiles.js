const fs = require('fs');

let previousFilenamesOfSource;


const getFiles = () => new Promise((resolve, reject) =>
  fs.readdir(directory, (err, filenames) => {
    if (err) {
      return reject(err);
    }
    return resolve(filenames);
  }));

const copyFiles = (filenames, source, destination) => Promise.all([
  filenames.map(filename => new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    readStream.on('error', err => reject(err));

    const writeStream = fs.createWriteStream(destination);
    writeStream.on('error', (err) => reject(err));
    writeStream.on('finish', () => resolve());

    readStream.pipe(writeStream);
  }))
]);


module.exports = (source, dest) => Promise.all([
  getFiles(source),
  getFiles(dest),
])
.then((results) => {
  const [
    filenamesOfSource,
    filenamesOfDest,
  ] = results;

  if (!previousFilenamesOfSource) {
    previousFilenamesOfSource = filenamesOfSource;
    return;
  }

  if (filenamesOfSource.length == previousFilenamesOfSource.length
    && filenamesOfSource.every(filenameOfSource =>
      previousFilenamesOfSource.includes(filenameOfSource))) {
    return;
  }

  const targets = previousFilenamesOfSource.filter(previousFilenameOfEncoded =>
    !filenamesOfDest.includes(previousFilenameOfEncoded)
  );
  return copyFiles(targets, source, dest)
  .then(() => {
    previousFilenamesOfSource = filenamesOfSource;
  });
})
