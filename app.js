const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

siteName = 'iRelateBelgium';
username = 'Bold.User';
password = 'Boldtesting2000';
baseUrl = 'https://secure.p03.eloqua.com';
encodedStr = Buffer.from(siteName + '\\' + username + ':' + password).toString('base64');

var submitData = {
    "data": [{
            "name": "New Email Form for test1",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for test2",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for test3",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for test4",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for test5",
            "processingType": "externalEmail",
        },
    ]
};

var postConfig = {
    method: 'post',
    url: baseUrl + '/api/REST/1.0/assets/form',
    headers: {
        'Authorization': 'Basic ' + encodedStr,
        'Content-Type': 'application/json'
    },
};

//submitForms(postConfig, submitData);

var getConfig = {
    method: 'get',
    url: baseUrl + '/api/REST/1.0/assets/forms',
    headers: {
        'Authorization': 'Basic ' + encodedStr,
        'responseType': 'blob'
    }
};

createFormsCsv(getConfig, 'test000');

function createFormsCsv(getConfig, fileName) {
    axios(getConfig)
        .then(function(response) {
            writeCsvFile(fileName, convertToCsv(response.data.elements));
        })
        .catch(function(error) {
            console.log(error);
        });
}

function submitForms(postConfig, submitData) {
    for (const item of submitData['data']) {
        postConfig.data = item;
        axios(postConfig)
            .then(function(response) {
                return console.log(JSON.stringify(response.data));
            })
            .catch(function(error) {
                return console.log(error);
            });
    }
}

function convertToCsv(jsonData) {
    const fields = [{
        label: 'id',
        value: 'id'
    }, {
        label: 'Name',
        value: 'name'
    }, {
        label: 'Type',
        value: 'type'
    }, {
        label: 'currentStatus',
        value: 'currentStatus'
    }, {
        label: 'createdAt',
        value: 'createdAt'
    }, {
        label: 'createdBy',
        value: 'createdBy'
    }, {
        label: 'depth',
        value: 'depth'
    }, {
        label: 'folderId',
        value: 'folderId'
    }, {
        label: 'archived',
        value: 'archived'
    }, {
        label: 'processingSteps',
        value: 'processingSteps'
    }, {
        label: 'processingType',
        value: 'processingType'
    }, {
        label: 'htmlName',
        value: 'htmlName'
    }, {
        label: 'elements',
        value: 'elements'
    }];
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(jsonData);
}

function writeCsvFile(fileName, data) {
    fs.writeFile(fileName + '.csv', data, function(err) {
        if (err) return console.log(err);
    });
    return console.log('File created: ' + fileName + '.csv');
}

function getBaseUrl(callback) {
    var getConfig = {
        method: 'get',
        url: 'https://login.eloqua.com/id',
        headers: {
            'Authorization': 'Basic ' + encodedStr,
        }
    };
    axios(getConfig)
        .then(function(response) {
            callback(JSON.stringify(response.data.urls.base));
        })
        .catch(function(error) {
            return error;
        });
}