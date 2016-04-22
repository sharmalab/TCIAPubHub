var express = require("express");
var router = express.Router();
//var app = require("../app");
var http = require("http");
var restler = require("restler");
var fs = require("fs");
var superagent = require("superagent");
var async = require("async");



var bindaas_api_key = "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";
var bindaas_host = "http://dragon.cci.emory.edu";
var bindaas_port_or_service = "/services";
var bindaas_project = "/test";
var app_apis = "/TCIA_DOI_APP";
var doi_apis = "/TCIA_DOI_RESOURCES";
var doi_version_apis = "/DOI_RESOURCE_VERSIONS";

var bindaas_getFileForResource = bindaas_host + bindaas_port_or_service + bindaas_project + app_apis + "/query";
var bindaas_getVersionsForDOI = bindaas_host + bindaas_port_or_service + bindaas_project + doi_version_apis + "/query/getVersionsForDoi";
var bindaas_resourceById = bindaas_host + bindaas_port_or_service + bindaas_project + doi_apis + "/query/getByResourceID";




/*
var host = "http://dragon.cci.emory.edu";
var port = 9099;
var path = "/services/test/TCIA_DOI_APP/query";
var resource_path = "/services/test/TCIA_DOI_RESOURCES";
*/


//var bindaas_pubhubEndPoint = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_APP/query";
var citeproc_url = "http://crosscite.org/citeproc";
//var bindaas_getVersionsForDOI = "/services/test/DOI_RESOURCE_VERSIONS/query/getVersionsForDoi";



var createUrl = function(endpoint) {
    //var url = host+ ":"+port + path + endpoint;
    var url = bindaas_host + bindaas_port_or_service + bindaas_project + app_apis +"/query" + endpoint;
    return url;
};

router.get("/test/getAllDoi", function(req, res){
    var data = fs.readFileSync("dois.json");
    var d = JSON.parse(data);
    console.log(d);    
    res.json(d);

});

router.get("/api/getCitation", function(req, res){
    var doi = req.query.doi;
    var style = req.query.style;
    var lang = req.query.lang;
    console.log(doi);

    var url = citeproc_url+ "/format?doi="+encodeURIComponent(doi) + "&style=" + encodeURIComponent(style)+ "&lang=" +encodeURIComponent(lang);
    console.log(url);
    restler.get(url).on("complete", function(result){
        res.json(result);
    });
});

router.get("/api/getAllDoi", function(req, res){
    var getAllUrl = "http://localhost:3003/query/getAllDoi";
    restler.get(getAllUrl).on("complete", function(result){
        console.log(result);
        //var response = JSON.parse(result);
        //console.log(response);
        res.json(result);
    });
});

router.get("/api/getFile", function(req, res){

    var resourceID = req.query.resourceID;
    var fileName = req.query.fileName;
    //var bindaas_getFileForResource = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_RESOURCES/query/getFileForResourceClone";
    //var bindaas_api_key = "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";

    
    var url = bindaas_getFileForResource + "?api_key=" +bindaas_api_key + "&resourceID=" + resourceID;
    console.log(url);

    var request = superagent.get(url);
       res.header('Content-Disposition', 'attachment; filename="' + fileName + '"');

    request.pipe(res);

    /*
    superagent.get(url)
        .end(function(fres){
            console.log(fres);
            return res.send(fres);
        });     
    */
});


router.get("/query/getAllDoi", function(req, res) {
//    http://imaging.cci.emory.edu:9099/services/test/Metadata/query/getAll?api_key=c0327219-68b2-4a40-9801-fc99e8e1e76f&
    var getAllUrl = createUrl("/getAll?api_key=4fbb38a3-1821-436c-a44d-8d3bc5efd33e");
    console.log(getAllUrl);
    console.log("here");
    var request = http.get(getAllUrl, function(res_){
        //res.send(res_)
        //console.log(res_);

        console.log(res_.statusCode);
        var DOIs = "";
        res_.on("data", function(data){
            //console.log(data);
            DOIs+=data;
        });
        console.log("...");
        res.on("error", function(err){
            console.log("error");
            res.json(JSON.parse({error: err})); 
        });
        res_.on("end", function(){
            //var response = JSON.parse(DOIs);
            //console.log(data);
            var response = DOIs;
            console.log("....");
            console.log(response);
            try{
                res.json(JSON.parse(response));
            } catch(e){
                res.send(500);
            }
        });
    

    }).on("error", function(error){
        console.log("error");
        console.log(error);
        res.send(500);
    });
    //console.log(request);
});

