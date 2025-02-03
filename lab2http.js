// List voters for agenda item '1' for the given csv file

let fs = require("fs");
let csv = require("csv-string");

if (process.argv.length != 3) {
    console.log("Usage: node lab1.js <filename>");
    process.exit(1);
}

let filename = process.argv[2];

let data = fs.readFileSync(filename, "utf8");
let parsed_data = csv.parse(data, { output: "objects" });

for (let i = 0; i < parsed_data.length; i++) {
    let record = parsed_data[i];
    if (record.agenda_item_number !== "1") continue;

    let date = new Date(record.date);
    let name = record.voter_name;
    let vote = record.vote;

    console.log(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} - ${name} - ${vote}`);
}
