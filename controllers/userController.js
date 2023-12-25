const USER = require("../modals/userModal");
const EMAIL = require("../modals/emailModel");
//create product -- admin

exports.configureUser = async (req, res) => {
  const { name, email } = req.body || {};
  console.log({ name, email });
  try {
    let user;
    let isNew = false;

    user = await USER.findOne({ email: email });
    if (!user) {
      isNew = true;
      user = await USER.create({ name, email });
    }

    const emails = await EMAIL.find({
      $or: [{ sender: email }, { recipients: email }],
    });

    res.status(200).json({
      success: true,
      response: { _id: user._id, emailContent: emails || [] },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
