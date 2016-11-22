// using the splunk sdk to call methods
const Splunkjs = require('splunk-sdk');
const Async = require('async');

// defininf the class
class Splunk {
    constructor(username, password, schema, host, port) {
        // get as a global properites
        this.username = username;
        this.password = password;
        this.schema = schema;
        this.host = host;
        this.port = port || 8000;

        console.log(`connections ready`);

    };

    // connect to the splunk server
    get connect() {
        // connect to splunk and return all data
        let service = new Splunkjs.Service({
            username: this.username,
            password: this.password,
            schema: this.schema,
            host: this.host,
            port: this.port,
            versio: 'default'
        });


        // earliest=@d latest=@h
        let searchQuery  = `search index=quickcarwebsites source=/webroot/qcr/default/www/WEB-INF/lucee/logs/Quickcarrental.log src_ip=* | stats dc(src_ip) AS "distinct ip"`;
        let searchParams = {
            exec_mode: 'normal',
            earliest_time: '@d',
            latest_time: 'now'
        };

        service.search(searchQuery, searchParams, (err, job) => {

            console.log(`Job SID: ${job.sid}`);

            // poll the status of the search
            job.track({ period:200 }, {

                done: (job) => {
                    console.log(`Done!!!`);

                    console.log(` EVENT COUNTS: ${ job.properties().eventCount }`);
                    console.log(` RESULTS COUNT: ${ job.properties().resultCount }`);
                    console.log(` DISK USAGE: ${ job.properties().diskUsage } bytes`);
                    console.log(` PRIORITY: ${ job.properties().priority }`);

                    // loop inside the results
                    job.results({}, (err, results, job) => {

                        if (err) {
                            console.log(`ERROR: ${err}`);
                        }

                        let fields = results.fields;
                        let rows = results.rows;

                        for (let i = 0; i < rows.length; i++) {

                            let values = rows[i];

                            for(let j = 0;  j < values.length; j++) {

                                let field = fields[j];
                                let value = values[j];

                                console.log(`retuls of total Values = ${field} : ${value}`);
                            }
                        }
                    });

                }
            });
        });


    }
};

module.exports = Splunk;
