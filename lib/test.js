const SplunkConnection = require('./splunk/');

const internals = {};

internals.splunk = new SplunkConnection('admin', 'qcr2020', 'https', 'splunk.quickcarrental.com', 8089)
internals.splunk.connect;
