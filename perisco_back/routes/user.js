const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);                    //C
router.post('/login', userCtrl.login);                      //R
router.get('/getoneprofil', auth, userCtrl.getoneprofil)    //R  
router.get('/getAllProfile', userCtrl.getAllProfile)  //R
router.put('/update', auth, userCtrl.update)                //U
router.delete('/delete', auth, userCtrl.delete)             //D

module.exports = router;