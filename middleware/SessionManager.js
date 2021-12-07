

const cookieParser = require("cookie-parser");
var util = require('util');


var path = require('path');
var filename = path.basename(__filename);


var validateSession = function (request, response, next) {

    httpNext = next;
    var urlToLogin = "/login?authenticationFailed=true";

    var requestUrl = request.originalUrl;
    console.log("Request URL: " + requestUrl);

    //If the HTTP Request is for the login page no need to validate session

    var secureRequest = shallSecureRequest(requestUrl);

    console.log(requestUrl  +  " : Secure=" +  secureRequest);
    
    if (!shallSecureRequest(requestUrl)) {
        console.log(util.format('%s: Bypassing session check as request URL is non-secure: %s', filename, requestUrl));
        httpNext();
        return;
    }

    if (!request.session || !request.session.login) {
        console.log("No user session found. Redirecing to login page");
        response.redirect(urlToLogin);
    } else {
        console.log("Session validated. Proceedng to next URL:" + requestUrl);
        httpNext();
    }
}

/**
 * Checks to see if request URL needs to be secured.
 * @param {'*'} requestUrl 
 * @returns 
 */
function shallSecureRequest(requestUrl) {
    var secureUrl = true;
    const nonSecurePaths = ['login', 'styles', 'images', 'scripts', 'favicon'];
    nonSecurePaths.every(nonSecurePath => {
        if (requestUrl.includes(nonSecurePath)) {
            secureUrl = false;
            //This return statement does not return out of the function shallSecureRequest. It returns out of the loop nonSecurePaths.every(...)
            //this return breaks out of the loop
            return false;
        } else {
            //this return is to continue the loop
            return true;
        }
    });
    return secureUrl;
}
function initializeUserSession(request, user) {
    console.log(util.format("%s: User session set for for login id: %s", filename,  user.login_id))
    request.session.login = user.login_id;
}

module.exports = {
    initializeUserSession,
    validateSession
  };
  