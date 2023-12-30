const { httpServer } = require("./app");
const connectDatabase = require("./config/database");
//connect database
connectDatabase();

httpServer.listen(4000, () => {
  console.log(`server is running at  http://localhost:${4000}`);
});
