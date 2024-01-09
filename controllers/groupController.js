const GROUP = require("../modals/groupModel");

exports.createGroup = async (req, res) => {
  try {
    const newgroup = await GROUP.create(req.body);
    await newgroup.save();
    res.status(200).send({ success: true, response: newgroup });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getOneGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await GROUP.findById(id).populate({
      path: "members",
      select: "-password",
    });
    res.status(200).send({ success: true, response: group });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getAllGroupsOfUser = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const group = await GROUP.find({ members: { $in: [user_id] } });
    res.status(200).send({ success: true, response: group });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.saveGroupMessage = async (req, res) => {
  try {
    const { group_id, message } = req.body;
    console.table({ group_id, message });
    const group = await GROUP.findById(group_id);
    group.messages.push({ ...message, timestamp: new Date().getTime() });
    await group.save();
    res.status(200).send({ success: true, response: group });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
