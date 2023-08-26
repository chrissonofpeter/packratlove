// *******************************************
// NODE RESOURCES
// These are all plugins to Node.js that have
// been installed via npm
// *******************************************
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const mysql = require('mysql');

const { JSDOM } = require( 'jsdom' );
const { window } = new JSDOM( "" );
const $ = require( 'jquery' )( window );
const Enumerable = require('linq');

// test linq

let count = Enumerable.range(1, 10).count(i => i < 5);
console.log("Enumerable count = " + count); // 4


// Body Parser
// Parse incoming request bodies in a middleware before y
// our handlers, available under the req.body property.
const bodyParser = require('body-parser')();

//app.use( bodyParser.json() );
//app.use( bodyParser.urlencoded({extended: false}) )


// *******************************************
// DB CONNECTIONS
// *******************************************
// db.auth('adminUser','uf09w8t43y!!')
// const url = "mongodb://adminUser:uf09w8t43y!!@localhost:27017/";
const url = "mongodb://localhost:27017/";
const noteArray = [];

var con = mysql.createConnection({
	 host: "localhost", 
	 user: "root",
	 password: "987yt6gyo!!hpj807hoiupJ07yHGOuj97ohGI990UN",
	 port: 8889,
	 database: "notes"
});
// https://stackoverflow.com/questions/14087924/cannot-enqueue-handshake-after-invoking-quit
con.connect();


// *******************************************
// INSTRUMENTS
// *******************************************
var greaterThanTen = (num)=>{
	num >= 10 ? num : num = "0" + num;
	return num;
	}


// create code for current date
function todaysDate() {
	var date = [];
	var fullDate = new Date()
	var month = greaterThanTen ( fullDate.getMonth()+1 );
	date.push( month );
	var day = greaterThanTen ( fullDate.getDate() );
	date.push( day );
	var year = fullDate.getFullYear();
	date.push( year );
    
    return date.join("")
    }


// create code for current time
function currentTime() {
	var time = [];
	var currentDate = new Date();
	var hour = greaterThanTen ( currentDate.getHours() );
	time.push ( hour );
	var minute = greaterThanTen ( currentDate.getMinutes() );
	time.push ( minute );
	var second = greaterThanTen ( currentDate.getSeconds() );
	time.push ( second );
	//var mSecond = currentDate.getMilliseconds();
	//time.push ( mSecond );
	
	return time.join("");
    }



// *******************************************
// MAIN
// *******************************************
app.get('/', (req, res) => {
	//res.sendFile(__dirname + '/index.html');
	res.sendFile(__dirname + '/note.html');
  });

  app.get('/note', (req, res) => {
	res.sendFile(__dirname + '/notecards.html');
	
  });


