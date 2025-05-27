const express = require('express');
const { registration, gymsList } = require('./gym.controller');
const upload = require('./upload.middleware');
const loginAccess = require('../../login.middleware');
const router = express.Router();

const uploadFiles = upload.fields([
    { name: 'gym_logo', maxCount: 1 },
    { name: 'profile_photo', maxCount: 1 },
    { name: 'cancel_cheque_photo', maxCount: 1 },
    { name: 'gst_photo', maxCount: 1 },
    { name: 'msme_certificate_photo', maxCount: 1 },
    { name: 'shop_certificate_photo', maxCount: 1 },
]);
router.post('/registration', uploadFiles, registration);
router.get('/gyms-list', loginAccess(), gymsList);

module.exports = router;

