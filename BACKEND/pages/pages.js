
const express = require('express');
const validateToken = require('../middlewares/validateToken')
const pageRouter = (express.Router())

pageRouter.get('/admin-dashboard', validateToken, (req, res) => {

})