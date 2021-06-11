require("dotenv").config();
const express = require('express')
const path = require('path')
const SERVER_PORT = process.env.PORT || 5000
const app = express();

var bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var mysql = require('mysql');


var con = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME
});

/*

app.get("/users", function (request, response) {
   
      con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        response.send(result)
      });

     //con.end;
    //response.send("<h1>"+result+"<h1>")

  
//response.end();
});



app.get("/orders", function (request, response) {
    
    con.query("SELECT * FROM orders ", function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);
        response.send(result)
      });


});
*/



app.get("/orders", function (request, response) {
    
    con.query("SELECT * FROM orders WHERE user_id = ?", [request.query.user_id], function (err, result, fields) {
        if (err) throw err;
        console.log("req: "+request.query.user_id);
        console.log(result);
        response.send(result)
      });


});
/*
app.get("/seats", function (request, response) {

   
    con.query("SELECT * FROM seats",  function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);
        response.send(result)
      });


});
*/

app.get("/occupiedSeats", function (request, response) {

    var movie_id = request.query.movie_id;
    var booked_date = request.query.booked_date;
    
    con.query("SELECT seat_number FROM seats INNER JOIN orders ON orders.movie_id = ? AND orders.booked_date = ? AND orders.order_id = seats.order_id;",[movie_id, booked_date],  function (err, result, fields) {
        if (err) throw err;
        console.log("req: "+movie_id);
        console.log("req: "+booked_date);
        console.log(result);
        response.send(result)
      });


});


app.post("/ordersTest", function (request, response) {

    console.log("Post request recieved to /ordersTest")
    var timestamp = request.body.timestamp;
    var booked_date = request.body.booked_date;
    var movie_id = request.body.movie_id;
    var user_id = request.body.user_id;
    var seats = request.body.seats;


      console.log(timestamp);
      console.log(booked_date);
      console.log(movie_id);
      console.log(user_id);
      console.log(seats);

      var result = 'timestamp: '+ timestamp+' booked_date: '+booked_date+' movie_id: '+movie_id
      +' user_id: '+user_id+' seats: '+JSON.stringify(seats); 

      response.send(result);

      response.end();

    });

    /*

app.post("/orders", function (request, response) {

    console.log("Post request recieved to /orders")
    var timestamp = request.body.timestamp;
    var booked_date = request.body.booked_date;
    var movie_id = request.body.movie_id;
    var user_id = request.body.user_id;

    
    con.query("insert into orders(timestamp, booked_date, movie_id, user_id) values (?, ?, ?, ?)",
    [timestamp, booked_date, movie_id,user_id], 
    function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log("the insert id is: "+ result.insertId);
        response.send(result)
      });
      
      console.log(timestamp);
      console.log(booked_date);
      console.log(movie_id);
      console.log(user_id);


      //response.end();

    });

  

    app.post('/dynamic', function (req, res) {
        console.log("post requested received with data: ");
       var body = req.body;
    
       var seats = body.seats;
    
        console.log("Seat1: "+seats.seat1);
        console.log("Seat2: "+seats.seat2);
        console.log("Seat3: "+seats.seat3);
        
        res.end();
     
    })



app.get("/seats", function (request, response) {
    response.send("<h1>Seatst<h1>")
    
response.end();
});

app.get("/movies", function (request, response) {
    response.send("<h1>movies<h1>")
    
response.end();
});

*/

app.listen(SERVER_PORT, () => {
	console.log("Server listening on port: " + SERVER_PORT);
})



