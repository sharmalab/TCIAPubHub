var fs = require("fs");

var h = fs.readFileSync("hello.txt");
console.log(h);

var q = fs.readFile("hello.txt", function(data){
    console.log(data);
});


console.log("The End");
