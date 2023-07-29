const ical = require('node-ical');
const notionMod = require('./notion.js');


parseAssignments = async(url) => {
    try{
        const databaseID = await notionMod.createNewDatabase()
        const data = await ical.async.fromURL(url);
        for (const event of Object.values(data)){ // for each assignment or event in the calendar,
            if(event.summary){
                // (the event summary is a string of the assignment name and course name where the course name is in between brackets)
                // separate the assignment and course name
                summary = event.summary.split("[", 2);
                assignmentName = summary[0];
                courseName = summary[1].slice(0, -1);
                
                // format the date string to YYYY-MM-DD
                year = event.start.toLocaleString("default", {year: "numeric"});
                month = event.start.toLocaleString("default", {month: "2-digit"});
                day = event.start.toLocaleString("default", {day: "2-digit"});
                dueDate = year + "-" + month + "-" + day;

                // create the page in the database
                notionMod.createAssignment({name: assignmentName, course: courseName, date: dueDate, databaseID: databaseID})
            }
        };
    } catch(error){
        console.error(error);
    }
    finally{
        console.log("done");
    }
}

module.exports = {
    parseAssignments
  };