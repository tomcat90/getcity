var url = require('url');
var http = require('http');
var fs = require('fs');
var ROOT_DIR = process.cwd();
http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  console.log("URL path " + urlObj.pathname);
  console.log("URL search " + urlObj.search);
  console.log("URL query " + urlObj.query["q"]);

  if (urlObj.pathname.indexOf("getcity") !=-1) {
    console.log("In REST Service");
    fs.readFile('cities.dat.txt', function(err,data) {
    	if (err) throw err;
    	var jsonResult = [];
    	var myRe = new RegExp("^"+urlObj.query['q']);
    	console.log(myRe);
    	cities = data.toString().split("\n");
    	for (var i = 0; i < cities.length; i++) {
    		var result = cities[i].search(myRe);
    		if (result != -1) {
    			console.log(cities[i]);
    			jsonResult.push({city:cities[i]});
    		}
    	}
    	console.log(jsonResult);
    	res.writeHead(200);
			res.end(JSON.stringify(jsonResult));
    });
  } else {
	  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
	    if (err) {
	      res.writeHead(404);
	      res.end(JSON.stringify(err));
	      return;
	    }
      res.writeHead(200);
      res.end(data);

  	});
	}
}).listen(80);
