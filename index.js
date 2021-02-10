  //ACCESS KEY VALIDATION
// const AWS = require("aws-sdk");

// AWS.config.getCredentials(function(err) {
//   if (err) console.log(err.stack);
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId);
//   }
// });

const AWS = require('aws-sdk');
const config = require('./config.js');
const uuidv1 = require('uuid');

const getMovies = function (req, res) {
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_table_name
    };

    docClient.scan(params, function (err, data) {

        if (err) {
            console.log(err)
            res.send({
                success: false,
                message: err
            });
        } else {
            const { Items } = data;
            console.log({
              success: true,
              movies: Items
          });
            
            // res.send({
            //     success: true,
            //     movies: Items
            // });
        }
    });
}

getMovies();

const addMovie = function (req, res) {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const Item = { ...req.body };
    Item.id = uuidv1();
    var params = {
        TableName: config.aws_table_name,
        Item: Item
    };

    // Call DynamoDB to add the item to the table
    docClient.put(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });
        } else {
            res.send({
                success: true,
                message: 'Added movie',
                movie: data
            });
        }
    });
}

// module.exports = {
//     getMovies,
//     addMovie
// }