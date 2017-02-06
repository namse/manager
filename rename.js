const fs = require('fs');
const dest = 'D:\\yat\\ok';
const filenames = fs.readdirSync(dest);

// H Series
// Carib
const uniqueRegexes = {
  hLabelRegex: /ori\d{4}/g,
  caribLabelRegex: /\d{6}[\-_\s]?\d{3}[\-_\s]?carib/g,
  tenMuseumLabelRegex: /((\d{6}[\-_\s]?\d{2}[\-_\s]?10mu(sume)?)|(10mu(sume)?[\-_\s]?\d{6}[\-_\s]?\d{2}))/g,
  onePondoRegex: /1[Pp]ondo[\-_\s]?\d{6}[\-_\s]?\d{3}/g,
  bfRegex: /(BF|bf)[\-_\s]?\d{3}/g,
};

const defaultNameRegex = /[A-Za-z]{3,4}[-,\ \.]?\d{3}/g;
const extRegex =  /\.(avi|mp4|mkv|wmv)/g;

const overOneMatched = [];
const matched = [];
const notMatched = [];

function matchRegexes(filename, regexes) {
  const results = [];
  Object.keys(regexes).forEach((key) => {
    const regex = regexes[key];
    const result = filename.match(regex);
    if (result) {
      results.push({
        key,
        result,
      });
    }
  });
  return results;
}

function saveResults(filename, results) {
  if (results.length > 0) {
    if (results.length > 1) {
      overOneMatched.push({
        filename,
        results,
      });
    } else {
      matched.push({
        filename,
        results,
      });
    }
  }
}

function filterFilename(filename) {
  return filename.replace(/\s/g, '').replace('\u2014', '-');
}

filenames.forEach((filename) => {
  const filteredFilename = filterFilename(filename);
  const results = matchRegexes(filteredFilename, uniqueRegexes);
  if (!results.length) {
    const defaultResults = matchRegexes(filteredFilename, [defaultNameRegex]);
    if (!defaultResults.length) {
      notMatched.push(filename);
    } else {
      saveResults(filename, defaultResults);
    }
  } else {
    saveResults(filename, results);
  }

});

console.log('overOneMatched', overOneMatched);
console.log('matched', matched);
console.log('notMatched', notMatched);
fs.writeFileSync('./results.json', JSON.stringify({
  overOneMatched,
  matched,
  notMatched,
}));
