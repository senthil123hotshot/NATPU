var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var multer=require('multer');
var fs=require("fs");
var session = require('express-session');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'nanban'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	//register page load
	var username=req.body.Username;
    var	password=req.body.PassWord;
    connection.query("INSERT INTO Register (`Email`, `Password`) VALUES ('" + username + "', '" +password + "')", function(err){
           if(err)console.log(err);
               else
               //res.json({"message":"succesfully Resistered"});
           		res.redirect("/");
           		//load login file or render login automatically.
});
});*/
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

var sess;

app.get('/',function(req,res){
  sess=req.session;
  if(sess.username)
  {
    res.redirect('/home');
  }
  else{
  res.render('login');
  }
});
app.post("/login",function(req,res){
	//login pageload
var username=req.body.Username;
 var password=req.body.PassWord;
 console.log(username);
 sess=req.session; 
  sess.username=req.body.Username;
 //integrate the login page ui
 connection.query('select name from Register where name= "'+username+'" and password="'+password+'"' ,function(err,result){
 	if(err){
 		res.send(err);
 	}
 	else{
 	//res.send("succesfully login");
res.redirect("/home");}
 });
});
//when the memory button click
var storage =multer.diskStorage({
  destination: function(req,fileToUpload,cb){
    cb(null,'public/images/');
  },
  filename: function(req,fileToUpload,cb){
    cb(null,fileToUpload.originalname);
  }
})
var upload = multer({storage: storage}).single('fileToUpload');
app.get("/profile",function(req,res){
  sess=req.session;
  if(sess.username)  
{
  res.render("profile1");
}
else{
  res.redirect("/");
}
});
app.get("/readyou",function(req,res){
  sess=req.session;
  if(sess.username)  
{
 connection.query('select * from student where name= "'+sess.username+'"' ,function(err,data){
if(err){
  res.send(err);
}
else
{
  date = new Date(data[0].doj);
date=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();//prints expected fo
  console.log(date);
  data[0].doj=date;
  res.render("profile",{data:data[0]});
}
});
}
else{
  res.redirect("/");
}
});
app.get("/addprofile",function (req,res) {
  sess=req.session;
  if(sess.username)  
{
  res.render("add");
}
else{
  res.redirect("/");
}
});
app.post("/addprofile",function(req,res){
  sess=req.session;
  if(sess.username)  
{
upload(req,res,function(err){
    var magic =["image/jpeg","image/png","image/jpg","image/PNG"];
              var image={
                imagename : req.file.filename,
                imagepath : req.file.path,
                imagesize : req.file.size,
                imagetype : req.file.mimetype
              }
              var name=sess.username;
  console.log(name);
  var nick=req.body.nick;
  var crush=req.body.crush;
  var about=req.body.about;
  var fb=req.body.fb;
  var phone=req.body.phone;
  var email=req.body.email;
  var blood=req.body.blood;
  var doj=req.body.doj;
  var address=req.body.address;
  console.log(doj);

  if(image.imagetype == magic[0] || image.imagetype == magic[1] || image.imagetype == magic[2] || image.imagetype == magic[3]){
connection.query("INSERT INTO student (`name`, `email`,`nick`,`crush`,`about`,`fb`,`phone`,`file`,`doj`,`blood`,`address`) VALUES ('" + name + "', '" +email + "','" +nick + "','" +crush + "','" +about + "','" +fb + "','" +phone + "','" +image.imagename + "','" +doj + "','" +blood + "','" +address + "')", function(err){
if(err){
  res.send("You Already In Natpu Circle.You Can Edit");
}
else{
  res.redirect("/profile");
}
});
 }        
 });
}
else{
  res.redirect("/");
}
});
app.get("/viewprofile",function(req,res){
   sess=req.session;
  if(sess.username)  
{
res.render("view");}
else{
  res.redirect("/");
}
});
app.post("/viewprofile",function(req,res){
 sess=req.session;
  if(sess.username)  
{
var name=req.body.username;
console.log(name);
 connection.query('select * from student where name= "'+name+'"' ,function(err,data){
if(err){
  res.send(err);
}
else
{
  date = new Date(data[0].doj);
date=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();//prints expected fo
  console.log(date);
  data[0].doj=date;
  res.render("profile",{data:data[0]});
}
});
}
else{
  res.redirect("/");
}
});
app.get("/editprofile",function(req,res){
   sess=req.session;
  if(sess.username)  
{
 connection.query('select * from student where name= "'+sess.username+'"' ,function(err,data){
if(err){
  res.send(err);
}
else
{
  date = new Date(data[0].doj);
date=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();//prints expected fo
  console.log(date);
  data[0].doj=date;

  res.render("editprofile",{data:data[0]});
  console.log(data[0]);
}
});
}
else{
  res.redirect("/");
}
});

