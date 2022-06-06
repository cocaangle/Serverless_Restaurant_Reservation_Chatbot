const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1"
})

var docClient = new AWS.DynamoDB.DocumentClient()
var table = "restaurant";
var getRestaurantDetails = (Intent, callback) => {
    var params = {
        TableName: table,
        Key: {
            "Intent": Intent
        }
    };

    docClient.get(params, function(err, data) {
        callback(err, data);
    });
};

module.exports = {
    getRestaurantDetails
};
