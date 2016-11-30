var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var app=express();
var expressValidator =require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
app.use(function(req,res,next){
  res.locals.errors =null;
  next();

});
//View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); 

//Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:false
}));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//Static file
var people={
  name:'Shubham',
  lastname:'Jinde'
};

var users = [
  {
     id:1,
     first_name:'Shawn',
     last_name:'Michaels'
  },
  {
     id:2,
     first_name:'Undertaker',
     last_name:'Beast'
  },
  {
     id:3,
     first_name:'John',
     last_name:'cena'
  },
];
//app.use(express.static(path.join(__dirname,'public')));
app.get('/',function(req,res){
   db.users.find(function (err, docs) {

     //console.log(docs);
   	 res.render('index',{
     title:'Customers',
     users:docs

   });
    // docs is an array of all the documents in mycollection
})
  
});

app.post('/users/add',function(req,res){
     req.checkBody('first_name','First NAME IS requires').notEmpty();
     req.checkBody('last_name','Last NAME IS requires').notEmpty();
     var errors =req.validationErrors();
     if(errors){
     res.render('index',{
        title:'Customers',
        users:users,  
        errors:errors 
   });
     }else{
     var newUser ={
         first_name:req.body.first_name,
         last_name:req.body.last_name
     }
     db.users.insert(newUser, function(err,result){
          if(err){
          	 console.log(err);
          }
         res.redirect('/'); 
     }); 
}});
app.listen(8000);