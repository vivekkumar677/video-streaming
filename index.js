const express = require("express");
const app = express();
const fs = require("fs");

const PORT = "3000";

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", function(req,res) {
    const range = req.headers.range;
    if(!range) {
        res.status(400).send("Need range headers");
    }

    const videoPath = "shivji.mp4";
    const videoSize = fs.statSync("shivji.mp4").size;

    const video_size = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.max(start + video_size, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type" : "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(PORT, function() {
    console.log("Listening on port", PORT);
});