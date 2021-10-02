const taskContainer = document.querySelector(".task_container");

let globalStore = [];

const generateNewCard = (taskData) =>
`  <div class="col-md-6 col-lg-4" >
<div class="card text-center">
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-success" id=${taskData.id} onclick="editCard.apply(this,arguments)">
        <i class="fas fa-pen" id=${taskData.id} onclick="editCard.apply(this,arguments)"> </i>
        </button>
        <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this,arguments)" >
        <i class="fas fa-trash" id=${taskData.id} onclick="deleteCard.apply(this,arguments)"></i>
        </button>
    </div>
    <img src=${taskData.imageUrl}
     class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${taskData.taskTitle}</h5>
      <p class="card-text">${taskData.taskDescription}</p>
      <a href="#" class="btn btn-primary">${taskData.taskType}</a>
    </div>
    <div class="card-footer">
        <button type="button" id=${taskData.id} class="btn btn-outline-primary float-end">Open Task</button>
    </div>
  </div>
</div>
`;


const loadInitialCardData = () => {
    //access local storage to get tasky card data
const getCardData = localStorage.getItem("tasky");

    //convert string to normal object (destructuring method)
const {cards} = JSON.parse(getCardData);

    //loop over those array of task object to create html card(before end) and inject it to DOM (foreach or map)
cards.map((cardObject)=> {
    taskContainer.insertAdjacentHTML("beforeend",generateNewCard(cardObject)); 
 //update our global store 

globalStore.push(cardObject); 
})

   
}

const saveChanges = () =>{
    const taskData = {
        id:`${Date.now()}`, //unique number for id
        imageUrl:document.getElementById("imageurl").value,
        taskTitle:document.getElementById("tasktitle").value,
        taskType:document.getElementById("tasktype").value,
        taskDescription:document.getElementById("taskdescription").value,
    };

    
taskContainer.insertAdjacentHTML("beforeend",generateNewCard(taskData)); 
globalStore.push(taskData);
localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));
};


const deleteCard = (event) => {
event  = window.event;
//id
const targetID = event.target.id;
const tagName = event.target.targetName;  //BUTTON
//id should be matching with global store
//if match found remove it
globalStore= globalStore.filter((cardObject)=> cardObject.id !==targetID); 
 localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));

//we have updated array of cards , now contact parent

if(tagName==="BUTTON"){
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
}
else{
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
}



};

const editCard = (event) => {
    event  = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName; 

    let parentElement;
    if (tagname ==="BUTTON"){
        parentElement=event.target.parentNode.parentNode;
    }
    else{
        parentElement=event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    

    //submit button
    let submitButton = parentElement.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick","saveEditchanges.apply(this,arguments)");
    submitButton.innerHTML="Save Changes";
};

const saveEditChanges=(event) =>{
    event  = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName; 

    let parentElement;
    if (tagname ==="BUTTON"){
        parentElement=event.target.parentNode.parentNode;
    }
    else{
        parentElement=event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];

const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskType:taskType.innerHTML,
    taskDescription:taskDescription.innerHTML,
};
globalStore = globalStore.map((task)=>{
    if (task.id=== targetID){
return{
    id:task.id, //unique number for id
    imageUrl:task.imageUrl,
    taskTitle: updatedData.taskTitle,
    taskType:updatedData.taskType,
    taskDescription:updatedData.taskDescription,
};
    }
    return task;   //important
});
updateLocalStorage();
taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
   submitButton.removeAttribute("onclick");
    submitButton.innerHTML="Open Task";
};


//issues
//closing of modal (using bootsrap)                      --> {solved}
//adding data to local storage                            --> {solved}
//deleting a card (using id)                              --> {solved}
//editing a card                                        --> {solved}
//saving edited card