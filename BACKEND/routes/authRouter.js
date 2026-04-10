const express = require('express');
const authController = require('../authController/authController');
const validateToken = require('../middlewares/validateToken');
const router = (express.Router());
const validateRole = require('../middlewares/validateRole');
const PDFauthController = require('../authController/authPDFController');


router.post('/register',  authController.userRegister)
router.post('/admin-register', authController.adminRegister)
router.post('/admin-login', authController.adminLogin)
router.get('/logout', authController.Logout)
router.get('/refresh', authController.refreshToken)


router.get('/get-all-trianees', validateToken, validateRole("Admin"), authController.getallTrainees)
router.get('/get-one-trainee/:traineeId', validateToken, validateRole("Admin"), authController.getOneTrainee)
router.delete('/delete-trainee/:traineeId', validateToken, validateRole("Admin"), authController.deleteTrianee)
router.get('/download-trainees-pdf', validateToken, validateRole("Admin"), PDFauthController.downloadTraineesPdf)
router.get('/download-one-trainee-pdf/:traineeId' , validateToken, validateRole("Admin"), PDFauthController.downloadOneTraineePdf)



module.exports = router;