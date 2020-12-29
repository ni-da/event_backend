const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

siteName = 'iRelateBelgium';
username = 'Bold.User';
password = 'Boldtesting2000';
baseUrl = 'https://secure.p03.eloqua.com';
encodedStr = Buffer.from(siteName + '\\' + username + ':' + password).toString('base64');

var responses = [];

var submitData = [{
        "name": "Event marketing test: Mercury",
        "processingType": "externalEmail",
    },
    {
        "name": "Event marketing test: Venus",
        "processingType": "externalEmail",
    },
    {
        "name": "Event marketing test: Mars",
        "processingType": "externalEmail",
    },
    {
        "name": "Event marketing test: Saturn",
        "processingType": "externalEmail",
    },
    {
        "name": "Event marketing test: Uranus",
        "processingType": "externalEmail",
    },
];

var postConfig = {
    method: 'post',
    url: baseUrl + '/api/REST/1.0/assets/form',
    headers: {
        'Authorization': 'Basic ' + encodedStr,
        'Content-Type': 'application/json'
    },
};

async function submitAndGetForms(postConfig, submitData) {
    for (const element of submitData) {
        postConfig.data = element;
        await axios(postConfig)
            .then(async function(post_response) {
                //get form by id
                var getByIdConfig = {
                    method: 'get',
                    url: baseUrl + '/api/REST/1.0/assets/form/' + post_response.data.id,
                    headers: {
                        'Authorization': 'Basic ' + encodedStr,
                        'responseType': 'blob'
                    },
                };
                await axios(getByIdConfig)
                    .then(function(get_response) {
                        response = get_response.data;
                        responses.push(response);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            })
            .catch(function(error) {
                return console.log(error);
            });
    }
}

async function startApp() {
    await submitAndGetForms(postConfig, submitData).then(() => {
        appendCsvFile('data000', convertToCsv(responses));
    });
}

startApp(postConfig, submitData);

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