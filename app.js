//EXPRESS
var express = require("express");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
//var csv = require('csv-parse');
var csv = require('fast-csv');
var app = express();

//REQUEST
var request = require("request");
var Uphold = require('uphold-sdk-node')({
   "host": "api-sandbox.uphold.com",
    "key": "c76850e4971a5c8b582c35c49ba64cec7f3bfbbe",
    "secret": "ab0ebc646b398448c7aa99b6e849ac909738ade1",
    "scope": "accounts:read,cards:read,cards:write,contacts:read,contacts:write,transactions:deposit,transactions:read,transactions:transfer:application,transactions:transfer:others,transactions:transfer:self,transactions:withdraw,user:read",
    "bearer": "4e1b6809b553c2b9e0d8e2ceb6840245c81c41f2"
    
});
var storedState;



app.set("view engine", "ejs");



app.get("/", function(req, res){
   res.render("index");
});

//INDEX
app.get("/home", function(req, res) {
   // check the stored state equals the state returned
   // create the bearer token using the code param from the url
   Uphold.createToken(req.query.code, function(err, token){
       //if(err) console.log(err);
       // store the token for later use
       var storedBearer = token;
  
       // add the token to the current uphold-sdk-node configs bearer property and make authenticated calls
       Uphold.addToken(storedBearer.access_token).user(function(err, user) {
           if(err) console.log(err);

       });
   });
   
   
   Uphold.user(function(err, user) {
    if(err) return console.log(err);
    var context = {
       user:user,
       dummy: ['javier', 'marco','david', 'yoka']
    }
    res.render("home", context);
});
   
    
});

app.get("/register", function(req, res) {

   var auth = Uphold.buildAuthURL();
// store the state to validate against
   storedState = auth.state;
   res.redirect(auth.url);
    
});


      
app.post('/upload/data', upload.single('csvdata'), function (req, res, next) {
      
     /* var file = req.file;
      
      fs.createReadStream(file.path).pipe(csv()).on('data',function(rows){
            var result = [];
            /*data.forEach(function(datas){
               
               result.concat(datas);
            });
            

            var csvContent = "";
            rows.forEach(function(rowArray){
               let row = rowArray.join(",");
               csvContent += row + "\r\n";
            });
            
            console.log(csvContent);
            
      });*/
      
        var fileRows = [], fileHeader;
        var prueba = "";

  // open uploaded file
      csv.fromPath(req.file.path)
      .on("data", function(data){
           data.forEach(function(data){
               fileRows.push(data);
               prueba += ',' + data;
            })
       })
       .on("end", function(){
           res.json(fileRows);
       });
         /*.on("data", function (data) {
            data.forEach(function(data){
               fileRows.push(data);
               prueba += ',' + data;
            })
         .on("end", function(){
               console.log("done");
          });*/
       // push each row
       
       
    });
    




app.listen(process.env.PORT, process.env.IP, function(){
   
   console.log("SERVER HAS STARTED");
    
});