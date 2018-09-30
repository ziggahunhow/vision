require("dotenv").config();
const express = require("express");
const vision = require("@google-cloud/vision");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const client = new vision.ImageAnnotatorClient({
  keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "test_images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

//app config
app.use(bodyParser.json());
app.use(cors());

const getVision = (imageObj, res) => {
  try {
    const image = imageObj.photo;
    var data = [];
    client
      .labelDetection(image)
      .then(results => {
        const labels = results[0].labelAnnotations;
        labels.forEach(label => {
          data = data.concat(label.description);
        });
        res.send({ labels: data });
      })
      .catch(err => console.log(err));
    return data;
  } catch (err) {
    res.status(500).send(err);
  }
};

app.post("/", upload.single("photo"), (req, res) => {
  const img = { photo: "./" + req.file.destination + req.file.originalname };
  getVision(img, res);
  fs.unlink(img.photo, err => {
    if (err) throw err;
    console.log("successfully deleted img from local dir");
  });
});

app.listen(process.env.PORT || 8081, () => {
  console.log("express running on port " + process.env.PORT);
});
