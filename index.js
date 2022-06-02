const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/v1", require("./api/v1/index"));
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