io.on('connection', (socket) => {
	console.log('a user connected');

	// *******************************************
	// GET ALL MONGO NOTES
	// *******************************************
	socket.on('get all notes', (proj) => {
		console.log('get all notes for _' + proj + '_ project');
		var jsonData = [];

  		//  db.inventory.find( { qty: { $gte: 20 } } )
  		//  db.inventory.find( { qty: { $in: [ 5, 15 ] } } )

		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("test");  
			dbo.collection("note").find( { version: "0000001" } ).toArray(function(err, result) {
    			if (err) throw err;
    			console.log("\n\n\n****************\nConnected to mongoDB!\n****************");
    			Object.keys(result).forEach(function(key) {
      				jsonData.push( result[key] );
      				console.log(result[key]);
      				});
				db.close();
				io.emit('get all notes', jsonData); 
				});
			});
		});



	// *******************************************
	// GET SQL NOTES BY FOLDER
	// MY SQL
	// *******************************************
	socket.on('get notes by folder', (fid) => {
		console.log('get all notes for folder id' + fid );

		// https://stackoverflow.com/questions/41758870/how-to-convert-result-table-to-json-array-in-mysql/41760134
		var sql="SELECT JSON_ARRAYAGG(JSON_OBJECT('noteID', noteID, 'noteTitle', noteTitle, 'noteText', noteText, 'locX', locX, 'locY', locY, 'locZ', locZ)) from note where FolderFK=" + fid;
		var out;
		var out2;

		// make connection to the database.
		//con.connect(function(err) {
		//	if (err) throw err;
			// if connection is successful

			con.query(sql, function (err, result, fields) {
	  			// if any error while executing above query, throw error
	  			if (err) throw err;
	  			// if there is no error, you have the result
	  			// iterate for all the rows in result
				
				//jsonObj = JSON.stringify(result);
				out = JSON.stringify(result).split("\":\"");
				//var out2 = out[1].replace(/\[\]/g,"");
				var out2 = out[1].replace("[","");
				var out2 = out2.replace("]","");
				out2 = out[1].replace("\"}]","");
				out2 = out2.replace( /\\\"/g,"\"");
				
				//console.log( "out2="+out2 );
				io.emit('return notes by folder', out2);
				});

  		//	});
		 });


	// *******************************************
	// MOVE 3D NOTE
	// MYSQL
	// *******************************************
	socket.on('move 3dnote', (obj) => {
		console.log('move 3dnote: ' + obj.id);
		console.log("noteID="+obj.id+",note x="+obj.x)

		var sql="UPDATE note SET locX=" + obj.x + ", locY=" + obj.y + ", locZ=" + obj.z + " WHERE noteID=" + obj.id;

		con.query(sql, function (err, result, fields) {
			// if any error while executing above query, throw error
			if (err) throw err;

		  	io.emit('location update result', result);
		  	});
		});



	// *******************************************
	// ADD NOTE
	// MONGO DB
	// *******************************************
	socket.on('add note', (obj) => {
		var out = JSON.stringify(obj); 
		console.log('note: ' + out);
		// var obj = { id: dt, width: w, height: h, color: c, type: t, locX: 30, locY: 30, z: 200, content: "", connections: [] };

		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			var noteObj = { version:"0000001", 
							id: obj.id, 
							width: obj.width, 
							height: obj.height, 
							color: obj.color, 
							type: obj.type, 
							locX: obj.locX, 
							locY: obj.locY, 
							z: obj.z,
							content: obj.content,
							arrConnect: obj.arrConnect
							};
			dbo.collection("note").insertOne(noteObj, function(err, res) {
	  			if (err) throw err;
	  			console.log( "note inserted: " + obj.id );
	  			db.close();
				});
			  });
			  
		io.emit('add note', obj);

	    });


	// *******************************************
	// MOVE NOTE
	// MONGO DB
	// *******************************************
	socket.on('move note', (obj) => {
		console.log('move note: ' + obj.id);
		// var obj = { id: dt, width: w, height: h, color: c, type: t, locX: 30, locY: 30, z: 200, content: "", connections: [] };

		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			var query = { id: obj.id };
			var newVal = { $set: {locX: obj.x, locY: obj.y } };

			dbo.collection("note").updateOne(query, newVal, function(err, res) {
	  			if (err) throw err;
	  			console.log( "note updated: locX=" + obj.x + ", locY=" + obj.y );
	  			db.close();
				});
			  });
			  
		//io.emit('update note', obj);

		});


	// *******************************************
	// UPDATE NOTE TEXT
	// https://www.w3schools.com/nodejs/nodejs_mongodb_update.asp
	// MONGO DB
	// *******************************************
	socket.on('update note text', (obj) => {
		// var obj = { id:idVal, content:textVal };
		console.log(obj.id + " content update: " + obj.content);

		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("test");
			var query = { id: obj.id };
			var newVal = { $set: {content: obj.content } };

			dbo.collection("note").updateOne(query, newVal, function(err, res) {
	  			if (err) throw err;
	  			db.close();
				});
			  });
		});


	socket.on('disconnect', () => {
	  console.log('user disconnected');
	});

  });



http.listen(3000, () => {
    console.log('listening on *:3000');
  });






