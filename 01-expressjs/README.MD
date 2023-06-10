## contents

- js refresher
- node basics
- efficient development
- express.js
- templating engines
- mvc
- advanced routing & models
- SQL (mysql)
- sequelize
- noSQL
- mongoose
- sessions & cookies
- authenticationo
- sending emails
- authentication deep dive
- user input validation
- error handling
- file-up / download
- pagination
- async requests
- handling payments (stripe.js)
- rest API basics
- advanced REST API
- async await
- websockets (socket.io)
- graphQL
- deployment (SSL encryption)
- DENO + typescript (nodejs alternative)

//-------------------------------------------------------------

REPL - node interactive mode

```
node
```

running first-app.js

```shell
node first-app.js
```

const fs = require('fs');
//-------------------------------------------------------------

pure function - gets all required data it works with from arguments

objects:

```js
const person = {
  name: 'clark',
  greet: () => {
    console.log('my name is: ' + this.name); //this will be undefined because array function scope is not of the object
  },
};
```

```js
const person = {
  name: 'clark',
  greet() {
    console.log('my name is: ' + this.name);
  },
};
```

HTTPS - encryption during transmission

## NodeJS core modules

```
http
https
fs
path
os
```

## creating a nodejs server

const http = require('http');

```js
const http = require('http');

//create a server
const server = http.createServer((req, res) => {
  console.log(req.header, req.method, req.url);

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>hello</title></head>');
  res.write('<body>hello</body>');
  res.write('</html>');
  res.end();
  // process.exit();  //hard-exit event loop
});

server.listen(3000);
```

## the request

- header
- method
- url

http headers are added to request and response

## Event Loop + Worker pool (HEAVY lifting)

- event loop handles fast finishing code - keep nodejs process going
- worker pool - different threads - handles heavy lifting of longer operations, once done, ends up back on event loop

order of loop:

- timer callbacks - setTimeout / setTimeInterval
- pending callbacks
- poll phase - looking for new IO events and execute their callbacks - if not possible registers as a pending callback
- Check phase - setImmediate() callbacks
- Close Callbacks - execute all 'close event' callback
- process.exit