app.post("/editprofile",function(req,res){
    sess=req.session;
  if(sess.username)  
{
upload(req,res,function(err){
    var magic =["image/jpeg","image/png","image/jpg","image/PNG"];
              var image={
                imagename : req.file.filename,
                imagepath : req.file.path,
                imagesize : req.file.size,
                imagetype : req.file.mimetype
              }
              var name=sess.username;
  console.log(name);
  var nick=req.body.nick;
  var crush=req.body.crush;
  var about=req.body.about;
  var fb=req.body.fb;
  var phone=req.body.phone;
  var email=req.body.email;
  var blood=req.body.blood;
  var doj=req.body.doj;
  var address=req.body.address;
  console.log(doj);
  if(image.imagetype == magic[0] || image.imagetype == magic[1] || image.imagetype == magic[2] || image.imagetype == magic[3]){
connection.query('UPDATE student SET email = "'+email+'", nick ="'+nick+'",  crush="'+crush+'",about ="'+about+'",fb ="'+fb+'",phone ="'+phone+'",file ="'+image.imagename+'",doj ="'+doj+'",blood ="'+blood+'",address ="'+address+'" WHERE name="'+sess.username+'"',function(err,result){
  if(err){
    console.log(err);
  }
else{
  res.render("profile");
}
});
 }        
 });
}
else{
  res.redirect("/");
}
});
app.get('/home',function(req,res){
  sess=req.session;
  if(sess.username)  
{
  connection.query("select name,doj,file from student",function(err,result){
    if(err){
      //res.send("error occured");
    }
    else{
      res.render("home",{data:result});
    }
  });
}
else{
  res.redirect("/");
}
});
app.get("/contact",function(req,res){
  res.render("contact");
});
app.get("/memories",function(req,res){
  connection.query("select * from memories",function(err,result){
  res.render("memories",{data:result});//the data is the output.it is send to front end
});
});
app.get("/memoriesadd",function(req,res){
  res.render("memoriesadd");
});
//when the add button inside the memories click.in this api for upload the file and store into db
app.post('/memoriesadd',function(req,res){
  upload(req,res,function(err){
    var magic =["image/jpeg","image/png","image/jpg","image/JPG","image/PNG"];
              var image={
                imagename : req.file.filename,
                imagepath : req.file.path,
                imagesize : req.file.size,
                imagetype : req.file.mimetype

              }
              var name=req.body.name;
              if(image.imagetype == magic[0] || image.imagetype == magic[1] || image.imagetype == magic[2] || image.imagetype == magic[3] || image.imagetype == magic[4]){
              connection.query("INSERT INTO memories (`name`, `file`) VALUES ('" + name + "','" + image.imagename + "')", function(err){
                if(err){
                res.redirect("/memories");}
          else{
            res.redirect("/memories");
          }
          });
            }
            else{
              res.redirect("/home");
            }
});
});



//it will happen when the profile button click will happen when the edit button click

app.get("/slam",function(req,res){
  sess=req.session;
  if(sess.username)  
{
  res.render("slam");
}
else{
  res.redirect("/");
}
});
app.get("/slamsend",function(req,res){
  sess=req.session;
  if(sess.username)  
{
  res.render("slamsend");
}
else
{
  res.redirect("/");
}
});
app.post("/slamsend",function(req,res){
  sess=req.session;
  if(sess.username)  
{
  var to=req.body.to;
  var content=req.body.content;
  connection.query("INSERT INTO slam (`froma`, `toa`,`content`) VALUES ('" + sess.username + "', '" +to + "','" +content+"')", function(err){
if(err){
  res.send("error occured");
}
else{
  res.redirect("/slam");
}
});
}
else{
  res.redirect("/");
}
});
app.get("/readslam",function(req,res){
  sess=req.session;
  if(sess.username)  
{
 connection.query('select froma,content from slam where toa= "'+sess.username+'"' ,function(err,data){
if(err){
  res.send(err);
}
else{
  res.render("viewslam", {data:data});
}
});
 }
 else{
  res.redirect("/");
 }
});

//search api............
//get the search name from the search bar call post(/read)

//when logout button click
app.get("/birthday",function(req,res){
   sess=req.session;
   var count=0;
  if(sess.username)  
{
connection.query('select doj from student',function(err,doj){
for(var i=0;i<doj.length;i++){
  var date=new Date();
  if(doj[i].doj.getMonth() + 1==date.getMonth() + 1)
  {
    if(doj[i].doj.getDate()==date.getDate()){
var bd=new Date(doj[i].doj);
bd=(bd.getFullYear()  + '-' + (bd.getMonth()+1) + '-' +  bd.getDate());
  }
  else{
    count=1;
  }
}
}
if(count==1){
  res.send("Today No One Has birthday");
}
console.log(bd);
if(bd){
connection.query('select * from student where doj= "'+bd+'"' ,function(err,data){
    if(err){
      console.log(err);
    }
    else{
      res.render("birthday",{data:data});
      //console.log(data);
    }
    });
}
});
}
else{
  res.redirect("/");
}
});

app.post("/sendwish",function(req,res){
var wish=req.body.wish;
console.log(wish);
});
app.get('/settings',function(req,res){
    sess=req.session;
  if(sess.username)  
{
  res.render("settings");}
  else{
    res.redirect("/");
  }
});
app.get('/changepass',function(req,res){
    sess=req.session;
  if(sess.username)  
{
  res.render("changepass");}
  else{
    res.redirect("/");
  }
});
app.get('/userlist',function(req,res){
    sess=req.session;
  if(sess.username)  
{
  connection.query("select name from Register",function(err,data){
  
if (err){
  res.send(err);
}
else{
  res.render("list",{data:data});
}
});
}
  else{
    res.redirect("/");
  }
});
app.post('/changepass',function(req,res){
    sess=req.session;
  if(sess.username)  
{
  var password=req.body.password;
  console.log(password);
  connection.query('UPDATE Register SET password="'+password+'" where name="'+sess.username+'"',function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/settings");
    }
  });
}
else{
  res.redirect("/");
}
});
app.get('/logout',function(req,res){
  
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/');
    }
  });

}); 

app.listen(3000);
