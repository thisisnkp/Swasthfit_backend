const express = require('express');
const router = express.Router();
const { Payout } = require('./Payout/payout.controller');
const NotifyController = require('./Notifier/notifier.controller');


// Payout API route
router.post('/payout/:partnerRefAuthId', Payout);
router.post('/lead-notifier/:leadId', NotifyController.notifyLead);


module.exports = router;




// module.exports = router;





// const loginMiddleware = require("../../login.middleware");

// const express = require("express");
// const router = express.Router();
// const { Payout } = require("./payout.controller");

// router.post('/:partner_refauthid', Payout);

// module.exports = router;


// http://localhost:4001/insurance/site/apis/:partnerRefAuthId