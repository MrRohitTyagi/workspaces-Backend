let globalVariable = {};

function getUserSocketId(email) {
  return globalVariable[email];
}

function setUserSocketID(email, id) {
  globalVariable[email] = id;
}
function getGlobalObj() {
  return globalVariable;
}

module.exports = {
  getUserSocketId,
  setUserSocketID,
  getGlobalObj,
};
