var express = require("express");
var router = express.Router();
//var app = require("../app");
var http = require("http");
var restler = require("restler");
var fs = require("fs");
var superagent = require("superagent");
var async = require("async");

var config = require("../config.js");

var bindaas_api_key = config.bindaas_api_key;
var bindaas_host = config.bindaas_host;
var bindaas_port_or_service = config.bindaas_port_or_service;
var bindaas_project = config.bindaas_project;
var app_apis = config.app_apis;
var doi_apis = config.doi_apis;
var doi_version_apis = config.doi_version_apis;

var bindaas_getFileForResource = config.bindaas_getFileForResource;
var bindaas_getVersionsForDOI = config.bindaas_getVersionsForDOI;
var bindaas_getResourcesForDoi = config.bindaas_getResourcesForDoi;
var bindaas_getResourceById = config.bindaas_getResourceById;

/*
var host = "http://dragon.cci.emory.edu";
var port = 9099;
var path = "/services/test/TCIA_DOI_APP/query";
var resource_path = "/services/test/TCIA_DOI_RESOURCES";
*/

//var bindaas_pubhubEndPoint = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_APP/query";
var citeproc_url = "http://crosscite.org/citeproc";
var citeproc_url = config.citeproc_server;

//var bindaas_getVersionsForDOI = "/services/test/DOI_RESOURCE_VERSIONS/query/getVersionsForDoi";

var createUrl = function(endpoint) {
  //var url = host+ ":"+port + path + endpoint;
  var url =
    bindaas_host +
    bindaas_port_or_service +
    bindaas_project +
    app_apis +
    "/query" +
    endpoint;
  return url;
};

router.get("/test/getAllDoi", function(req, res) {
  var data = fs.readFileSync("dois.json");
  var d = JSON.parse(data);
  console.log(d);
  res.json(d);
});

router.get("/api/getCitation", function(req, res) {
  var doi = req.query.doi;
  var style = req.query.style;
  var lang = req.query.lang;
  console.log(doi);

  var url =
    citeproc_url +
    "/format?doi=" +
    encodeURIComponent(doi) +
    "&style=" +
    encodeURIComponent(style) +
    "&lang=" +
    encodeURIComponent(lang);
  console.log(url);
  restler.get(url).on("complete", function(result) {
    res.json(result);
  });
});

router.get("/api/getAllDoi", function(req, res) {
  var getAllUrl = createUrl("/getAll?api_key=" + bindaas_api_key);
  console.log(getAllUrl);
  console.log("here");
  var request = http
    .get(getAllUrl, function(res_) {
      //res.send(res_)
      //console.log(res_);

      console.log(res_.statusCode);
      var DOIs = "";
      res_.on("data", function(data) {
        //console.log(data);
        DOIs += data;
      });
      console.log("...");
      res.on("error", function(err) {
        console.log("error");
        res.json(JSON.parse({ error: err }));
      });
      res_.on("end", function() {
        //var response = JSON.parse(DOIs);
        //console.log(data);
        var response = DOIs;
        console.log("....");
        console.log(response);
        try {
          res.json(JSON.parse(response));
        } catch (e) {
          res.send(500);
        }
      });
    })
    .on("error", function(error) {
      console.log("error");
      console.log(error);
      res.send(500);
    });
});

router.get("/api/getFile", function(req, res) {
  var resourceID = req.query.resourceID;
  var fileName = req.query.fileName;
  //var bindaas_getFileForResource = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_RESOURCES/query/getFileForResourceClone";
  //var bindaas_api_key = "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";

  var url =
    bindaas_getFileForResource +
    "?api_key=" +
    bindaas_api_key +
    "&resourceID=" +
    resourceID;
  console.log(url);

  var request = superagent.get(url);
  res.header("Content-Disposition", 'attachment; filename="' + fileName + '"');

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
  //console.log(request);
});

