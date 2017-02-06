const fs = require('fs');

let previousFilenamesOfSource;


const getFiles = () => new Promise((resolve, reject) =>{
  console.log('hi');
  fs.readdir(directory, (err, filenames) => {
    if (err) {
      console.log(`fail to get files from ${directory}`);
      return reject(err);
    }
    console.log(`success to get files from ${directory}`, filenames);
    return resolve(filenames);
  })});

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
  console.log('previousFilenamesOfSource', previousFilenamesOfSource)
  console.log('filenamesOfSource', filenamesOfSource)
  console.log('filenamesOfDest', filenamesOfDest)

  if (!previousFilenamesOfSource) {
    console.log('previousFilenamesOfSource is null')
    previousFilenamesOfSource = filenamesOfSource;
    return;
  }

  if (filenamesOfSource.length == previousFilenamesOfSource.length
    && filenamesOfSource.every(filenameOfSource =>
      previousFilenamesOfSource.includes(filenameOfSource))) {
    console.log('filenamesOfSource not changed')
    return;
  }

  const targets = previousFilenamesOfSource.filter(previousFilenameOfEncoded =>
    !filenamesOfDest.includes(previousFilenameOfEncoded)
  );
  console.log('targets', targets);
  return copyFiles(targets, source, dest)
  .then(() => {
    previousFilenamesOfSource = filenamesOfSource;
  });
})
