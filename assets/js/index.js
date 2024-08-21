window.addEventListener("DOMContentLoaded", () => {
  main();
});

var todos
async function main() {
    
    document.getElementById("list").innerHTML = "";
    const token = localStorage.getItem("token");
 
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  var res = await axios.get("http://127.0.0.1:5000/api/todos/", {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  
   todos = res.data.data;
  if (todos.length < 1) {
    document.getElementById("list").innerHTML = "<h2 class='noData'>No todos yet.</h2>";

  } else {
    document.getElementById("list").innerHTML = "";
    todos.forEach((todo) => {
        drawUi(todo);
    });
  }
  const $form = document.getElementById('form')

  $form.addEventListener("submit", handleAddTodo)

  const $logout = document.getElementsByClassName("logout")[0];
  $logout.addEventListener("click", handleLogout);

}

 function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}




async  function handleAddTodo(e){
    e.preventDefault();

    const token = localStorage.getItem("token");
 
    const todo = e.target.todo.value
    const res = await axios.post("http://127.0.0.1:5000/api/todos/", { todo }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(document.getElementsByClassName('noData')[0]){
        document.getElementsByClassName('noData')[0].remove()
    }
    drawUi(res.data.data);
    todos.push(res.data.data);
    e.target.todo.value = "";
  
}

function drawUi(todo) {


  const $div = document.createElement("div");
  $div.className = "list-item";
  const $todoTitle = document.createElement("h3");
  $todoTitle.textContent = todo.todo;
  $div.appendChild($todoTitle);
  const $todoStatus = document.createElement("p");
  $todoStatus.textContent = todo.status;
  if (todo.status == "pending") $todoStatus.className = "pending";
  else {
    $todoStatus.className = "done";
  }
  $div.appendChild($todoStatus);
  const $deleteButton = document.createElement("button");
  $deleteButton.className = "delete";
  $deleteButton.addEventListener("click",()=>handleDeleteTodo(todo._id));
  $deleteButton.textContent = "Delete";
  const $editButton = document.createElement("button");
  $editButton.textContent = "edit";
  $editButton.addEventListener("click",()=>handleEditTodo(todo));
  $div.appendChild($deleteButton);
  $div.appendChild($editButton);
  document.getElementById("list").appendChild($div);
}

function handleEditTodo(todo){  
    const $editPopup=document.createElement('form')
  $editPopup.className='edit-popup'
  const $editInput=document.createElement('input')
  $editInput.type='text'
  $editInput.className='edit-input'
  $editInput.value=todo.todo
  const $submitTodo=document.createElement('input')
  $submitTodo.type='submit'
 const  $editStatus = document.createElement('button')
  $editStatus.textContent=todo.status=="pending"? "switch to done" : "switch to pending"
  const $closePopup = document.createElement('p')
  $closePopup.textContent='close'
  $editPopup.appendChild($editInput)
  $editPopup.appendChild($submitTodo)
  $editPopup.appendChild($editStatus)
  $editPopup.appendChild($closePopup)
  document.body.appendChild($editPopup)

  $closePopup.addEventListener('click',(e)=>{e.preventDefault();$editPopup.remove()})
$editPopup.addEventListener('submit',(e)=>{ e.preventDefault(),handleEditTodoName(todo,document.getElementsByClassName('edit-input')[0].value)})

  $editStatus.addEventListener('click',(e)=>{e.preventDefault();handleEditStatus(todo)})
}


function handleEditTodoName(todo,value){
console.log(value);

    const token = localStorage.getItem("token");
    axios.put(`http://127.0.0.1:5000/api/todos/${todo._id}`, { todo:  value}, {
      headers: { Authorization: `Bearer ${token}` },
    })
   .then((response) => {
    console.log(response)
    if(response.data.status=="success"){

        
        todos.map((ele)=>{
            return ele._id!=todo._id?null:ele.todo=value
        })
   
        
    
        document.getElementById("list").innerHTML = "";
        todos.forEach((ele)=>{
            drawUi(ele)
        })
    }
   })
}
function handleEditStatus(todo){
    const token = localStorage.getItem("token");
    axios.put(`http://127.0.0.1:5000/api/todos/${todo._id}`, { status: todo.status=="pending"? "done" : "pending" }, {
      headers: { Authorization: `Bearer ${token}` },
    })
   .then((response) => {
    if(response.data.status=="success"){
        console.log(todos);
        
        todos.map((ele)=>{
            return ele._id!=todo._id?null:ele.status=="pending"?ele.status="done":ele.status="pending"
        })
        console.log(todos);
        
    
        document.getElementById("list").innerHTML = "";
        todos.forEach((ele)=>{
            drawUi(ele)
        })
    }
   })
}
function handleDeleteTodo(id){
    console.log(todos);    
    const token = localStorage.getItem("token");
    axios.delete(`http://127.0.0.1:5000/api/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
   .then((response) =>{

todos=todos.filter(todo => todo._id!=id)
    console.log(todos);    
    document.getElementById("list").innerHTML = "";
  todos.forEach(todo => {
    drawUi(todo);
    
  });
   })
}