router.get("/api/getVersionsForDoi", function(req, res) {
  //var api_key = "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";
  var doi = req.query.doi;
  //console.log(doi);
  //console.log(url);
  if (doi) {
    console.log("asdfadsfsadfSA");
    //var url = bindaas_getVersionsForDOI + "?api_key="+api_key + "&doi=" + (doi);
    console.log(bindaas_getVersionsForDOI);
    console.log("....");
    console.log(bindaas_api_key);
    //console.log(url);
    var url =
      bindaas_getVersionsForDOI + "?api_key=" + bindaas_api_key + "&doi=" + doi;
    console.log(url);
    //var getverUrl = bindaas_getVersionsForDOI + "?api_key=" + bindaas_api_key + "&doi=" + (doi);

    http.get(url, function(ver_res) {
      var versions = "";

      ver_res.on("data", function(data) {
        versions += data;
        console.log(data);
      });
      ver_res.on("end", function() {
        try {
          versions = JSON.parse(versions);
        } catch (e) {
          return res.status(500);
        }
        console.log(versions);
        res.json(versions);
        return;
      });
      ver_res.on("err", function() {
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
  //var bindaas_resourceById = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_RESOURCES/query/getByResourceID";
  var api_key = bindaas_api_key;
  var doi = req.query.doi;
  if (doi) {
    var url = bindaas_getVersionsForDOI + "?api_key=" + api_key + "&doi=" + doi;
    console.log(url);
    http.get(url, function(ver_res) {
      var versions = "";
      ver_res.on("data", function(data) {
        versions += data;
        console.log(data);
      });
      ver_res.on("end", function() {
        try {
          versions = JSON.parse(versions);
        } catch (e) {
          return res.status(500);
        }
        console.log(versions);
        var versionID = req.query.version;
        var resourceIDs = [];
        for (var v in versions) {
          var version = versions[v];
          if (!versionID || version.versionID == versionID) {
            max_version = version.versionID;
            resourceIDs = version.resourceIDs;
          }
        }

        var resources = [];
        async.each(
          resourceIDs,
          function(resourceID, callback) {
            superagent
              .get(
                bindaas_getResourceById +
                  "?api_key=" +
                  api_key +
                  "&resourceID=" +
                  resourceID
              )
              .end(function(err, res) {
                resources.push(res.body);
                callback();
              });
          },
          function(err) {
            console.log(resources);
            return res.json(resources);
          }
        );

        //fetch

        //return res.json(versions);
      });
      ver_res.on("err", function() {
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
  var doi = req.query.doi;
  var version = req.query.version;
  var api_key = bindaas_api_key;
  //var api_key="4fbb38a3-1821-436c-a44d-8d3bc5efd33e";
  //var bindaas_getResourcesForDoi = "http://dragon.cci.emory.edu:9099/services/test/TCIA_DOI_RESOURCES/query/getByDoi?doi="
  var url =
    bindaas_getResourcesForDoi +
    "?doi=" +
    doi +
    "&version=" +
    version +
    "&api_key=" +
    api_key;

  http.get(url, function(res_) {
    var resources = "";
    res_.on("data", function(data) {
      resources += data;
      console.log(data);
    });
    res_.on("end", function() {
      var response = resources;
      try {
        response = JSON.parse(response);
      } catch (e) {
        return res.status(500);
      }
      console.log(resources);
      return res.json(response);
    });
    res_.on("error", function(err) {
      return res.json({ error: err });
    });
  });
});

router.get("/api/getDoi", function(req, res) {
  var doi = req.query.doi;

  var url = createUrl("/getByDoi?api_key=" + bindaas_api_key + "&doi=" + doi);
  console.log(url);
  http.get(url, function(res_) {
    var DOI = "";
    console.log(res_.statusCode);
    res_.on("data", function(data) {
      DOI += data;
    });
    res_.on("end", function() {
      var response = DOI;
      console.log(response);
      try {
        response = JSON.parse(response);
        return res.json(response);
      } catch (e) {
        return res.status(500);
      }
      //res.json(JSON.parse(response));
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

router.get("/ganesh", function(req, res) {
  res.json({ hello: "world" });
});
router.get("/details", function(req, res) {
  res.render("doi");
});

module.exports = router;
