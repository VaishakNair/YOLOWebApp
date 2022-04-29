const http = require('http');

const hostname = 'localhost';
const port = 3000;

const { exec } = require("child_process");

const server = http.createServer((req, res) => {



exec("python /home/vaishak/Coder/AgricultureProject/YOLOTensorFlowConverter/tensorflow-yolov4-tflite/detect.py --weights /home/vaishak/Coder/AgricultureProject/YOLOTensorFlowConverter/tensorflow-yolov4-tflite/checkpoints/tomato-416.tflite --size 416 --model yolov4 --images /home/vaishak/Coder/AgricultureProject/YOLOTensorFlowConverter/tensorflow-yolov4-tflite/data/images/1.jpeg --framework tflite -dont_show", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        const regex = /Tomato/g;
        const found = stderr.match(regex);
        console.log(`Tomato count: ${found.length}`);
        // console.log(`stderr: ${stderr}`);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'text/html');
         res.end(`<h1>Tomato count: ${found.length}</h1>`);
        return;
    }
    
  
    
    console.log(`stdout: ${stdout}`);
});


  //res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  //res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
