var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

const ext = '.jpeg'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: async function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

const upload = multer({ storage: storage })

router.post('/', upload.any(), function (req, res, next) {
  res.send('ok')
})

module.exports = router;
