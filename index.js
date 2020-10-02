const core = require('@actions/core');
const S3 = require('aws-sdk/clients/s3');
const fs = require("fs");
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
      
      uploadFile(source);

} 
catch (error) {
    core.setFailed(error.message);
}