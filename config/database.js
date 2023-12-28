const mongoose = require("mongoose");

const connectDatabase = async () => {
  let dataa;
  await mongoose
    .connect(process.env.MONGO_STRING)
    .then((data) => {
      console.log(`MondoDB connected with server ${data.connection.host}`);
      dataa = data.connection.host;
    })
    .catch((err) => {
      console.log(err);
    });
  return dataa;
};

module.exports = connectDatabase;
