const express = require('express');
const HomeController = require('../controllers/homecontroller');

const router  = express.Router()

router.get("/", HomeController.home);
router.get("/domainlist/:id", HomeController.domainlist);
router.get("/alldomainlist", HomeController.alldomainlist);
router.post("/websitesearch", HomeController.websitesearch);

module.exports = router;