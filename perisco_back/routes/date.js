const express = require('express');
const router = express.Router();
const dateCtrl = require('../controllers/date');
const auth = require('../middleware/auth')

router.post('/inscription',auth, dateCtrl.inscription); //C
router.get('/getonereservation', auth, dateCtrl.getonereservation); //R


module.exports = router;