router.get("/api/getVersionsForDoi" ,function(req, res){
    //var api_key = "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";
    var doi = req.query.doi;
    //console.log(doi);
    //console.log(url);
    if(doi){
        console.log("asdfadsfsadfSA");
        //var url = bindaas_getVersionsForDOI + "?api_key="+api_key + "&doi=" + (doi);
        console.log(bindaas_getVersionsForDOI);
        console.log("....");
        console.log(bindaas_api_key);
        //console.log(url); 
        var url = bindaas_getVersionsForDOI + "?api_key=" + bindaas_api_key + "&doi=" + (doi);
        console.log(url);
        //var getverUrl = bindaas_getVersionsForDOI + "?api_key=" + bindaas_api_key + "&doi=" + (doi);

         
        http.get(url, function(ver_res){
            var versions = "";
            
            ver_res.on("data", function(data){
                versions += data;
                console.log(data);
            });
            ver_res.on("end", function(){
                versions = JSON.parse(versions);
                console.log(versions);
                res.json(versions);
                return;
            });
            ver_res.on("err", function(){
                return res.status(408).send("Couldn't connect to bindaas. Timeed out");
            });
        });
        console.log(url);
        //res.json({"url": url});
        
    } else {
        return res.status(404).send("Couldn't find parameter 'doi'");
    }
});

router.get("/api/getResources", function(req, res) {
    var doi = req.query.doi;
    var version = req.query.version;
    //var bindaas_resourceById = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_RESOURCES/query/getByResourceID";
    var api_key = bindaas_api_key;
    var doi = req.query.doi;
    if(doi){

        var url = bindaas_getVersionsForDOI + "?api_key="+api_key + "&doi=" + (doi);
        console.log(url); 
        http.get(url, function(ver_res){
            var versions = "";
            ver_res.on("data", function(data){
                versions += data;
                console.log(data);
            });
            ver_res.on("end", function(){
                versions = JSON.parse(versions);
                console.log(versions);
                var versionID = req.query.version;
                var resourceIDs = [];
                for(var v in versions){
                    var version = versions[v];
                    if(version.versionID == versionID){
                        max_version = version.versionID;
                        resourceIDs = version.resourceIDs;
                    }
                }
                
                var resources = []
                async.each(resourceIDs, function(resourceID, callback) {

                    superagent.get(bindaas_resourceById+"?api_key="+api_key+"&resourceID="+resourceID)
                        .end(function(err, res){
                            resources.push(res.body);
                            callback();
                        });
                }, function(err){
                    console.log(resources);
                    return res.json(resources);
                    
                });
               
                //fetch 

                //return res.json(versions);
            });
            ver_res.on("err", function(){
                return res.status(408).send("Couldn't connect to bindaas. Timeed out");
            });
        });
        console.log(url);
        //res.json({"url": url});
        
    } else {
        return res.status(404).send("Couldn't find parameter 'doi'");
    }




});

router.get("/api/getResourcesForDoi", function(req, res) {
    var doi=req.query.doi;
    var version = req.query.version;

    var api_key="4fbb38a3-1821-436c-a44d-8d3bc5efd33e"; 

    http.get("http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_RESOURCES/query/getByDoi?doi="+doi+"&version=" +version + "&api_key="+api_key, function(res_){
        var resources ="";
        res_.on("data", function(data){
            resources += data;
            console.log(data);
        });
        res_.on("end", function(){
            var response = resources;
            console.log(resources);
            return res.json(JSON.parse(response));
        });
        res_.on("error", function(err){
            return res.json({"error": err}); 
        });
    });
});

router.get("/api/getDoi", function(req, res) {
    var doi = req.query.doi;

    var url = createUrl("/getByDoi?api_key=4fbb38a3-1821-436c-a44d-8d3bc5efd33e&doi="+doi);
    console.log(url);
    http.get(url, function(res_){
        var DOI = "";
        console.log(res_.statusCode);
        res_.on("data", function(data){
            DOI+=data;
        });
        res_.on("end", function(){
            var response = DOI;
            console.log(response);
            res.json(JSON.parse(response));
        });
    });
    //res.send("Hello");
});

/* GET home page. */
router.get("/", function(req, res) {
    res.render("index", { title: "Express" });
});
router.get("/index", function(req, res) {
    res.render("index", { title: "Express" });
});



router.get("/ganesh", function(req, res){
    res.json({"hello": "world"});
});
router.get("/details", function(req, res){
    res.render("doi");     
});

module.exports = router;
