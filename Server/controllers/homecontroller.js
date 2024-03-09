const color = require('colors');
const { python } = require('compile-run');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Domainlist = require('../models/domain');

module.exports.home = async (req, res) => {
  return res.render('try')
}
module.exports.domainlist = async (req, res) => {
  console.log(req.params.id)
  if(req.params.id == "ALL"){
    let dlist = await Domainlist.find().sort({ domain: 1 });
    return res.render('nextPage', {
      dlist
    })
  }
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
function removeUniqueTerms(arr) {
  // Count occurrences of each term
  
  const termCounts = arr.reduce((counts, term) => {
    counts[term] = (counts[term] || 0) + 1;
    return counts;
  }, {});

  // Filter out terms with more than one occurrence
  const uniqueTerms = Object.keys(termCounts).filter(term => termCounts[term] > 1);

  return uniqueTerms;
}
const containsWordToRemove = (sentence) => {
  const wordsToRemove = ["Sign", "Windows", "in", "00", "Mega Fashion Days", "x", "About this item", "Get it"];
  for (let word of wordsToRemove) {
    if (sentence.toLowerCase().includes(word.toLowerCase())) {
      return true;
    }
  }
  return false;
};
module.exports.websitesearch = async (req, res) => {
  try {
    console.log(req.body.domain);
    let x = req.body.websitebody;
    let y = [];
    let adddomain = req.body.domain;
    let checkweb = await Domainlist.findOne({ domain: adddomain });
    console.log(adddomain);
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
      let z = x[i].replace(/₹[\d,.]+/g, '').replace(/\.\s/g, '').replace('₹', '').replace('.', '').replace(/"/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\b0\b/g, "");;
      if (z) {
        y.push(z + '.');
      }
    }
    const arrayString = y.join('\n');
    // console.log(arrayString)
    fs.writeFileSync('./scripts/input_paragraph.txt', arrayString);
    const { stdout, stderr } = await exec('python ./scripts/distillbert.py');
    // const { stdout1, stderr1 } = await exec('python ./scripts/distillbert.py');
    // console.log('Python script output:', stdout);
    if (stderr) {
      console.error('Error in Python script:', stderr);
    }
    var sen, con1;
    fs.readFile('./scripts/sentences1.txt', (err, data) => {
      if (err) throw err;
      sen = data.toString();
      fs.readFile('./scripts/categories1.txt', (err, datas) => {
        if (err) throw err;


        con1 = datas.toString();
        // con2 = datas1.toString();
        let lines = sen.split('\n').map(line => line.trim());
        let lines1 = con1.split('\n').map(line => line.trim());
        // const lines2 = con2.split('\n').map(line => line.trim());
        // console.log(lines1);
        // const filteredTerms = removeUniqueTerms(lines2);
        // console.log(filteredTerms)
        // let fins = '';
        // for (let i = 0; i < filteredTerms; i++) {
        //   fins = fins + filteredTerms[i];
        // }
        
        lines = lines.filter(sentence => !containsWordToRemove(sentence));


        let da = {
          title: lines,
          content: lines1
        };
        return res.status(200).json(da);
      });
    });


  } catch (error) {
    console.log(error);
  }
};


