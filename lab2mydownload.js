// List voters for the requested agenda item number,
// using an asynchronous get request

let http = require("http");
let csv = require("csv-string");
const { exit } = require("process");

function download(url) {
    return new Promise((resolve, reject) => {
        http.get(
            url,
            (response) => {
                const { statusCode } = response;
                
                if (statusCode !== 200) {
                    reject(`Error: response ${statusCode} from ${url}`);
                }

                response.setEncoding('utf8');

                let data = "";

                response.on(
                    'data',
                    (chunk) => { data += chunk; }
                );

                response.on(
                    'end',
                    () => { resolve(data); }
                );
            }
        );
    })
}

// Get the agenda item number to look up

let agenda_item_number = 1;

if (process.argv.length > 2) {
    agenda_item_number = process.argv[2];

    if (agenda_item_number === "--help" || agenda_item_number === "-?") {
        printUsage();
        process.exit(1);
    }
    
    agenda_item_number = parseInt(agenda_item_number);
}

if (NaN === agenda_item_number || 0 > agenda_item_number) {
    printUsage();
    console.log("Agenda item number must be an integer greater than or equal to zero");
    process.exit(1);
}

// Get the Dallas opendata link to use

let url= "http://www.dallasopendata.com/resource/ts5d-gdq6.csv";

if (process.argv.length == 4) {
    url = process.argv[3];
}

// Download, parse, and output data

download(url).then(
    (data) => {
        let parsed_data = csv.parse(data, { output: "objects" });
        let results = [];
    
        for (let i = 0; i < parsed_data.length; i++) {
            let record = parsed_data[i];
            if (record.agenda_item_number != agenda_item_number) continue;
    
            let date = new Date(record.date);
            let name = record.voter_name;
            let vote = record.vote;
    
            results.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} - ${name} - ${vote}`);
        }
    
        // sort results and print
    
        results.sort((a, b) => a.localeCompare(b));
        results.forEach((val) => console.log(val));
    }
).catch(
    (err) => {
        console.log(err);
        exit(1);
    }
);
