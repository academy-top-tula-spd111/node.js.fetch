let http = require("http");
let fs = require("fs");

http.createServer(function(request, response){
    if(request.url == "/hello"){
        // response.statusCode = 302;
        // response.setHeader("Location", "/goodby");
        response.end("Welcome To Hello");
    }
    else if(request.url == "/user"){
        let user = {
            name: "Bob",
            age: 26,
            email: "bob@yandex.ru"
        };
        response.end(JSON.stringify(user));
    }
    // else if(request.url == "/goodby"){
    //     response.setHeader("My-Code", "Code = 123");
    //     response.end("Welcome to GoodBy");
    // }
    else
        fs.readFile("index.html/user", (error, data) => response.end(data));
}).listen(5000, () => console.log("Server is start"));