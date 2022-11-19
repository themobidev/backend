const express = require("express");
const cors = require("cors");
require('dotenv').config();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const port = process.env.PORT || 8081;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



async function generateImage(prompt){
  const response = await fetch(`https://api.openai.com/v1/images/generations`, {
    method : "POST",
    headers : {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 2,
      size: "1024x1024",
    })
  });
  const data = await response.json();
  console.log(data);
  return data;
}


// generateImage("cat");


//Load images for pseudo database
const images = require("./data/images.json").images;

//Enable cors
app.use(cors());

//Get all orders to test test api
app.get("/api/images", (req, res) => res.json(images));

//Get orders by ID
app.post('/api/generate', function requestHandler(req, res) {
  const body = req.body;
  if(body.prompt && body.prompt != ""){
    generateImage(body.prompt).then((response) => {
      res.json(response);
    })
  }
});

app.listen(port, () =>
  console.log(`Images microservice listening on port ${port}!`)
);