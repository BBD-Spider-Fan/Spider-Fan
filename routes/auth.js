const express = require('express');
const pool = require("../db");
const router = express.Router();

router.get('/', function (req, res, next) {
    console.log(req.body);
});


module.exports = router;
