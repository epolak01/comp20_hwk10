/*
 * search.js
 * Author: Emil Polakiewicz
 * Date: Spring 2020
 *
 * Purpose: Search a mongodb database for companies
*/

var express = require('express')
var app = express()
var port = process.env.port || 3000;
var url = require('url');

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname + '/index.html'));
})

app.listen(port, () => console.log('searchapp listening on port ${port}!'));

app.post('/url', function(req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    
    //Parse the server request
    var q = url.parse(req.url, true).query;
    var resptype = q.type;
    var data = q.data;

    var MongoClient = require('mongodb').MongoClient;
    var mongourl = "mongodb+srv://dog_webpage:tygrUg-fenrac-qibby3@cluster0-ug0jz.mongodb.net/test?retryWrites=true&w=majority";

    //Connect to our database
    MongoClient.connect(mongourl, function (err, db) {
        if (err) throw err;
        var dbo = db.db("hwk10");

        // Queries database
        if (resptype == "Ticker") {
            var query = { Ticker: data };
            dbo.collection("companies").find(query).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                if (result.length == 0) {
                    res.write("Company Not Found")
                } else {
                   var strres = "Company: " + result[0].Company + " Ticker: " + result[0].Ticker
                    //res.write(strres) 
                    res.send(strres)
                }
                //res.end();
                db.close();
            });
        } else if (resptype == "Company") {
            var query = { Company: data };
            dbo.collection("companies").find(query).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                if (result.length == 0) {
                    res.write("Company Not Found")
                } else {
                    var strres = "Company: " + result[0].Company + " Ticker: " + result[0].Ticker
                    res.send(strres)
                }
                //res.end();
                db.close();
            });
        }
    });
}).listen(port);