const http = require("http");
const fs = require("fs");

let users = [
    {id: 1, name: "Tom", age: 27 },
    {id: 2, name: "Leo", age: 31 },
    {id: 3, name: "Jim", age: 19 },
];

function getRequestData(request){
    return new Promise(async (resolve, reject) => {
        try{
            let buffer = [];
            for await(let chunk of request){
                buffer.push(chunk);
            }
            const data = JSON.parse(Buffer.concat(buffer).toString());
            resolve(data);
        } catch(e){
            reject(e);
        }
    });
}

http.createServer(async (request, response) => {
    if(request.url === "/api/users" && request.method === "GET"){
        response.end(JSON.stringify(users));
    }
    else if(request.url.match(/\/api\/users\/([0-9]+)/) && request.method === "GET"){
        const id = request.url.split("/")[3];
        const user = users.find( (u) => u.id === parseInt(id));
        if(user)
            response.end(JSON.stringify(user));
        else{
            response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "user not found"}));
        }
    }
    else if(request.url.match(/\/api\/users\/([0-9]+)/) && request.method === "DELETE"){
        const id = request.url.split("/")[3];
        const index = users.findIndex( (u) => u.id === parseInt(id));
        if(index > -1){
            const user = users.splice(index, 1)[0];
            response.end(JSON.stringify(user));
        }
        else{
            response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "user not found"}));
        }
    }
    else if(request.url === "/api/users" && request.method === "POST"){
        try{
            const userData = await getRequestData(request);
            const user = { name: userData.name, age: userData.age };
            const id = Math.max.apply(Math, users.map(function(u) { return u.id; }));
            user.id = id + 1;
            users.push(user);
            response.end(JSON.stringify(user));
        } catch(e){
            response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "incorrect data"}));
        }
    }
    else if(request.url === "/api/users" && request.method === "PUT"){
        try{
            const userData = await getRequestData(request);
            const user = users.find( (u) => u.id === parseInt(userData.id));
            if(user){
                user.name = userData.name;
                user.age = userData.age;
                response.end(JSON.stringify(user));
            }
            else{
                response.writeHead(404, {"Content-type": "application/json"});
                response.end(JSON.stringify({ message: "user not found"}));
            }
        } catch(e){
            response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "incorrect data"}));
        }
    }
    else if(request.url == "/" || request.url === "/index.html"){
        fs.readFile("index.html", (error, data) => response.end(data));
    }
    else{
        response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "resourse not "}));
    }
}).listen(5000, () => console.log("Server is start at: http://localhost:5000"));