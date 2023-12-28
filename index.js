const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
let temp;
//connect database
let data = connectDatabase();
data.then((res) => {
  temp = res;
});

app.get("/", (req, res) => {
  res.send({ success: true, msg: "base route", temp });
});

app.listen(4000, () => {
  console.log(`server is running at  http://localhost:${4000}`);
});
