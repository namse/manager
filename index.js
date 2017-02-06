require('dotenv').config();
const path = require('path');
const copyWritingFinishedNewFiles = require('./copyWritingFinishedNewFiles');

const encodedDirectory = path.resolve(process.env.ENCODED_DIRECTORY);
const destDirectory = path.resolve(process.env.DESTINATION_DIRECTORY);

console.log(encodedDirectory, destDirectory, process.env.INTERVAL);

copyWritingFinishedNewFiles(
  encodedDirectory,
  destDirectory);
setInterval(() => copyWritingFinishedNewFiles(
  encodedDirectory,
  destDirectory),
process.env.INTERVAL);
