const express=require('express');
const app= express();
const jwt=require('jsonwebtoken');
require('dotenv').config()
const mysql = require("mysql")
const bodyParser = require("body-parser");
var cors = require('cors')


var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(3000);
app.use(express.json())



var cors = require('cors')

app.use(cors())

const posts=[{
    username:"athul",
    password:"athul1"
},
{
    username:"arun",
    password:"arun1"
}]

/*--------------------------------------------*/
// sql connection
var con = mysql.createConnection({

    host: 'localhost',
    user: 'root',

    password: 'password',
    database: 'taxproject_db'

});

 

con.connect((err) => {

    if (err) {

        return console.error('error: ' + err.message);

    }

 

    console.log('Connected to the MySQL server.');

});
/*--------------------------------------------*/





app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post))
})

app.post('/login',(req,res)=>{
    console.log("aaaa")
    const username=req.body.email;
    const password = req.body.password;
    console.log(username)
    console.log(password)
    if(req.body.email == undefined || req.body.password == undefined) {

        // console.log("error");

        res.status(500).send({ error: "autentication failed" });

    }

    let query = `select username from users  where username = '${username}' and  password =  '${password}'   `

    // con.query(query,(err,result)=>{
  
    //     if(err) throw err
    
    //     res.json(result)
    
    //   })
    console.log("2"+username)
    console.log("2"+password)
    con.query(query,(err,result)=>{

        if(err || result.length==0){

           res.status(500).send({error:"login failed"});

        }

        else{

                                 //    res.status(200).send({success:"login success"});

             

              let resp={

                  id:result[0].id,

                  displayname:result[0].username

              }
              console.log("resp"+resp)

              let token=jwt.sign(resp,process.env.ACCESS_TOKEN_SECERET,{expiresIn:270});

              res.status(200).send({auth:true,token:token});


              

        }

   

   

    })



      

    // let username = req.body.username;

    // 
   

    // Authenticate the user
  
//   const user={
//               uname:username
//               }
//   const accessToken=jwt.sign(query,process.env.ACCESS_TOKEN_SECERET)
//   res.json({accessToken:accessToken})
//   console.log(accessToken)

})

//Registration

app.post('/registration', urlencodedParser,(req,res)=>{
  
    const username=req.body.username;
  
    console.clear()
  
    console.log(req.body.name)
  
    const pswd=req.body.password;
    const name= req.body.name;
  
  
  
   let query   = `INSERT INTO users (username,password,name) VALUES ("${username}", "${pswd}", "${name}")`;
  
    con.query(query,(err,result)=>{
  
      if(err) throw err
  
      res.json(result)
  
    })
  })




// middileware for verification
function authenticateToken(req,res,next){
    const authHeader= req.headers['authorization']
    const token =authHeader && authHeader.split(' ')[1]
    if(token== null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERET,(err,user=>{
        if(err)return res.sendStatus(403)
        req.user=user
        next()
    }))
}