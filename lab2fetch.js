// List voters for the requested agenda item number, requesting data via fetch()

let csv = require("csv-string");
const { exit } = require("process");

function printUsage() {
    console.log("Usage: node lab2http.js [agenda_item_number] [csv_url]");
}

async function printItemData(item_number, url) {
    let response = await fetch(url);

    if (!response.ok) {
        console.log(`Error: response ${response.status} from ${url}`);
        exit(1);
    }

    let data = await response.text();
    let parsed_data = csv.parse(data, { output: "objects" });
    let results = [];

    for (let i = 0; i < parsed_data.length; i++) {
        let record = parsed_data[i];
        if (record.agenda_item_number != item_number) continue;

        let date = new Date(record.date);
        let name = record.voter_name;
        let vote = record.vote;

        results.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} - ${name} - ${vote}`);
    }

    // sort results and print

    results.sort((a, b) => a.localeCompare(b));
    results.forEach((val) => console.log(val));
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

// Get the Dallas csv file to parse

let url= "http://www.dallasopendata.com/resource/ts5d-gdq6.csv";

if (process.argv.length == 4) {
    url = process.argv[3];
}

// Request csv

printItemData(agenda_item_number, url);
