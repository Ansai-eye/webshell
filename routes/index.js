const express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { exec } = require('child_process');
const { promisify } = require('util');
const promiseExec = promisify(exec);
const readline = require('readline');

/*
* 按行读取文件内容
* 返回：字符串数组
* 参数：fReadName:文件名路径
*      callback:回调函数
* */
function readFileToArr (fReadName, callback) {
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input: fRead
    });
    var arr = new Array();
    objReadline.on('line', function (line) {
        arr.push(line);
        //console.log('line:'+ line);
    });
    objReadline.on('close', function () {
        // console.log(arr);
        callback(arr);
    });
}

router.get('/cwd', function (req, res) {
    const { pid } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.success(cwd);
    });
});
router.post('/upload', upload.single('file'), function (req, res) {
    var des_file = "uploads/" + req.file.originalname;
    fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: "File upload success",
                    filename: req.file.originalname
                };
            }
        });
        console.log('文件写入完成============================================================');
        // 写入成功后读取和执行脚本文件
        fs.readFile(des_file, 'utf-8', function (err, data) {
            res.success(data);
        });
    });
});

module.exports = router;
