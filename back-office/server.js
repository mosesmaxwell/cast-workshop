/*
the node server back-office is meant to be a REST API. First draft:
* /REST/applications                 --> loads all general application details
* /REST/applications/:id             --> loads application details
* /REST/applications/:id/results     --> loads quality indicator results for the application
* /REST/categories                   --> loads all categories
* /REST/tags                         --> loads all tags assignments to applications
*/

//Node Server written in ExpressJS
console.log('setup express server');

var publicDir = 'bin';
if (process.argv.length > 2) {
    publicDir = process.argv[2];
}
if (publicDir == 'watch') {
    publicDir = 'build';
}
var express = require('express');
var fs = require('fs');
var server = express();

console.log('setup available server urls');
var fr = function (filePath, response) {
    var fun = arguments.callee;
    if (fun.cache[filePath])
        return response.send(fun.cache[filePath]);
    fs.readFile('./back-office/data/' + filePath, 'utf8', function (error, data) {
        if (error) {
            response.status(500);
            response.render('Error', {message: '500: Internal Server Error', error: error, url: request.url});
            return;
        }
        fun.cache[filePath] = JSON.parse(data);
        return response.send(fun.cache[filePath]);
    });
};
fr.cache = {};

var filterResponse = function(request, response, path){
    return {
        send: function (data) {
            var l = data.length;
            var appId = 'AAD/applications/' + request.params.id;
            for (var i = 0; i < l; i += 1){
                var dataId = data[i];
                if (path)
                    dataId = dataId[path];
                if (dataId.href === appId)
                    return response.send(data[i]);
            }
            response.send({});
        }
    }
};

server.get('/REST/applications', function (request, response) {fr('applications.json', response);});
server.get('/REST/applications/:id', function (request, response) {fr('applications.json', filterResponse(request, response));});
server.get('/REST/applications/:id/results', function (request, response) {fr('quality-indicators.json', filterResponse(request, response, 'application'));});
server.get('/REST/results', function (request, response) {fr('quality-indicators.json', response);});
server.get('/REST/tags', function (request, response) {fr('tags.json', response);});
server.get('/REST/categories', function (request, response) {fr('categories.json', response);});

server.use(express.static(__dirname + "/" + publicDir));
server.set('port', (process.env.PORT || 5000));
server.listen(server.get('port'));


module.exports = server;