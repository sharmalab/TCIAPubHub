
var bindaas_api_key = "4fbb38a3-1821-436c-a44d-8d3bc5efd33e";
var bindaas_host = "http://dragon.cci.emory.edu";
var bindaas_port_or_service = "/services";
var bindaas_project = "/test";
var app_apis = "/TCIA_DOI_APP";
var doi_apis = "/TCIA_DOI_RESOURCES";
var doi_version_apis = "/DOI_RESOURCE_VERSIONS";

var bindaas_getFileForResource = bindaas_host + bindaas_port_or_service + bindaas_project + app_apis + "/query";
var bindaas_getVersionsForDOI = bindaas_host + bindaas_port_or_service + bindaas_project + doi_version_apis + "/query/getVersionsForDoi";
var bindaas_getResourceById = bindaas_host + bindaas_port_or_service + bindaas_project + doi_apis + "/query/getByResourceID";
//var bindaas_getVersionsForDOI
var bindaas_getResourcesForDoi = bindaas_host + bindaas_port_or_service + bindaas_project + doi_apis + "query/getByDoi"; 

exports.citeproc_server = "http://crosscite.org/citeproc";


exports.bindaas_api_key = bindaas_api_key;
exports.bindaas_host = bindaas_host;
exports.bindaas_port_or_service = bindaas_port_or_service;
exports.bindaas_project =  bindaas_project;
exports.app_apis = app_apis;
exports.doi_apis = doi_apis;
exports.doi_version_apis = doi_version_apis;

exports.bindaas_getFileForResource = bindaas_getFileForResource;
exports.bindaas_getVersionsForDOI = bindaas_getVersionsForDOI;
exports.bindaas_getResourcesForDoi = bindaas_getResourcesForDoi;
exports.bindaas_getResourceById = bindaas_getResourceById;
