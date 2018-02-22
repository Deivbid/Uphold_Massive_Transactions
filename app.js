//EXPRESS
var express     = require("express");
var multer      = require('multer');
var upload      = multer({ dest: 'uploads/' });
var fs          = require('fs');
var mongoose    = require("mongoose");
var csv         = require('fast-csv');
var app         = express();
var empleado    = require("./models/empleado");

//REQUEST
var request = require("request");
var Uphold = require('uphold-sdk-node')({
   "host": "api-sandbox.uphold.com",
    "key": "c76850e4971a5c8b582c35c49ba64cec7f3bfbbe",
    "secret": "ab0ebc646b398448c7aa99b6e849ac909738ade1",
    "scope": "accounts:read,cards:read,cards:write,contacts:read,contacts:write,transactions:deposit,transactions:read,transactions:transfer:application,transactions:transfer:others,transactions:transfer:self,transactions:withdraw,user:read",
    "bearer": "4e1b6809b553c2b9e0d8e2ceb6840245c81c41f2"
    
});
//Global Variables
var storedState;
var currentFilePath = '';
//View Engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/Uphold_Sofos';
mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));
      

var Test = [{'ci':'26186526', 'nombre':'David', 'usuario':'Deivbid', 'empresa':'SME'}, {'ci':'25196796', 'nombre':'Patrick', 'usuario':'Patricio', 'empresa':'SME'}]

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
       data:''
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
      
        var fileRows = [];
        currentFilePath = req.file.path;

      csv.fromPath(req.file.path)
      .on("data", function(data){
           data.forEach(function(data){
               fileRows.push(data);
            })
       })
       .on("end", function(){
           Uphold.user(function(err, user) {
            if(err) return console.log(err);
            var context = {
               user:user,
               data:fileRows
            }
        
            res.render("home", context);
            });
       });
       
       
});

app.get("/users", function(req, res) {
      
      var fileRows = [];
      
      csv.fromPath(currentFilePath)
      .on("data", function(data){
           data.forEach(function(data){
               fileRows.push(data);
            })
       })
       .on("end", function(){
           Uphold.user(function(err, user) {
            if(err) return console.log(err);
            var context = {
               user:user,
               data:fileRows
            }
        
            res.render("list_users", context);
            });
       });
});

app.get("/transaction", function(req, res) {

       var options = {
           "card": "c7ce511d-c259-4bd1-a21f-bb3b9a63164e",
           "currency":"BTC",
           "amount": "0.004",
           "destination": "",
           "message":""
       }
       
       
       var test = ["llewnus" ,"psanchez039", "marcoloreto", "ccastellanos5", "enitmel"];
       
       test.forEach(function(user){
            options.destination = user;
            options.message = "Hola " + user;
            
            
            Uphold.createTransaction(options, function(err, transaction){
                console.log(transaction);
            })        
       })
       
});

app.get("/probando", function(req, res) {
    
   empleado.find({}, function(err, all){
      
      if(err)
      {
          console.log(err);
      }
      else
      {
          res.render("home2", {data:all});
      }
       
   });
    
    
});
    
app.get("/generar_datos", function(req, res) {
    Test.forEach(function(empleados){
        empleado.create(empleados,function(err, newEmployer){
            if(err){
                console.log(err);
            } else {
                console.log("Todo bien");
            }                 
        });  
    });
    
    res.redirect("/probando");
});




app.listen(process.env.PORT, process.env.IP, function(){
   
   console.log("SERVER HAS STARTED");
    
});