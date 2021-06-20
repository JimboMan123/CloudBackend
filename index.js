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





app.get("/orders", function (request, response) {
    
    con.query("SELECT * FROM orders WHERE user_id = ?", [request.query.user_id], function (err, result, fields) {
        if (err) throw err;
        console.log("req: "+request.query.user_id);
        console.log(result);
        response.send(result)
      });


});

app.get("/getOrder", function (request, response) {
    
    con.query("select  o.order_id \"Order ID\" , o.booked_date \"Date\", s.seat_number \"Seats\", " +
    "m.title \"Title\" from orders o, seats s, movies m  where o.order_id = s.order_id AND" +
     " o.movie_id = m.movie_id AND o.user_id = ?"
    , [request.query.user_id], function (err, result, fields) {
        if (err) throw err;
        console.log("req: "+request.query.user_id);
        console.log(result);
        response.send(result)
      });

});


app.get("/seats", function (request, response) {

   
    con.query("SELECT * FROM seats",  function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);
        response.send(result)
      });


});


app.get("/login", function (request, response) {

    var user_name = request.query.username;
    var password = request.query.password;
    
    con.query("SELECT user_id, username  FROM users where username= ? AND password = ?",[user_name, password],  function (err, result, fields) {
        if (err) throw err;
        
        if(result.length==0){
            response.status(404).send({ error: "Bad username/password combination" });
        } else response.status(200).send({ "username": user_name, "user_id":result[0].user_id });

        console.log(result);
        
      });


});

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


app.post("/orders", function (request, response) {

    console.log("Post request recieved to /orders")
    var timestamp = request.body.timestamp;
    var booked_date = request.body.booked_date;
    var movie_id = request.body.movie_id;
    var user_id = request.body.user_id;
    var seats = request.body.seats;


      //var result = 'timestamp: '+ timestamp+' booked_date: '+booked_date+' movie_id: '+movie_id
      //+' user_id: '+user_id+' seats: '+JSON.stringify(seats); 

      

    con.query("insert into orders(timestamp, booked_date, movie_id, user_id) values (?, ?, ?, ?)",
    [timestamp, booked_date, movie_id,user_id], 
    function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log("the insert id is: "+ result.insertId);
        var orderID = result.insertId;

        for(var i = 0; i < seats.length; i++) {
            var seatNumber = seats[i];
            console.log("obj.seat: "+seatNumber);

    con.query("insert into seats(seat_number, order_id) values (?, ?)",
    [seatNumber, orderID], 
    function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log("the insert id is: "+ result.insertId);
            
    });

        }

        response.send(result)
      });
    });


    app.get("/movie", function (request, response) {

        
        con.query("SELECT * FROM movies WHERE movies.movie_id= ?", [request.query.movie_id],  function (err, result, fields) {
            if (err) throw err;
            
            console.log(result);
            response.send(result)
          });
    
    
    });

    


app.listen(SERVER_PORT, () => {
	console.log("Server listening on port: " + SERVER_PORT);
})



