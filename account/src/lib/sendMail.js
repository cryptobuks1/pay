const AWS = require('aws-sdk');
const striptags = require('striptags');

AWS.config.loadFromPath('aws.json');
// AWS.config.update({region: 'us-east-1'});
// us-west-2
const ses = new AWS.SES();

const sendMail = ({
  to,
  subject,
  from = 'Gentrion <system@system.io>',
  body
}) => {
  return new Promise((resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body
          },
          Text: {
            Charset: 'UTF-8',
            Data: striptags(body)
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      },
      Source: from
    };
    // console.log('ses.sendEmail...');
    ses.sendEmail(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = sendMail;
