const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const axios = require("axios");
const R = require("ramda");
const csvConverter = require("json-2-csv");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `${config.investmentsServiceUrl}/investments/${id}`
    );
    res.send(response.data[0]);
  } catch (err) {
    console.error("Error retrieving investments", err);
    res.status(500).send({
      message: err.message,
    });
  }
});

app.get("/report", async (req, res) => {
  try {
    const [investments, companies] = await axios.all([
      axios.get(`${config.investmentsServiceUrl}/investments`),
      axios.get(`${config.financialCompaniesServiceUrl}/companies`),
    ]);

    if (!investments || !companies) {
      throw new Error();
    }

    // create blank report
    let report = [];

    // add data
    R.forEach((investment) => {
      R.forEach((holding) => {
        // find the company name matching the holding id
        const company = companies.data.filter((comp) => comp.id === holding.id);

        report.push({
          User: investment.userId,
          "First Name": investment.firstName,
          "Last Name": investment.lastName,
          Date: investment.date,
          Holding: company[0].name,
          Value: holding.investmentPercentage * investment.investmentTotal,
        });
      }, investment.holdings);
    }, investments.data);

    // convert json to csv
    const csv = await csvConverter.json2csv(report);

    // wrap csv in new json object
    const csvJsonExport = { csv: `'${csv}'` };

    // send to /export endpoint
    await axios.post(
      `${config.investmentsServiceUrl}/investments/export`,
      csvJsonExport,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.send("Report successfully generated");
  } catch (err) {
    console.error("Error generating report", err);
    res.status(500).send({
      message: err.message,
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
