# Workshop

## Introduction
This workshop is all about practicing fundamental skills from technical to functional aspects. Minimal reasonable 
working time should be 1.5h. There is no upper time limit, as for realisation: 'tous les coups sont permis' in a 
reasonable fashion. 

## setup environment
* install node if not installed already.
* in project folder, in a shell, type
    * npm install // only the first time
    * npm start // visit your application on http://localhost:3000 (by default)

Prestart action includes grunt compilations procedures in case you want to use e.g. coffeescript, linting, unit testing
validation.

## Server information
The existing REST urls are the following:

    http://localhost:3000/REST/applications                 --> loads all general application details
    http://localhost:3000/REST/applications/:id             --> loads application details
    http://localhost:3000/REST/applications/:id/results     --> loads quality indicator results for the application
    http://localhost:3000/REST/categories                   --> loads all categories
    http://localhost:3000/REST/tags                         --> loads all tags assignments to applications

## Workshop content
The best possible objective is to write a single page web application with the following features:

1. list all applications
2. display the details of a selected application
3. display extra information regarding application listing, ability to explore, find, filter, sort, etc.

Two main aspects are investigated:

* technical skills :
    * javascript(coffeescript) / CSS3
    * javascript libraries and framework usage
* functional skills
    * ability to dig quickly into a simple project and understand the functional aspects
    * ability to provide a relevant user experience

## quick links
Documentation to the core libraries available. 

* backbonejs http://backbonejs.org/ 
* underscorejs http://underscorejs.org/ 
* jquery http://api.jquery.com/ 
* requirejs http://requirejs.org/
* handlebars http://handlebarsjs.com/ 
* modernizr http://modernizr.com/