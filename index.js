const core = require('@actions/core');
const S3 = require('aws-sdk/clients/s3');
const fs = require("fs");
const { waitForDebugger } = require('inspector');
const path = require("path");
const slash = require('slash');

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
          const key = slash(path.normalize(path.join(prefix, path.relative( path.join(process.cwd(), source), fileName)))) 
          console.log(key)
          // Setting up S3 upload parameters
          const uparams = {
            Bucket: bucket,
            Key:  key,
            Body: file,
            ACL: acl
          };
      
          // Uploading files to the bucket
          s3.upload(uparams, function (err, data) {
            if (err) {
              throw err;
            }
            console.log(`File uploaded successful. ${data.Location}`);
          });
        }
      };

      var dparams = {
        Bucket: bucket,
        Prefix: prefix
      };
    
      console.log(`listing files. ${prefix}`);
      s3.listObjects(dparams, function(err, data) {
        if (err){
          console.log(err.message);
            throw err;
        }
        console.log(`listed files successful.`);
    
        dparams = {Bucket: bucket};
        dparams.Delete = {Objects:[]};
    
        data.Contents.forEach(function(content) {
          console.log(`deleting file. ${content.Key}`);
          dparams.Delete.Objects.push({Key: content.Key});
        });
    
        s3.deleteObjects(dparams, function(err, data) {
          if (err){
            console.log(err.message);
              throw err;
          }
          console.log(`delete files successful.`);
          
          uploadFile(source);
        });
      });
} 
catch (error) {
    core.setFailed(error.message);
}