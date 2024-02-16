const color = require('colors');
const { python } = require('compile-run');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Domainlist = require('../models/domain');

module.exports.home = async (req, res) => {
  return res.render('index')
}
module.exports.domainlist = async (req, res) => {
  console.log(req.params.id)
  let search = (req.params.id).toLowerCase();
  let dlist = await Domainlist.find({
    domain: { $regex: new RegExp("^" + search) },
  }).limit(5);
  console.log(dlist);
  return res.render('nextPage', {
    dlist
  })
}
module.exports.alldomainlist = async (req, res) => {
  let dlist = await Domainlist.find();
  return res.render('nextPage', {
    dlist
  })
}

module.exports.websitesearch = async (req, res) => {
  try {
    console.log(req.body.domain);
    let x = req.body.websitebody;
    let y = [];
    let adddomain = req.body.domain;
    let checkweb = await Domainlist.findOne({ domain: adddomain });
    console.log(checkweb);
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
    const day = today.getDate();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const seconds = today.getSeconds().toString().padStart(2, '0');

    // Format the date and time as desired (e.g., YYYY-MM-DD HH:mm:ss)
    const formattedDateTime = `${year}-${month}-${day} (${hours}:${minutes}:${seconds})`;
    if (checkweb) {
      console.log("Exist in DB.")
      checkweb.lastvisited = formattedDateTime
      await checkweb.save();
    }
    else {
      console.log("Does not exist in DB.")
      await Domainlist.create({
        domain: adddomain,
        lastvisited: formattedDateTime
      })
    }
    for (let i = 0; i < x.length; i++) {
      let z = x[i].replace(/₹[\d,.]+/g, '').replace(/\.\s/g, '').replace('₹', '').replace('.', '');
      if (z) {
        y.push(z + '.');
      }
    }
    const arrayString = y.join('\n');
    // console.log(arrayString)
    fs.writeFileSync('./scripts/input_paragraph.txt', arrayString);
    const { stdout, stderr } = await exec('python ./scripts/random_categories.py');
    console.log('Python script output:', stdout);
    if (stderr) {
      console.error('Error in Python script:', stderr);
    }
    var sen, con;
    fs.readFile('./scripts/sentences.txt', (err, data) => {
      if (err) throw err;
      sen = data.toString();
      fs.readFile('./scripts/categories.txt', (err, datas) => {
        if (err) throw err;

        con = datas.toString;
        const lines = sen.split('\n').map(line => line.trim());
        // console.log(lines);
        let da = {
          title: lines,
          content: con
        };
        return res.status(200).json(lines);
      });
    });


  } catch (error) {
    console.log(error);
  }
};

