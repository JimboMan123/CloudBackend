require("dotenv").config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();



var mysql = require('mysql');


var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME
});

app.get("/users", function (request, response) {
    
    con.connect(function(err) {
      if (err) throw err;

      con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        response.send(result)
      });
    });

    //response.send("<h1>"+result+"<h1>")
    
  
//response.end();
});

app.get("/orders", function (request, response) {
    response.send("<h1>Order<h1>")
    
response.end();
});

app.get("/seats", function (request, response) {
    response.send("<h1>Seatst<h1>")
    
response.end();
});

app.get("/movies", function (request, response) {
    response.send("<h1>movies<h1>")
    
response.end();
});



app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on port ${ PORT }`))

