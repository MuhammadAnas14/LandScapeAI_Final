const express = require('express')
const router  = express.Router();

const {Generate, getImagesByUser, feedbackbyUser, DeleteImage} = require('../Controllers/GenerateImages');

router.post("/Generate", Generate);
router.get('/getImages/:userId', getImagesByUser);
router.put('/feedback',feedbackbyUser)
router.delete('/delete/:imageId',DeleteImage)

module.exports = router;