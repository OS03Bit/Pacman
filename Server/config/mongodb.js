const mongoose = require('mongoose');
const express = require("express");

const uri = "mongodb+srv://omsinkar03bit:FhFG0TKecXtJCyhS@cluster1.hqfpzej.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false);

const start = async() => {
    try{
        await mongoose.connect(uri);
    }
    catch (err) {
        console.log("Mongoose: ",err); 
    }
}
start()