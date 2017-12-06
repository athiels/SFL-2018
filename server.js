var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var multerS3 = require('multer-s3');
var Busboy = require('busboy');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var path = require('path');
public = __dirname + '/public/';
app.use(express.static(public));
app.get("/", function (req, res) {
    res.sendFile(public + "index.html");
});

var port = 80;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var uploadsBucket = 'sfl-uploads';
var videosBucket = 'sfl-videos';

users = ["cekz","fwezi","ijunui", "Arne"]

app.get('/users', function (req, res) {
    res.json(users);
});

app.get('/getvideos', function (req, res) {
	var videos = [];
	var params = { Bucket: videosBucket };
	s3.listObjects(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			for (var i=0; i< data.Contents.length; i++) {
				videos.push("https://s3.eu-central-1.amazonaws.com/sfl-videos/"+data.Contents[i].Key);
			}
			res.json(videos);
		}
	});	
});

app.get('/getuploads', function (req, res) {
	var uploads = [];
	var params = { Bucket: uploadsBucket };
	s3.listObjects(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			for (var i=0; i< data.Contents.length; i++) {
				var arr = [];
				arr.push(data.Contents[i].Key);
				arr.push("https://s3.eu-central-1.amazonaws.com/sfl-uploads/"+data.Contents[i].Key);
				uploads.push(arr);
			}
			res.json(uploads);
		}
	});	
});


app.post('/upload', function (req, res) {
	var busboy = new Busboy({
		headers: req.headers
	});
	var files = 0;
	var user = req.headers['user'];
	var finished = false;
	var uploadList = [];
	
	busboy.on('file', function (fieldname, file, filename) {
		var path = require('path')
		var ext = path.extname(filename);

		fname = user + ext;
		console.log(fname + " is being uploaded");
		
		s3.upload({
				Bucket: uploadsBucket,
				Key: fname,
				Body: file,
				ACL: 'public-read'
			}, function(err, data) {
				if (err) {
					res.status(500).end();
					return console.log('Error: ', err.message);					
				}
				console.log(fname + " succesvol geupload naar Amazon S3");				
				res.status(200).end();
			});
		});
	
	busboy.on('finish', function () {
		finished = true;
	});
	return req.pipe(busboy);
});


app.post('/acceptvideo', function (req, res) {
	var fname = req.headers['fname'];
	var params = {
		Bucket: videosBucket, 
		CopySource: uploadsBucket + "/" + fname, 
		Key: fname
	};
	s3.copyObject(params, function(err, data) {
		if (err) { 
			console.log(err, err.stack); 
			res.status(500).end();
		}
		else {
			var params = {
			Bucket: uploadsBucket, 
			Key: fname
			};
			s3.deleteObject(params, function(err, data) {
				if (err) { 
					console.log(err, err.stack); 
					res.status(500).end();
				}
				else {
					console.log(fname + " goedgekeurd");
					setAclPublic(videosBucket, fname);
					res.status(200).end();
				}
			});
		}
	});
});

function setAclPublic(bucket, key) {
	var params = {
		Bucket: bucket, 
		Key: key,
		ACL: "public-read"
	};
	s3.putObjectAcl(params, function(err, data) {
	   if (err) console.log(err, err.stack);
	   else     console.log(fname +" made public.");
	});
}

app.post('/rejectvideo', function (req, res) {
	var fname = req.headers['fname'];
	var params = {
		Bucket: uploadsBucket, 
		Key: fname
		};
	s3.deleteObject(params, function(err, data) {
		if (err) { 
			console.log(err, err.stack); 
			res.status(500).end();
		}
		else {
			console.log(fname + " goedgekeurd");
			res.status(200).end();
		}
	});
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

