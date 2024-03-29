const readline = require('readline');
const fs = require('fs');
const {
  google
} = require('googleapis');

class Google {
  /**
   * @param {credentials} String
   * @param {tokenPat h} String
   * @param {scopes} String
   */
  constructor ({
    credentials,
    tokenPath,
    scopes
  }) {
    this.credentialsPath = credentials;
    this.tokenPath = tokenPath;
    this.scopes = scopes;
    this.credentialsJSON = null;
    this.tokenJSON = null;
    this.oAuth2Client = null;
    this.drive = null;
  }
  authorize () {
    return new Promise(async (resolve, reject) => {
      await readFile(this.credentialsPath).then(output => {
        this.credentialsJSON = JSON.parse(output);
      }).catch((err) => {
        reject(err);
      });
      const {
        client_id,
        client_secret,
        redirect_uris
      } = this.credentialsJSON.installed;
      this.oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
      await accessFile(this.tokenPath).then(async (found) => {
        if (found) {
          await this.setToken().then(() => {
            resolve('Token set');
          }).catch(err => {
            reject(err);
          });
        } else {
          this.getNewAccessToken().then(() => {
            resolve('New Token Saved');
          }).catch(err => {
            reject(err);
          });
        }
      });
    });
  }

  setToken () {
    return new Promise(async (resolve, reject) => {
      await readFile(this.tokenPath).then(token => {
        this.tokenJSON = JSON.parse(token);
        this.oAuth2Client.setCredentials(this.tokenJSON);
        this.drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
        // <- you set an api property for our class here
        // for example if you want to add drive api : this.drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getNewAccessToken () {
    return new Promise((resolve, reject) => {
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.scopes
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        this.oAuth2Client.getToken(code, async (err, token) => {
          if (err) {
            return console.log('Error retrieving access token', err);
          } else {
            this.oAuth2Client.setCredentials(token);
            await writeFile(this.tokenPath, JSON.stringify(token)).then(() => {
              this.drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
              // <- you set an api property for our class here
              // for example if you want to add drive api : this.drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
              resolve(true);
            }).catch((err) => {
              reject(err);
            });
          }
        });
      });
    });
  }
}

// fs with promise
function readFile (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, (err, output) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function writeFile (path, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function accessFile (path) {
  return new Promise(function (resolve) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = { Google };
