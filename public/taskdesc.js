//THINGS TO DO
//connect the edits to the db
//title should change based on the assignment name




// JavaScript source code
//function edittext() {
//    var desc = prompt("Enter description");
//    document.getElementById('description').innerHTML = desc;
//};
const main = document.querySelector(".title")



//THIS GETS ALL THE DATA, IT JUST NEEDS TO BE FORMATTED
const loadTask = () => {
    console.log("loading task")
    let assignment = sessionStorage.getItem("assignment")
    let classname = sessionStorage.getItem("classes")
    console.log("assignment:",assignment,"Class:",classname)
    fetch("/assignment?assignment="+assignment+"&classes="+classname)
        .then(data => data.json())
        .then(data => {
            console.log("loading assignment...")
            console.log("data:", data)
            assignment = data[0].assignment;
            desc = data[0].description;
            date = data[0].due_date
            document.getElementById('duedate').value = date;
            main1.appendChild(taskdesc(assignment, desc,classname));
        })
        .catch("error. Retry")
}


const main1 = document.getElementById("class-list");
const taskdesc = (assignment, description,classname) => {
    console.log(duedate);
    const template = document.querySelector("template");
    const c = template.content.cloneNode(true);
    c.querySelector("u").textContent = assignment;
    c.querySelector("p").textContent = description;
    c.getElementById("classname").textContent = classname
    c.getElementById("description").textContent = description;
    return c;
}

//DELETE AN ASSIGNMENT
document.getElementById('delete_icon').onclick = function(){
    const assignment = sessionStorage.getItem("assignment")
    const classname = sessionStorage.getItem("classes")
    fetch("/delete",{
        method: 'DELETE',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            classes: classname,
            assignment: assignment
        })
    })
    .then(() =>{
        window.location = ("/public/index.html")
    })

}
//CHANGE THE DUE DATE
document.getElementById("submit_dates").onclick = function () {
    console.log("here1")
    const assignment = sessionStorage.getItem("assignment")
    const classname = sessionStorage.getItem("classes")
    console.log("here")
    console.log(document.getElementById("duedate").value);
    let date = document.getElementById("duedate").value;
    fetch("/updateDueDate", {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            due_date: date,
            classes: classname,
            assignment: assignment
        })
    })
    .then(function (data) {
        console.log("sent fetch")
        //reload the page to show the updated schedule
        location.reload();
    })
}



loadTask()