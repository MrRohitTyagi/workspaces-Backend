const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
//connect database
connectDatabase();

app.listen(4000, () => {
  console.log(`server is running at  http://localhost:${4000}`);
});
