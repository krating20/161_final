const path = require("path");
const fs = require("fs/promises");

/**
 * @function serveFolder
 * @description Retrieves any file in the staticFilesDirectory. If it
 *              doesn't exist, returns a NOT_FOUND or else it returns an
 *              INTERNAL_ERROR
 */
const servePublic = function (req, res) {
    //console.log("req url: ",req.url)
    let mypath = path.join(__dirname,"../",req.url)
     console.log("1st path",mypath)
    //console.log("PATH:",mypath)
   //return the promise
    return fs.readFile(mypath)
    .then(function(fileContents){
       //console.log("reading...")
        if(mypath.includes(".js")){
            res.writeHead(200,{'Content-Type': 'application/json'})
        }
        else if(mypath.includes(".html")){
            res.writeHead(200,{'Content-Type': 'text/html'})
        }
        else{
            res.writeHead(200,{'Content-Type':'text/css'})
        }
        res.write(fileContents)
        res.end()
        return
    })
    .catch(function(err){
    if (err.code === "ENOENT") {
        //console.log(`${path} could not be found, returning 404`)
        res.writeHead(404)
    } 
    else {
        //console.log('An error occurred', err)
        res.writeHead(500)
        //res.end()
    }
    res.end()
    })
};

module.exports = servePublic;
