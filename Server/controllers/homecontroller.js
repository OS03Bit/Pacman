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
module.exports.websitesearch = async (req, res) => {
    try {
        let x = req.body.websitebody;
        let y = [];
        for (let i = 0; i<x.length; i++) {
            let z = x[i].replace(/₹[\d,.]+/g, '').replace(/\.\s/g, '').replace('₹', '').replace('.', '');
            if(z){
                y.push(z + '.') ;
            }
        }
        const arrayString = y.join('\n');
        fs.writeFileSync('example.txt',arrayString);
        python.runFile('./scripts/random_forest.py', {
            executionPath: 'python3'
        }, (err, result) => console.log(err ? err : result));
        let re = ['Subscribe & Save', 'Toys & Games']
        const sen = await readFileAndStoreToArray('../scripts/sentences.csv');
        const con = await readFileAndStoreToArray('../scripts/categories.txt');
        let da = { 
            title: sen,
            content: con
        };
        
        return res.status(200).json(da);
    } catch (error) {
        console.log(error);
    }
};

