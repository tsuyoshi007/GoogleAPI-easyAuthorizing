# GoogleAPI-easyAuthorizing

## Getting Started

Package needed :
- _googleapis_

### Installing

```bash
npm install
```
You should add your api as the class property ( by opening the ./src/googleapi/googleapi.js you will see the instruction of where to add ) and You should add method for your api by using the api property of the class that you have created.


### Set Up Instruction

```bash
1. Go to Google Developer Console
2. Select or Create a New Project
3. Enable Drive API for Your Project
    * In the sidebar on the left, expand APIs & Services > Library
    * Search for "drive"
    * Click on "Google Drive API"
    * Enable the API
4. Create Credentials for Your Project
    * In the sidebar on the left, expand APIs & Services > Library
    * Click on "Create credentials"
    * Choose "OAuth client ID" > Web Application
    * Fill in your project name in "Name" section
    * In "Authorized JavaScript origins" section, enter "http://localhost:8000"
    * In "Authorized redirect URIs" section, enter "http://localhost:8000" or forward it to any router you want. In my example, I do not use any router.
    * After fill in everything, click "Create"
5. Download JSON and copy it to root project folder
```
![image](https://raw.githubusercontent.com/tsuyoshi007/googleDrive-creatingFolder-listFiles/master/image/downloadjson.png)

## Running

```bash
npm start
```

## Built With

- [NodeJS](https://nodejs.org/en/)

## Authors

- **Hun Vikran**