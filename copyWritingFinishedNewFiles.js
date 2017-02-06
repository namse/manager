const fs = require('fs');

let previousfilenamesOfSource;


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

  if (!previousfilenamesOfSource) {
    previousfilenamesOfSource = filenamesOfSource;
    return;
  }

  const targets = previousfilenamesOfSource.filter(previousFilenameOfEncoded =>
    !filenamesOfDest.includes(previousFilenameOfEncoded)
  );
  return copyFiles(targets,
    source,
    dest);
})
