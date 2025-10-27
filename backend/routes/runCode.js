const express=require('express');
const { runCode } = require('../controllers/runCodeController');
const router=express.Router();


router.post('/',runCode);



module.exports=router;