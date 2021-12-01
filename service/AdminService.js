var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');


function executeQuery(sql, callback) {
  console.log(util.format('%s: Executing SQL: %s', filename, sql));
  connection.query(sql, function (error, results) {
    if (error) {
      callback(error, results);
    } else {
      callback(error, results);
    }
  });
}

function executeSaveAndReturnSavedEntityQuery(sql, callback) {
  console.log(util.format('%s: Executing SQL: %s', filename, sql));
  connection.query(sql, function (error, results) {
    if (error) {
      callback(error, results);
    } else {
      returnById(results.insertId, callback);
    }
  });
}

function returnById(id, callback) {
  var sql = "SELECT * FROM admin_user WHERE Id = '%s'";
  sql = util.format(sql, id);
  executeQuery(sql, callback);
} 

function fetchAdminUser(fetchByCriteria, fetchByValue, callback) {
  var sql = getQueryForFetch(fetchByCriteria);
  var formattedSql = util.format(sql, fetchByValue);
  executeQuery(formattedSql, callback);
}

function getQueryForFetch(fetchByCriteria) {
  return util.format("SELECT * FROM `admin_user` WHERE `%s` = '%s'", fetchByCriteria);
}

function updateAdminUser(adminUser, callback) {
  var updateSql = getQueryForUpdate(adminUser);
  executeQuery(updateSql, callback);
}

function getQueryForUpdate(adminUser) {
  var updateAdminUserSql = "UPDATE admin_user SET name = '%s', login_id = '%s', password = '%s'WHERE id = '%s'";
  return util.format(updateAdminUserSql, adminUser.name, adminUser.loginId, adminUser.hashPassword, adminUser.id);
}

function saveAdminUser(adminUser, callback) {
  var saveAdminUserSql = getQueryForSave(adminUser);
  executeSaveAndReturnSavedEntityQuery(saveAdminUserSql, callback);
}

function getQueryForSave(adminUser) {
  var saveAdminUserSql = "INSERT INTO admin_user (name, login_id, password) VALUES ('%s', '%s', '%s')";
  return util.format(saveAdminUserSql, adminUser.name, adminUser.loginId, adminUser.password);
}

module.exports = {
  saveAdminUser,
  updateAdminUser,
  fetchAdminUser,
};
