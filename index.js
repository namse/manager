const copyNewFiles = require('./copyNewFiles');

setInterval(() => copyNewFiles(
  process.env.ENCODED_DIRECTORY,
  process.env.DESTINATION_DIRECTORY),
process.env.INTERVAL);
