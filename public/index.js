//THINGS TO DO
//SEARCH:
//load assignments for that class
//display them all pretty


//Assignment page:
//when an assignment is clicked on the schedule, it should go to tasksdesc.html and load the data for that assignment
//probably can do by adding event listeners to the buttons and ussing sessionStorage.setItem() and sessionStorage.getItem()




// JavaScript source code
//open form for new task when clicked
console.log("index.js start...")
//const handleRequests = require("/Users/cameronleong/Desktop/frontend_2/backend/handleRequests.js")
document.getElementById("newtask").onclick = function () {
    document.getElementById("myForm").style.display = "block";
};
//close form
document.getElementById("closeform").onclick = function () {
    document.getElementById("myForm").style.display = "none";
};
//SEARCHING FOR A CLASS
document.getElementById("search_button").onclick = function(){
    //when the search is clicked, it just saves the classname so the other page knows it
    const classname = document.getElementById("searched_class").value
    sessionStorage.setItem("searched_class",classname)
    window.location = ("./classtasks.html") 
}

//CREATING A NEW ASSIGNMENT
document.getElementById("submit_button").onclick = function (event) {
    event.preventDefault();
    const classname = document.getElementById('classname')
    const assignment_name = document.getElementById('assignment_name')
    const description = document.getElementById('desc')
    const due_date = document.getElementById('duedate')
    console.log("\n\n\nBefore fetch...")
    fetch("/assignment",{
        method:"POST",
        headers:{
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
             assignment: assignment_name.value,
             classes: classname.value,
             description: description.value,
             due_date: due_date.value 
            })
    })
    .then(function(){
        console.log("sent fetch")
        //reload the page to show the updated schedule
        location.reload();
    })
    .catch((networkError) => {
        console.log('Could not connect to server, please try again later', {networkError})
        document.querySelector('#submit_button').classList.add('error')
    })

};


//template for tasks which must be pulled from db
const main = document.querySelector("main");
const taskrow = (assignment, duedate, classname) => {
    // console.log(duedate);
    const template = document.getElementById("task-row-temp");
    const c = template.content.cloneNode(true);
    c.querySelector("button").textContent = assignment;
    c.querySelector("p").textContent = "Due: " + duedate;
    c.id = "newAssignment"
    c.querySelector("button").onclick = function() {
        sessionStorage.setItem("assignment",assignment)
        sessionStorage.setItem("classes",classname)
        console.log("data stored...")
        window.location = ("./tasksdesc.html")
    }
    return c;
}
//add event listener to each assignment button
//store the class info in sessionStorage and go to the tasksdesc page
const setEvents = function(){
    console.log('searching')
    let assignmentsArray = document.querySelector("button #task_button.button-15")
    console.log(assignmentsArray)
}


//t late for list of classes which must be pulled from db
const main1 = document.getElementById("class-list");
const classrow = (classname) => {
   // console.log(classname);
    const template = document.getElementById("class-row-temp");
    const p = template.content.cloneNode(true);
    p.querySelector("button").textContent = classname;
    return p;
}

const loadSchedule = () => {
    let dt = new Date()
    document.getElementById('duedate').innerHTML=dt;
    fetch("/schedule")
    .then(response => response.json())     // parse the response  
    .then(data => {
        for(let i=0; i<data.schedule.length; i++){
            let assignment = data.schedule[i].assignment;
            let duedate = data.schedule[i].due_date;
            let classname = data.schedule[i].classes;
            main.appendChild(taskrow(assignment,duedate,classname))
        }
    })
}


//testing out templates but values should be pulled from the backend
loadSchedule()
setEvents()


