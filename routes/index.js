const express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { exec } = require('child_process');
const { promisify } = require('util');

const promiseExec = promisify(exec);

router.get('/cwd', function (req, res) {
    const { pid } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.success(cwd);
    });
});
router.get('/upload', upload.any(), function (req, res) {
    var des_file = __dirname + "/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: "File upload success",
                    filename: req.files[0].originalname
                };
            }
            console.log(response);
            res.send(JSON.stringify(response));
        })
    });
});

module.exports = router;
