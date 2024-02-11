const color = require('colors');
const { python } = require('compile-run');




// Function to read file asynchronously and store each line in an array
async function readFileAndStoreToArray(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');

    // Split file content by newline
    const lines = data.split('\n');

    // Initialize an array to store each line
    const dataArray = [];

    // Push each line into the dataArray
    lines.forEach(line => {
      dataArray.push(line.trim());
    });

    return dataArray;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err; // re-throw the error for handling it at higher level
  }
}


const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
async function readTextFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.trim());
    return lines;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}
module.exports.websitesearch = async (req, res) => {
  try {
    let x = req.body.websitebody;
    let y = [];
    for (let i = 0; i < x.length; i++) {
      let z = x[i].replace(/₹[\d,.]+/g, '').replace(/\.\s/g, '').replace('₹', '').replace('.', '');
      if (z) {
        y.push(z + '.');
      }
    }
    const arrayString = y.join('\n');
    fs.writeFileSync('./scripts/input_paragraph.txt', arrayString);
    // python.runFile('./scripts/random_forest.py', {
    //   executionPath: 'python'
    // }, (err, result) => console.log(err ? err : result));
    const { stdout, stderr } = await exec('python ./scripts/random_categories.py');
    console.log('Python script output:', stdout);
    if (stderr) {
      console.error('Error in Python script:', stderr);
    }

    // let re = ['Subscribe & Save', 'Toys & Games']
    const fsPromises = require('fs').promises;
    var sen, con;
    fs.readFile('./scripts/sentences.txt', (err, data) => {
      if (err) throw err;
      
      // console.log(data.toString());
      sen = data.toString();
      fs.readFile('./scripts/categories.txt', (err, datas) => {
        if (err) throw err;
        
        con = datas.toString;
        const lines = sen.split('\n').map(line => line.trim());
        console.log(lines);
        let da = {
          title: lines,
          content: con
        };
        // console.log(con);
        console.log(da);
        return res.status(200).json(lines);
      });
    });
    // const data = await fsPromises.readFile('./scripts/sentences.txt')
    //   .catch((err) => console.error('Failed to read file', err));
    //   console.log(data);

    // const lines = await readTextFile('./scripts/sentences.txt');
    // console.log(lines);
    // const sen = await fs.readFile('./scripts/sentences.txt', 'utf8');
    // const con = await fs.readFile('/Server/scripts/categories.txt', 'utf8');
    // let da = { 
    //     title: sen,
    //     content: con
    // };

  } catch (error) {
    console.log(error);
  }
};

