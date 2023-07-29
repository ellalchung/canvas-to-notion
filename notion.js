require('dotenv').config()
const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_API_KEY})


/* Creates Assignment in Notion database given the name, course, and date. Defaults Status value to "Not started"
Parameters: name of assignment, course name, date, and database ID
*/
function createAssignment({name, course, date, databaseID}) 
{
    notion.pages.create
    ({
        parent: 
        {
            database_id: databaseID
        },
        properties: 
        {
            "Assignment Name": 
            {
                "title": 
                [{
                    "type": "text",
                    "text": {"content": name}
                }]
            },
            "Course": 
            {
                "select": 
                {
                    "name": course
                }
            },
            "Due Date": 
            {
                "date": 
                {
                    "start": date
                }
            },
            "Status": 
            {
                "select": 
                {
                    "name": "Not Started"
                }
            }
        }
    })
}

/* Creates new inline database with the default name "Assignment Master List" in a given page
Creates properties of assignment name, due date, course, and status in the database
returns the databaseID */
async function createNewDatabase() {
    try 
    {
        const response = await notion.databases.create(
            {
                parent: 
                    {page_id: process.env.NOTION_PAGE_ID},
                is_inline: true, 
                title: 
                [{
                    type: "text",
                    text: {
                        content: "Assignment Master List",
                        }
                }],
                properties:
                {
                    "Assignment Name": 
                        {"title": {}},
                    "Course":
                        {"select": {}},
                    "Due Date":
                        {"date": {}},
                    "Status":
                    {
                        select: 
                        {
                            options: [
                                {
                                    name: "Not Started",
                                    color: "red"
                                },
                                {
                                    name: "In Progress",
                                    color: "yellow"
                                },
                                {
                                    name: "Complete",
                                    color: "green"
                                }]
                        }

                    }
                }
            })
        return response.id
    }
    catch(error)
    {
        console.error("Error creating database: ", error)
        throw error
    }
}


module.exports = {
    notion,
    createNewDatabase,
    createAssignment
  };
