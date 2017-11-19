const crypto = require('crypto');
const aws = require('aws-sdk');

const config = require('../config/environment');

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'docker') {
  aws.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
  });
}

const s3Config = config.aws.s3;
const s3 = new aws.S3();

const UploadController = {
  getSignedUrl: ({
      prefix = '',
      fileIdentifier = crypto.randomBytes(5).toString('hex'),
      contentType = 'image/jpg',
    }) => new Promise((resolve, reject) => {
      const key = crypto
        .createHash('sha1')
        .update(`${Date.now().toString()}-pre-${prefix}-id-${fileIdentifier}`)
        .digest('hex');

      s3.getSignedUrl('putObject', {
        Bucket: s3Config.bucket,
        Expires: s3Config.expires,
        ACL: s3Config.acl,
        ContentType: contentType,
        Key: key,
      }, (error, url) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          fileUrl: `https://${s3Config.bucket}.s3.amazonaws.com/${key}`,
          signedUrl: url,
        });
      });
    }),
};

module.exports = UploadController;
