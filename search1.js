/*
 * search.js
 * Author: Emil Polakiewicz
 * Date: Spring 2020
 *
 * Purpose: Search a mongodb database for companies
*/

var port = process.env.port || 3000;
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    
    fs.readFile("index.html", function (err, pgres) { 
            if (err) 
                res.write("INDEX.HTML NOT FOUND"); 
            else { 
                // The following 3 lines 
                // are reponsible for sending the html file 
                // and ends the response process 
                res.writeHead(200, { 'Content-Type': 'text/html' }); 
                res.write(pgres); 
                res.end(); 
            } 
        }); 
    
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
                    res.write(strres) 
                }
                res.end();
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
                    res.write(strres)
                }
                res.end();
                db.close();
            });
        }
    });
}).listen(port);
