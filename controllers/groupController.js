const { info } = require("better-console");
const { io } = require("../app");
const GROUP = require("../modals/groupModel");
const { getUserSocketId } = require("../config/globalState");
const cloudinary = require("cloudinary").v2;

const config = {
  cloud_name: process.env.CLOUDNERY_CLOUD_NAME,
  api_key: process.env.CLOUDNERY_API_KEY,
  api_secret: process.env.CLOUDNERY_API_SECRET,
};
cloudinary.config(config);

exports.createGroup = async (req, res) => {
  try {
    const newGroup = await GROUP.create(req.body);
    const populatedGroup = await GROUP.findById(newGroup._id).populate({
      path: "members",
      select: "-password",
    });
    for (const member of newGroup.members) {
      const user_socket =
        member._id.toString() === newGroup.createdBy.toString()
          ? null
          : getUserSocketId(member._id);
      if (user_socket)
        io.to(user_socket).emit("U_GOT_ADDED_IN_A_GROUP", populatedGroup);
    }
    res.status(200).send({ success: true, response: populatedGroup });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await GROUP.findByIdAndDelete(id);
    res.status(200).send({ success: true });
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
exports.updateOneGroup = async (req, res) => {
  try {
    const { type, group_id, member_id, newMembers } = req.body;
    const group = await GROUP.findById(group_id);
    switch (type) {
      case "MAKE_ADMIN":
        group.admins.push(member_id);
        break;
      case "REVOKE_ADMIN":
        group.admins = group.admins.filter((a) => {
          return a !== member_id;
        });
        break;
      case "DELETE_GROUP":
        const g = await GROUP.findByIdAndDelete(group_id);
        handleDeleteGroup(g);
        res.status(200).send({ success: true });
        return;

      case "REMOVE_MEMBER":
        group.members = group.members.filter((m) => m.toString() !== member_id);
        break;
      case "LEAVE_GROUP":
        group.members = group.members.filter((m) => m.toString() !== member_id);
        break;
      case "ADD_MEMBERS":
        group.members = Array.from(new Set(group.members.concat(newMembers)));
        break;

      default:
        break;
    }

    await group.save();
    if (group.members.length === 0) GROUP.findByIdAndDelete(group._id);
    res.status(200).send({ success: true, group });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

function handleDeleteGroup(group) {
  info(group);
  io.to(group._id.toString()).emit("GROUP_DELETED_BY_ADMIN", {
    group_id: group._id,
  });
}

exports.getAllGroupsOfUser = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const group = await GROUP.find({ members: { $in: [user_id] } }).populate({
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

exports.saveGroupMessage = async (req, res) => {
  try {
    const { group_id, message } = req.body;
    console.table({ group_id, message });
    const group = await GROUP.findById(group_id);
    group.messages.push({ ...message, timestamp: new Date().getTime() });
    await group.save();
    io.to(group_id).emit("NEW_GROUP_MESSAGE", { group_id, message });
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.deleteSingleMessage = async (req, res) => {
  const { group_id, message_id } = req.body;
  info({ group_id, message_id });

  try {
    const group = await GROUP.findById(group_id);

    const messageindex = group.messages.findIndex((m) => m._id === message_id);
    const perMessage = group.messages.find((m) => m._id === message_id);

    if (perMessage.image) {
      deleteMessageImage(perMessage.image);
    }
    group.messages.splice(messageindex, 1);
    await group.save();

    io.to(group_id).emit("GROUP_MESSAGE_DELETED", {
      group_id,
      message_id,
      from: perMessage.from,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
async function deleteMessageImage(imageUrl) {
  const public_id = imageUrl.match(/\/([^/]+)\.[a-z]+$/)?.[1];
  if (!public_id) return;

  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
      console.log(
        `Image with public_id ${public_id} has been deleted from Cloudinary.`
      );
    }
  });
}
