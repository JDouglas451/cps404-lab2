// List voters for agenda item '1' for the given csv file

function printUsage() {
    console.log("Usage: node lab2http.js [agenda_item_number] [csv_url]");
}

let fs = require("fs");
let http = require("http");
let csv = require("csv-string");
const { exit } = require("process");

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
    console.log("Agenda item number must be an integer greater than zero");
    process.exit(1);
}

// Get the Dallas csv file to parse

let url= "http://www.dallasopendata.com/resource/ts5d-gdq6.csv";

if (process.argv.length == 4) {
    url = process.argv[3];
}

// Request csv

http.get(
    url,
    function (response) {
        let response_body = '';

        if (response.statusCode != 200) {
            console.log(`Error: response ${response.statusCode} from ${url}`);
            exit(1);
        }

        response.setEncoding("utf8");

        response.on("data", function (data) {
            response_body += data;
        }).on("end", function () {
            let parsed_data = csv.parse(response_body, { output: "objects" });

            for (let i = 0; i < parsed_data.length; i++) {
                let record = parsed_data[i];
                if (record.agenda_item_number !== "1") continue;

                let date = new Date(record.date);
                let name = record.voter_name;
                let vote = record.vote;

                console.log(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} - ${name} - ${vote}`);
            }
        });
    }
).on(
    "error",
    function(err) {
        console.log("Request failed: " + err);
    }
);
