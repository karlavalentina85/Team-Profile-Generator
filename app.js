const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");

const teamMembers = [];

function startApp() {
    console.log("Hi there,  Let's build your Team!");
    createTeamMember();
}

async function createTeamMember() {
    response = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "What is your team member's name?"
        },

        {
          type: "input",
          name: "id",
          message: "What is your team member's id number?"
        },

        {
          type: "input",
          name: "email",
          message: "Team member's email?:"
        },

        {
          type: "list",
          name: "role",
          message: "Please add the Team member's role",
          choices: [
            "Manager",
            "Engineer",
            "Intern"
          ]

        }
        

    ]);

    let roleQuestion = "";

    if (response.role === "Manager") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "officeNumber",
                message: "What is the Manager's office number?"
            }

        ]);

        const manager = new Manager(response.name, response.id, response.email, roleQuestion.officeNumber);
        teamMembers.push(manager);
    }

    if (response.role === "Engineer") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "github",
                message: "What is the engineer's Github username?",
            }


        ]);

        const engineer = new Engineer(response.name, response.id, response.email, roleQuestion.github);
        teamMembers.push(engineer);
    }

    if (response.role === "Intern") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "school",
                message: "What School does the intern attend?",
            }


        ]);

        const intern = new Intern(response.name, response.id, response.email, roleQuestion.school);
        teamMembers.push(intern);
    }

    console.log(teamMembers);

    askToContinue = await inquirer.prompt([
        {   
            type: "list",
            name: "continue",
            message: "Would you like to add another team member?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]);

    if (askToContinue.continue === "Yes") {

        createTeamMember();

    } else {
        console.log("Success!")
        console.log(teamMembers);

        const html = render(teamMembers);

        if (fs.existsSync(OUTPUT_DIR) === false) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        await writeFileAsync(outputPath, html);

        


    }




}


startApp();
