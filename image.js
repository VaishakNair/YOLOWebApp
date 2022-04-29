const express = require('express');
const app = express();

const fs = require('fs');

const { exec } = require("child_process");

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
            console.log(`error: ${error.message}`);
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


app.listen(3000, () => console.log('Listening on port 3000'));