var express = require('express');
var router = express.Router();
var util = require('util');
var path = require('path');

var callbackHelper = require('./CallbackHelper');
var viewHelper = require('./ViewHelper');


var requestError = {};
var requestData = {};

var filename = path.basename(__filename);

var productService = require('../service/ProductService');

const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/product')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const Image_Filter = function(request, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    request.fileValidationError = 'Only image files are allowed!';
    requestError = "Only image files are allowed.";
      return cb(new Error('Only image files are allowed!'), false);
    }
  cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: Image_Filter }).single('product_image');

/**
 * handles http request to create a product
 * On success viewEditProduct page is loaded
 */
 router.get('/productCreate', (request, response) => {
    console.log("Loading product/create");

    callbackHelper.setResponse(response);
    callbackHelper.setView("product/create");
  
    response.locals.categoriesDropdown = viewHelper.createProductCategoryDropdown();

    requestError = "";

    callbackHelper.renderNextView(requestError, requestData);

});

/**
 * handles http request to create a product
 * On success viewEditProduct page is loaded
 */
 router.post('/productCreate', (request, response) => {

  callbackHelper.setResponse(response);
  httpRequest = request;
  httpResponse = response;

  upload(request, response, function (err) {

    console.log(request.body);

    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      callbackHelper.setView("product/create");  
      response.locals.categoriesDropdown = viewHelper.createProductCategoryDropdown();
      callbackHelper.renderNextView(requestError, request.body);  
      return;
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
      callbackHelper.setView("product/create");
      response.locals.categoriesDropdown = viewHelper.createProductCategoryDropdown();
      callbackHelper.renderNextView(requestError, request.body);  
      return;
    }

    if (!validateReuest(request)) {
      console.log("Request to create product failed validation!");
      console.log("Error:" + JSON.stringify(requestError, null, 2))
      callbackHelper.setView("product/create");
  
      response.locals.categoriesDropdown = viewHelper.createProductCategoryDropdown();
      callbackHelper.renderNextView(requestError, request.body);  
      return;
    }

    console.log("Creating a new product");

    var product = prepareProductForSave(request);
  
    console.log("Saving product: " + JSON.stringify(product, null));
  
    productService.saveProduct(product, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }));
    
    //product saved

  });

});

function validateReuest(request) {
  if (!callbackHelper.hasValue(request.body.name)) {
    requestError = 'Please enter product name.';
    return false;
  }
  if (!callbackHelper.hasValue(request.body.categories)) {
    requestError = 'Please select a product category.';
    return false;
  }
  return true;
}

function prepareProductForSave(request) {
  var product = {};
  product.name = request.body.name;
  product.categoryId = request.body.categories;
  product.status = 'ACTIVE';

  //if product is vegan then it implies that it is also dairy free and egg less
  if (request.body.is_vegan && request.body.is_vegan == 'on') {
    product.isVegan = 1;
    product.isEggless = 1;
    product.isDairyfree = 1;

    return product;
  }

  //product is not vegan 
  product.isVegan = 0;

  if (request.body.is_eggless && request.body.is_eggless == 'on') {
    product.isEggless = 1;
  } else {
    product.isEggless = 0;
  }

  if (request.body.is_dairyfree && request.body.is_dairyfree == 'on') {
    product.isDairyfree = 1;
  } else {
    product.isDairyfree = 0;
  }
  
  return product;
}
module.exports = router;