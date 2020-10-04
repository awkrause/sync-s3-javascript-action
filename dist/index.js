module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 583:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(264);
const S3 = __webpack_require__(831);
const fs = __webpack_require__(747);
const path = __webpack_require__(622);
const slash = __webpack_require__(170);

try {

    const accessKey = core.getInput('ACCESS_KEY');
    const secereteKey = core.getInput('SECRET_KEY');
    const bucket = core.getInput('BUCKET');
    const source = core.getInput('SOURCE');
    const prefix = core.getInput('KEY_PREFIX');
    const acl = core.getInput('ACL');

    const s3 = new S3({
        accessKeyId: accessKey,
        secretAccessKey: secereteKey
    });

    const uploadFile = (fileName) => {
        if (fs.lstatSync(fileName).isDirectory()) {
          fs.readdirSync(fileName).forEach((file) => {
            uploadFile(`${fileName}/${file}`);
          });
        } else {
          const file = fs.createReadStream(fileName);
      
          // Setting up S3 upload parameters
          const params = {
            Bucket: bucket,
            Key:  slash(path.normalize(path.join(prefix, path.relative( path.join(process.cwd(), source), fileName)))),
            Body: file,
            ACL: acl
          };
      
          // Uploading files to the bucket
          s3.upload(params, function (err, data) {
            if (err) {
              throw err;
            }
            console.log(`File uploaded successful. ${data.Location}`);
          });
        }
      };

      var params = {
        Bucket: bucket,
        Prefix: prefix
      };
    
      s3.listObjects(params, function(err, data) {
        if (err) throw err;
    
        params = {Bucket: bucketName};
        params.Delete = {Objects:[]};
    
        data.Contents.forEach(function(content) {
          params.Delete.Objects.push({Key: content.Key});
        });
    
        s3.deleteObjects(params, function(err, data) {
          if (err) throw err;
        });
      });
      
      uploadFile(source);

} 
catch (error) {
    core.setFailed(error.message);
}

/***/ }),

/***/ 264:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 831:
/***/ ((module) => {

module.exports = eval("require")("aws-sdk/clients/s3");


/***/ }),

/***/ 170:
/***/ ((module) => {

module.exports = eval("require")("slash");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(583);
/******/ })()
;