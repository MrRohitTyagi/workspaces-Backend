const USER = require("../modals/userModal");
const EMAIL = require("../modals/emailModel");
const { setUserSocketID } = require("../config/globalState");

exports.configureUser = async (req, res) => {
  const { name, email, globalQuery } = req.body || {};
  const socketId = req.get("Socket_id");
  const filterkey = req.get("Filterkey");
  try {
    setUserSocketID(email, socketId);
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

    const filteredEmails = filterEmailAccordingToFilterkey(
      emails,
      filterkey,
      email,
      globalQuery
    );

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
const messages = {
  SHOW_ALL_INBOX: "SHOW_ALL_INBOX",
  SHOW_ALL_STARRED: "SHOW_ALL_STARRED",
  SHOW_ALL_SENT: "SHOW_ALL_SENT",
  SHOW_ALL_ARCHIVED: "SHOW_ALL_ARCHIVED",
  GLOBAL_SEARCH_QUERY: "GLOBAL_SEARCH_QUERY",
};

const filterEmailAccordingToFilterkey = (
  allEmails,
  filterkey,
  userEmail,
  globalQuery = ""
) => {
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
      for (const em of allEmails) {
        const isDeletedBySender = em.deletedBySender;
        const isArchived = em.archivedBy.includes(userEmail);
        if (em.sender === userEmail && !isArchived && !isDeletedBySender) {
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
        if (em.sender.includes(globalQuery) && !isArchived) {
          emails.push(em);
        }
      }
      return emails;

    default:
      return emails;
  }
};
