var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var dbProvider = require('./DatabaseProvider');

function getAllActiveProducts(callback) {
    var sql = getQueryToSearchProductsByStatus('ACTIVE');
    dbProvider.executeQuery(sql, callback);
}

  function getAllProductCategories(callback) {
    var sql = getQueryToGetAllProductCategories();
    dbProvider.executeQuery(sql, callback);
  }

  function getProductsByCategoryId(categoryId, callback) {
    var sql = getQueryToFetchProductsByCategoryId(categoryId);
    executeQuery(sql, callback);
  }

  function getQueryToFetchProductsByCategoryId(categoryId) {
    return util.format("SELECT * FROM `product` WHERE `category_id` = '%s'", categoryId);
  }

  function getQueryToSearchProductsByStatus(status) {
      return util.format("SELECT * FROM `product` WHERE `status` = '%s'", status);
  }

  function getQueryToGetAllProductCategories() {
    return util.format("SELECT * FROM `product_category`");
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

  module.exports = {
    getAllActiveProducts,
    getAllProductCategories,
    getProductsByCategoryId
  };