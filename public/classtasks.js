//THINGS TO DO
//each assignment should link to it's own page



// JavaScript source code
//open form for new task when clicked
document.getElementById("newtask").onclick = function () {
    document.getElementById("myForm").style.display = "block";
};
//close form
document.getElementById("closeform").onclick = function () {
    document.getElementById("myForm").style.display = "none";
};

const classname = sessionStorage.getItem("searched_class")
console.log("first:",classname)
let class_title = document.createTextNode(classname)
document.getElementById("classname_title").appendChild(class_title)
console.log("class:",classname)
//template for tasks to be added onto html
const main = document.querySelector("main");
const taskrow = (assignment, duedate, classname) => {
    // console.log(duedate);
    const template = document.getElementById("task-row-temp");
    const c = template.content.cloneNode(true);
    c.querySelector("button").textContent = assignment;
    c.querySelector("p").textContent = "Due: " + duedate;
    c.id = "newAssignment"
    c.querySelector("button").onclick = function() {
        console.log("setting session variables...")
        sessionStorage.setItem("assignment",assignment)
        sessionStorage.setItem("classes",classname)
        console.log(assignment,classname)
        console.log("data stored...")
       window.location = ("./tasksdesc.html")
    }
    return c;
}


//GET all the assignments for the specific class
const refresh = () => {
    console.log("refreshing...")
    //get the name of the searched class
    let classname = sessionStorage.getItem("searched_class")
    //CGI URL format since you cant have a body with a GET 
    fetch("/class?classes="+classname)
        .then(data => data.json())
        .then(data => {
            //console.log("here")
            console.log("data:", data)
            console.log(data.length)
            if(data.length === 0){
                console.log('no classes')
                main.appendChild(document.createTextNode("No Assignments for " + classname))
            }
            for (let i = 0; i < data.length; i++) {
                main.appendChild(taskrow(data[i].assignment, data[i].due_date,data[i].classes))
            }
            console.log(data[0].assignment)
        })
        //HERE IS THE DATA FOR ALL THE ASSIGNMENTS FROM THAT CLASS
        //data just needs to be displayed pretty
 
}
refresh()


//************404 check if possible*************
document.getElementById("submit_button").onclick = function (event) {
    event.preventDefault();
    const classname = document.getElementById('classname')
    const assignment_name = document.getElementById('assignment_name')
    const description = document.getElementById('desc')
    const due_date = document.getElementById('duedate')
    console.log("\n\n\nBefore fetch...")
    fetch("/assignment", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            assignment: assignment_name.value,
            classes: classname.value,
            description: description.value,
            due_date: due_date.value
        })
    })
        .then(function () {
            console.log("sent fetch")
            //reload the page to show the updated schedule
            location.reload();
        })
    //just testing for now but should be pulled from db
    main.appendChild(taskrow("Lecture 18 Checkin", "11/25/21"));
    main.appendChild(taskrow("Lecture 16 Checkin", "11/29/21"));
    main.appendChild(taskrow("Sidd isn't gay", "04/20/69"));
}