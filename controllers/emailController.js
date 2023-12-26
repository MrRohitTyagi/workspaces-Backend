const EMAIL = require("../modals/emailModel");
//create product -- admin

exports.createEmail = async (req, res) => {
  try {
    const newEmail = await EMAIL.create(req.body);

    res.status(200).json({
      success: true,
      response: newEmail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.deleteEmail = async (req, res) => {
  const id = req.params.id;
  const emailToRemove = req?.params?.email;
  try {
    const newEmail = await EMAIL.findByIdAndUpdate(
      id,
      { $pull: { recipients: emailToRemove } },
      { new: true }
    );
    if (newEmail.recipients.length === 0) {
      await EMAIL.findByIdAndDelete(newEmail._id);
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
