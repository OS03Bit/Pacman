const color = require('colors');

module.exports.websitesearch = async (req, res) => {
    try {
        console.log("Hi server running.")
      return res.status(200).json();
    } catch (error) {
        console.log(error);
    }
};