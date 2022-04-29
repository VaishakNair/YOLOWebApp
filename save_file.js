const express = require('express');
const app = express();
const fs = require('fs');

var busboy = require("busboy");

app.post("/video_upload", function (req, res) {
   

    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
    //   const saveTo = path.join('./temp', `busboy-upload-${random()}`);
      const saveTo = './temp/video.mp4'
      file.pipe(fs.createWriteStream(saveTo));
    });
    bb.on('close', () => {
      res.writeHead(200, { 'Connection': 'close' });
      res.end(`That's all folks!`);
    });
    req.pipe(bb);
    return;
 
});

app.listen(3000, () => console.log('Listening on port 3000'));