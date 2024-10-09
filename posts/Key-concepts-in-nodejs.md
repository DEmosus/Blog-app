---
title: Understanding Web server and file I/O in Node.js
excerpt: Node.js is a powerful platform for building scalable network applications. Its ability to handle streams efficiently, along with its versatile handling of HTTP requests and responses, makes it a popular choice for web development.
image: node.png
isFeatured: false
date: "2024-09-10"
---

# Understanding Web server and file I/O in Node.js

Node.js is a powerful platform for building scalable network applications. Its ability to handle streams efficiently, along with its versatile handling of HTTP requests and responses, makes it a popular choice for web development. In this blog, we’ll dive into several crucial concepts, including streams, HTTP methods, and CORS, to provide a comprehensive understanding of how they work together in a Node.js environment.

## 1. Node.js Stream API

### What is a Stream?

Streams in Node.js allow you to work with data that is being read from or written to a source in chunks, rather than loading the entire data into memory at once. This is particularly useful for handling large files or data streams efficiently.

#### Types of Streams:

- **Readable Streams**: Used for reading data.
- **Writable Streams**: Used for writing data.
- **Duplex Streams**: Both readable and writable.
- **Transform Streams**: A type of duplex stream where the output is computed based on the input.

#### Common Use Cases:

- **Reading Files**: Using `fs.createReadStream`.
- **Writing Files**: Using `fs.createWriteStream`.
- **Network Communications**: Handling HTTP requests and responses.
- **Data Transformation**: Using transform streams to modify data as it is read or written.

#### Basic Example:

```javascript
const fs = require("fs");

// Create a readable stream
const readableStream = fs.createReadStream("input.txt");

// Create a writable stream
const writableStream = fs.createWriteStream("output.txt");

// Pipe the readable stream to the writable stream
readableStream.pipe(writableStream);

readableStream.on("end", () => {
  console.log("File has been read and written successfully.");
});
```

#### Key Methods and Events:

- .pipe(): Connects a readable stream to a writable stream.
- .on('data', callback): Listens for data events.
- .on('end', callback): Listens for the end of the stream.

#### Benefits:

- Efficiency: Handles data in chunks, reducing memory usage.
- Flexibility: Can be used for various data sources and destinations.
- Scalability: Suitable for handling large amounts of data.

## 2. HTTP and Web Servers

- **Web Servers:**
  A web server handles HTTP requests from clients (usually browsers) and serves responses. In Node.js, you can create a web server using the http module.

#### Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello, world!");
  res.end();
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

#### HTTP Request Methods:

- **GET:** Retrieve data.
- **POST:** Submit data.
- **PUT:** Update data.
- **DELETE:** Remove data.
- **PATCH:** Partially update data.

#### HTTP Request and Response Components:

- **Request:** Method, Path, Headers, Body.
- **Response:** Status Code, Headers, Body.

#### Common HTTP Status Codes:

- **200 OK:** The request was successful.
- **404 Not Found:** The requested resource could not be found.
- **500 Internal Server Error:** The server encountered an error.

## 3. Handling Requests and Responses as Streams

#### Request as a Readable Stream:

In Node.js, the request object (req) is a readable stream. This means you can read data from it in chunks as it arrives.

#### Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    console.log("Received data:", body);
    res.end("Data received");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

#### Response as a Writable Stream:

The response object (res) in Node.js is a writable stream. You can write data to it in chunks, which is useful for sending large responses or streaming data back to the client.

#### Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello, ");
  res.write("world!");
  res.end();
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

## 4. APIs and Routing

#### APIs:

APIs (Application Programming Interfaces) allow different software applications to communicate with each other. RESTful APIs use HTTP methods to perform CRUD operations on resources.

#### Routing:

Routing determines how an application responds to client requests for specific endpoints (URIs).

#### Example:

```js
const express = require("express");
const app = express();

app.get("/user/:id", (req, res) => {
  const userId = req.params.id; // Access the parameter
  res.send(`User ID: ${userId}`);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

- **req.url:**
  In Node.js, **req.url** contains the URL of the incoming request, including the path and query string.

## 5. Same-Origin Policy and CORS

#### Same-Origin Policy:

This security measure restricts how documents or scripts loaded from one origin can interact with resources from another origin. An origin is defined by the combination of the protocol, host, and port of a URL.

#### Cross-Origin Resource Sharing (CORS):

CORS allows web servers to specify which origins are allowed to access their resources, using HTTP headers.

#### Example Header:

```
Access-Control-Allow-Origin: http://example.com
```

#### Example Workflow:

- **Client Request:** A web application on http://example.com requests data from http://api.example.com.
- **Preflight Request:** The browser sends an OPTIONS request to check if the request is allowed.
- **Server Response:** The server responds with the allowed origin.
- **Actual Request:** The browser sends the actual request.
- **Server Response:** The server responds with the requested data.
