const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        // required: true,
      },
    lastvisited: {
        type: String,
        // required: true
    }

}, {
    timestamps: true
});

const Domainlist = mongoose.model('Domainlist', domainSchema);
module.exports = Domainlist;