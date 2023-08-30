const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const axios = require("axios");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `${config.investmentsServiceUrl}/investments/${id}`
    );
    res.send(response.data[0]);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
