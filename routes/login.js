const router = require("express").Router();
const mongoose = require('mongoose');
const path = require('path');

//view page
router.get("/", async (req, res) => {
    res.render('pages/login');
});
