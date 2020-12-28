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
            "name": "New Email Form for auto testing1",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for auto testing2",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for auto testing3",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for auto testing4",
            "processingType": "externalEmail",
        },
        {
            "name": "New Email Form for auto testing5",
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


var getConfig = {
    method: 'get',
    url: baseUrl + '/api/REST/1.0/assets/forms',
    headers: {
        'Authorization': 'Basic ' + encodedStr,
        'responseType': 'blob'
    }
};

function createFormsCsv(getConfig, fileName) {
    axios(getConfig)
        .then(function(response) {
            writeCsvFile(fileName, convertToCsv(response.data.elements));
        })
        .catch(function(error) {
            console.log(error);
        });
}


var responses = [];
var submittedForms = [];

var counter = 0;


cancel = axios.CancelToken.source();

async function getFormById(formId) {
    var getByIdConfig = {
        method: 'get',
        url: baseUrl + '/api/REST/1.0/assets/form/' + formId,
        headers: {
            'Authorization': 'Basic ' + encodedStr,
            'responseType': 'blob'
        },
    };
    await axios(getByIdConfig)
        .then(function(response) {
            response = response.data;
            responses.push(response);
            console.log("getting form");
        })
        .catch(function(error) {
            console.log(error);
        });
}
async function getForms() {
    submittedForms.forEach(async formId => {
        await getFormById(formId).then(() => {
            if (counter == submittedForms.length - 1) {
                appendCsvFile('message', convertToCsv(responses));
            }
            counter++;
        })
    });
}

async function submitForms(postConfig, submitData) {
    for (const item of submitData['data']) {
        postConfig.data = item;
        await axios(postConfig)
            .then(function(response) {
                submittedForms.push(JSON.stringify(response.data.id));
                console.log('Sumbitted', response.data.id);
            })
            .catch(function(error) {
                return console.log(error);
            });
    }
}

submitForms(postConfig, submitData).then(() => {
    createFormsCsv(getConfig, 'test000');
});

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
        }, {
            label: 'updatedAt',
            value: 'updatedAt'
        },
        {
            label: 'updatedBy',
            value: 'updatedBy'
        },
        {
            label: 'permissions',
            value: 'permissions'
        }
    ];
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(jsonData);
}

function writeCsvFile(fileName, data) {
    fs.writeFile(fileName + '.csv', data, function(err) {
        if (err) return console.log(err);
    });
    return console.log('File created: ' + fileName + '.csv');
}

function appendCsvFile(fileName, data) {
    fs.appendFile(fileName + '.csv', data, function(err) {
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