const USER = require("../modals/userModal");
const EMAIL = require("../modals/emailModel");
const { setUserSocketID } = require("../config/globalState");

const messages = {
  SHOW_ALL_INBOX: "SHOW_ALL_INBOX",
  SHOW_ALL_STARRED: "SHOW_ALL_STARRED",
  SHOW_ALL_SENT: "SHOW_ALL_SENT",
  SHOW_ALL_ARCHIVED: "SHOW_ALL_ARCHIVED",
  GLOBAL_SEARCH_QUERY: "GLOBAL_SEARCH_QUERY",
};
const filterEmailAccordingToFilterkey = ({
  emails: allEmails,
  filterkey: filterkey,
  email: userEmail,
  globalQuery: globalQuery = "",
}) => {
  const emails = [];

  switch (filterkey) {
    case messages.SHOW_ALL_INBOX:
      for (const em of allEmails) {
        const isArchived = em.archivedBy.includes(userEmail);
        if (em.recipients.includes(userEmail) && !isArchived) {
          emails.push(em);
        }
      }
      return emails;
    case messages.SHOW_ALL_SENT:
      console.log("userEmail", userEmail);
      console.log("allEmails", allEmails);

      for (const em of allEmails) {
        const isDeletedBySender = em.deletedBySender;
        const isArchived = em.archivedBy.includes(userEmail);
        if (
          em.sender.email === userEmail &&
          !isArchived &&
          !isDeletedBySender
        ) {
          emails.push(em);
        }
      }
      return emails;

    case messages.SHOW_ALL_STARRED:
      for (const em of allEmails) {
        const isArchived = em.archivedBy.includes(userEmail);
        if (em.starredBy.includes(userEmail) && !isArchived) {
          emails.push(em);
        }
      }
      return emails;
    case messages.SHOW_ALL_ARCHIVED:
      for (const em of allEmails) {
        if (em.archivedBy.includes(userEmail)) {
          emails.push(em);
        }
      }
      return emails;
    case messages.GLOBAL_SEARCH_QUERY:
      for (const em of allEmails) {
        const isArchived = em.archivedBy.includes(userEmail);
        if (em.sender.email.includes(globalQuery) && !isArchived) {
          emails.push(em);
        }
      }
      return emails;

    default:
      return emails;
  }
};
exports.configureUser = async (req, res) => {
  const { name, email, globalQuery } = req.body || {};
  // const socketId = req.get("Socket_id");
  const filterkey = req.get("Filterkey");
  try {
    // setUserSocketID(email, socketId);
    let user;
    let isNew = false;

    user = await USER.findOne({ email: email });
    if (!user) {
      isNew = true;
      user = await USER.create({ name, email });
    }

    const emails = await EMAIL.find({
      $or: [{ "sender.email": email }, { recipients: email }],
    }).populate({
      path: "sender",
      select: "-password -isDarkTheme -createdAT -__v",
    });

    const filteredEmails = filterEmailAccordingToFilterkey({
      emails,
      filterkey,
      email,
      globalQuery,
    });

    res.status(200).json({
      success: true,
      response: {
        _id: user._id,
        emailContent: (filteredEmails || []).reverse(),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = req.body;
    const newUser = await USER.create(user);
    res.status(200).json({
      success: true,
      response: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, key, value } = req.body;

    await USER.findByIdAndUpdate(
      id,
      {
        [key]: value,
      },
      { new: "true" }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const { id, email, password, type, username, picture } = req.body;
    let user = {};
    switch (type) {
      case "AUTHORIZE":
        if (id === "NONE") {
          user = {};
          break;
        }
        user = await USER.findById(id).select("-password");
        break;
      case "SIGN-IN":
        // user = await USER.findOne({ email, password });
        user = await USER.findByCredentials(email, password);
        break;
      case "GET-BY-EMAIL":
        user = await USER.findOne({ email }).select("-password");
        break;
      case "SIGN-UP":
        user = (await USER.create({ email, password, username })).toObject();
        break;
      case "GOOGLE_LOGIN":
        const response = await USER.findOne({ email })?.select("-password");
        if (!response?._id) {
          user = (
            await USER.create({
              email,
              password,
              username,
              picture,
            })
          ).toObject();
        } else user = response;
        break;
      default:
        break;
    }
    if (user?.password) delete user.password;

    res.status(200).json({
      success: true,
      response: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
