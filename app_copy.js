const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

siteName = 'iRelateBelgium';
username = 'Bold.User';
password = 'Boldtesting2000';
baseUrl = 'https://secure.p03.eloqua.com';
encodedStr = Buffer.from(siteName + '\\' + username + ':' + password).toString('base64');


var responses = [];
var submittedForms = ["372", "371", "370", "369", "368"];
var counter = 0;

var submitData = {
    "data": [{
            "name": "Event marketing test: Mercury",
            "processingType": "externalEmail",
        },
        // {
        //     "name": "Event marketing test: Venus",
        //     "processingType": "externalEmail",
        // },
        // {
        //     "name": "Event marketing test: Mars",
        //     "processingType": "externalEmail",
        // },
        // {
        //     "name": "Event marketing test: Saturn",
        //     "processingType": "externalEmail",
        // },
        // {
        //     "name": "Event marketing test: Uranus",
        //     "processingType": "externalEmail",
        // },
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
    console.log("123");
    submittedForms.forEach(async formId => {
        await getFormById(formId).then(() => {
            if (counter == submittedForms.length - 1) {
                appendCsvFile('message', convertToCsv(responses));
            }
            counter++;
        })
    });
}

function createFormsCsv(getConfig, fileName) {
    axios(getConfig)
        .then(function(response) {
            writeCsvFile(fileName, convertToCsv(response.data.elements));
        })
        .catch(function(error) {
            console.log(error);
        });
}

// submitForms(postConfig, submitData).then(() => {
// getForms(getConfig, 'test000');
// });

postConfig.data = {
    "name": "Event marketing test: Uranus",
    "processingType": "externalEmail",
};



axios(postConfig)
    .then(function(post_response) {
        console.log('Sumbitted', post_response.data.id);
        //get form by id
        var getByIdConfig = {
            method: 'get',
            url: baseUrl + '/api/REST/1.0/assets/form/' + post_response.data.id,
            headers: {
                'Authorization': 'Basic ' + encodedStr,
                'responseType': 'blob'
            },
        };
        axios(getByIdConfig)
            .then(function(get_response) {
                response = get_response.data;
                console.log("getting form", get_response.data.id);
            })
            .catch(function(error) {
                console.log(error);
            });
    })
    .catch(function(error) {
        return console.log(error);
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

function writeCsvFile(fileName, data) {
    fs.writeFile(fileName + '.csv', data, function(err) {
        if (err) return console.log(err);
    });
    return console.log('File created: ' + fileName + '.csv');
}

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

createFormsCsv(getConfig, 'data000');

function deleteForms() {
    var getByIdConfig = {
        method: 'delete',
        url: baseUrl + '/api/REST/1.0/assets/form/381',
        headers: {
            'Authorization': 'Basic ' + encodedStr,
            'responseType': 'blob'
        },
    };
    axios(getByIdConfig)
        .then(function(get_response) {
            response = get_response.data;
            // responses.push(response);
            console.log(get_response.status)
        })
        .catch(function(error) {
            console.log(error);
        });
}

// deleteForms();