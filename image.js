const express = require('express');
const app = express();

const fs = require('fs');

var busboy = require("busboy");

const { exec } = require("child_process");

// var upload_video = require("./video_upload.js");

// var bodyParser = require("body-parser")
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.raw({ limit: '50mb' })) // for parsing raw request body

app.get('/', (req, res) => {
    res.send('Home of Tomato Counter. Welcome!');
});

app.post('/api/image', (req, res) => {

    // By using the 'express.raw()' middleware, we have
    // converted 'req.body' to a buffer containing the image data in
    // 'application/octet-stream' content type.

    // Dump the image in the request body to a file:
    const path = './temp/11.jpeg';
    fs.createWriteStream(path).write(req.body);

    const cropName = req.query.crop;
    console.log(`Crop: ${cropName}`);

    exec(`python /home/vaishak/Coder/AgricultureProject/YOLOTensorFlowConverter/tensorflow-yolov4-tflite/detect.py --weights /home/vaishak/Coder/AgricultureProject/YOLOTensorFlowConverter/tensorflow-yolov4-tflite/checkpoints/${cropName}-416.tflite --size 416 --model yolov4 --images ${path} --framework tflite -dont_show`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.name} --> ${error.message}`);
            return;
        }
        if (stderr) {
            const regex = /Tomato/g;
            const found = stderr.match(regex);
            if (found) { // At least one tomato was found in the input image:
                console.log(`Tomato count: ${found.length}`);
                // console.log(`stderr: ${stderr}`);
                res.json({ count: found.length });
                //  res.statusCode = 200;
                //  res.setHeader('Content-Type', 'text/html');
                //  res.end(`<h1>Tomato count: ${found.length}</h1>`);
            }
            else { // No tomatoes were found in the input image:
                res.json({ tomatoCount: 0 })
            }
            return;
        }



        console.log(`stdout: ${stdout}`);
    });



});


app.post("/api/video_upload", function (req, res) {
    
   
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
    //   const saveTo = path.join('./temp', `busboy-upload-${random()}`);
      console.log('Saving file...', name);
      const saveTo = './temp/video.mp4'
      file.pipe(fs.createWriteStream(saveTo));
      console.log('File saved.');
    });
    bb.on('close', () => {
    //   res.writeHead(200, { 'Connection': 'close' });
      res.json({message: 'Video uploaded'});
    });
    req.pipe(bb);
    return;
});


app.get("/api/get_count", function (req, res) {
  // TODO

  const path = './temp/video.mp4';
  const outputPath = './temp/out.avi';

  const cropName = req.query.crop;
  console.log(`Crop: ${cropName}`);

  exec(`python /home/vaishak/Coder/AgricultureProject/yolov4-deepsort/object_tracker.py --video ${path} --output ${outputPath} --model yolov4 --framework tflite --weights /home/vaishak/Coder/AgricultureProject/YOLOTensorFlowConverter/tensorflow-yolov4-tflite/checkpoints/${cropName}-416.tflite --info --dont_show | grep 'Tracker ID:' | tail -1 | grep -iPo "(?<=Tracker ID: )\\d+(?=,)"`, (error, stdout, stderr) => {
    
    console.log(`stdout: ${stdout}`);
   
    
    if (error) {
          console.log(`error: ${error.name} --> ${error.message}`);
          res.json({ message: 0 });
          return;
      }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        // if (true) { // At least one tomato was found in the input image:
            
        //     // console.log(`stderr: ${stderr}`);
        //     res.json({ message: stderr });
        //     //  res.statusCode = 200;
        //     //  res.setHeader('Content-Type', 'text/html');
        //     //  res.end(`<h1>Tomato count: ${found.length}</h1>`);
        // }
        // else { // No tomatoes were found in the input image:
        //     res.json({ message: 0 })
        // }
        res.json({ message: 0 })
        return;
    }

    if (stdout) {
        if (true) { // At least one tomato was found in the input image:
            
            // console.log(`stderr: ${stderr}`);
            res.json({ message: parseInt(stdout.trim()) });
            //  res.statusCode = 200;
            //  res.setHeader('Content-Type', 'text/html');
            //  res.end(`<h1>Tomato count: ${found.length}</h1>`);
        }
        else { // No tomatoes were found in the input image:
            res.json({ message: 0 })
        }
        return;
    }



     
  });

  
});

app.listen(3000, () => console.log('Listening on port 3000'));