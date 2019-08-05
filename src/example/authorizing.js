const { Google } = require('../googleapi/googleapi.js');
var CronJob = require('cron').CronJob;

const google = new Google({
  credentials: './credentials.json',
  tokenPath: './token.json',
  scopes: 'https://www.googleapis.com/auth/drive.file'
});

(async () => {
  await google.authorize().then((msg) => {
    console.log(msg);
  }).catch(err => {
    console.log('An error occured:', err);
  });
})();

const job = new CronJob('0 */10 * * * *', function () {
  google.listFiles();
});

job.start();
