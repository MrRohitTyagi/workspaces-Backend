let globalVariable = {};

function getUserSocketId(key) {
  return globalVariable[key];
}

function setUserSocketID(key, id) {
  globalVariable[key] = id;
  console.table(globalVariable);
}
function getGlobalObj() {
  return globalVariable;
}

module.exports = {
  getUserSocketId,
  setUserSocketID,
  getGlobalObj,
};
