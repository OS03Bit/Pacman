const express = require('express');
const HomeController = require('../controllers/homecontroller');

const router  = express.Router()

router.post("/websitesearch", HomeController.websitesearch);

module.exports = router;