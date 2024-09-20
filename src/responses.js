const fs = require('fs');
const xml2js = require('xml2js');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`)


const responseJSON = (request, response, status, object) => {
    const jsonContent = JSON.stringify(object);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonContent, 'utf8'),
    });

    response.write(jsonContent);
    response.end();
}

const responseXML = (request, response, status, object) => {
    const builder = new xml2js.Builder();
    const xmlContent = builder.buildObject(object);
  
    response.writeHead(status, { 'Content-Type': 'application/xml' });
    response.write(xmlContent);
    response.end();
}

const respond = (request, response, status, object) => {

    if(request.acceptedTypes[0] === 'text/xml'){
        responseXML(request, response, status, object);
    }
    else{
        responseJSON(request, response, status, object);
    }

}

//function for index page
const getIndex = (request, response) => {
    response.writeHead(200, { 
        'Content-Type': 'text/html',
        'Content-Length': Buffer.byteLength(index, 'utf8'),
     });
    // write an HTML string or buffer to the response
    response.write(index);
    // send the response to the client.
    response.end();
}

//function for style page
const getStyle = (request, response) => {
    response.writeHead(200, { 
        'Content-Type': 'text/css',
        'Content-Length': Buffer.byteLength(style, 'utf8'),
     });
    // write an HTML string or buffer to the response
    response.write(style);
    // send the response to the client.
    response.end();
}

const success = (request, response) => {
    const messageJSON = {
        message: 'This is a successful response',
    };
    respond(request, response, 200, messageJSON);

}

const badRequest = (request, response) => {
    if(request.query.valid === 'true'){
        const responseJSON ={
            message: 'This request has the required parameters'
        };
        respond(request, response, 200, responseJSON);
    }
    else{
        const responseJSON ={
            message: 'Missing valid query parameter set to true',
            id: 'badRequest'
        };
        respond(request, response, 400, responseJSON);
    }
}

const unauthorized = (request, response) => {
    if(request.query.loggedIn === 'yes'){
        const responseJSON ={
            message: 'You have successfully viewed the content'
        };
        respond(request, response, 200, responseJSON);
    }
    else{
        const responseJSON ={
            message: 'Missing loggedIn query parameter set to yes',
            id: 'unauthorized'
        };
        respond(request, response, 401, responseJSON);
    }
}

const forbidden = (request, response) => {
    const responseJSON = { 
        message: 'You do not have access to this content', 
        id: 'forbidden' 
    };
    respond(request, response, 403, responseJSON);
}

const internal = (request, response) => {
    const responseJSON = { 
        message: 'Internal Server Error. Something went wrong', 
        id: 'internalError' 
    };
    respond(request, response, 500, responseJSON);
}

const notImplemented = (request, response) => {
    const responseJSON = { 
        message: 'A GET request for this page has not been implemented yet. Check again later for updated content.', 
        id: 'notImplemented' 
    };
    respond(request, response, 501, responseJSON);
}

const notFound = (request, response) => {
    const responseJSON = { 
        message: 'The page you are looking for was not found', 
        id: 'notFound' 
    };
    respond(request, response, 404, responseJSON);
}


module.exports = {
    getIndex,
    getStyle,
    success, 
    badRequest,
    unauthorized,
    forbidden,
    internal,
    notImplemented,
    notFound,
  };