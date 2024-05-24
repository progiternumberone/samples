'use strict';

// Declare library dependencies
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
var hash = crypto.getHashes();

//Configure Environment
const configModule = require('../shared-modules/config-helper/config.js');
var configuration = configModule.configure(process.env.NODE_ENV);

// Declare shared modules
const S3Helper = require('../shared-modules/s3-helper/s3-helper.js');

//Configure Logging
const winston = require('winston');
winston.level = configuration.loglevel;

// Instantiate application
var app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, Access-Control-Allow-Headers, X-Requested-With, Access-Control-Allow-Origin");
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});


// Create a schema
var profileSchema = {
    TableName: configuration.table.profile,
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

/**
 * Get a profile
 */
app.get('/profile', function (req, res) {
    try {
        var tmpIP = getIP(req);
        var tmpId = generateId(tmpIP);
        if (!tmpId) {
            res.status(200).send("Profile no id");
        } else {
            res.redirect("https://s3.amazonaws.com/p.contentaccess.com/" + tmpId + ".js");
        }
    } catch (ex) {
        winston.error("Error getting profile: " + ex.message);
        res.status(200).send("Profile getting broke: " + ex.message);
    }
});

/**
 * Save a profile
 */
app.post('/profile', function (req, res) {
    try {
        var tmpIP = getIP(req);
        var tmpId = generateId(tmpIP);
        if (!tmpId) {
            res.status(200).send("Profile no id");
        } else {
            var profileData = req.body;
            if (typeof req.body === "string") {
                /*navigator.sendBeacon is sending a string*/
                profileData = JSON.parse(req.body);
            }

            if (!validateData(profileData)) {
                res.status(200).send("Profile not valid");
            } else {
                publishProfile(profileData,tmpId);
                res.status(200).send("Profile saved");
            }
        }
    } catch (ex) {
        winston.error("Error saving profile: " + ex.message);
        res.status(200).send("Profile broke: " + ex.message);
    }
});
function getIP(req) {
    var ret = "";
    try {
        ret = req.header('X-Forwarded-For').split(",")[0];
    } catch (ex) {
        ret = "";
    }
    return ret;
}
function generateId(ip) {
    var ret = "";
    if (ip != "") {
        ret = stringToHash(ip);
    }
    return ret;
}
function stringToHash(string) {
    let hashName = crypto.createHash('sha256')
        .update(string)
        .digest('hex');
    return hashName;
}

function validateData(data) {
    var ret = true;
    /*private logic here
    
    
    */
    return ret;
}


function publishProfile(profile,tmpId) {
    var s3Helper = new S3Helper('p.contentaccess.com');
    // prepare jsonp content
    var jsonpCallbackFunctionStart = "contentAccessProfile(";
    var jsonpBody = JSON.stringify(profile);
    var jsonpCallbackFunctionEnd = ");";
    jsonpBody = jsonpCallbackFunctionStart + jsonpBody + jsonpCallbackFunctionEnd;
    var fileKey = tmpId + '.js';
    winston.debug("Profile publish: write to s3 " + fileKey + " " + jsonpBody);
    s3Helper.write(fileKey, jsonpBody, true, function (err, codex) {
        if (err) {
          winston.error('Error writing profile client JSON to S3: ' + err.message);
        }
    });
}

/**
 * Get the health of the service
 */
app.get('/profile/health', function (req, res) {
    res.status(200).send({ service: 'Public Profile', isAlive: true });
});


// Start the servers
app.listen(configuration.port.profile);
console.log(configuration.name.profile + ' service started on port ' + configuration.port.profile);
