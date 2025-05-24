
// .then(res => res.json())
// .then(data => console.log(data))
// .catch(err => console.error(err));

const baseURL = 'http://192.168.1.2:3000'; // Use your actual PC LAN IP

fetch(`${baseURL}/tasks`, {
  method: 'Get',
  headers: {'Content-Type': 'application/json'},
  
})



// ==============================
// Task List Array to store tasks
// ==============================
const taskList = [];

// ==============================
// DOM Elements
// ==============================
const txtTtask = document.getElementById("txt-Ttask");
const txtDtask = document.getElementById("txt-Dtask");
const btnCancel = document.getElementById("btn-cancel");

var x;               // Index of selected task for editing/deletion
var btnOpt = true;   // Flag to indicate Add (true) or Edit (false) mode

// ==============================
// Event Listeners
// ==============================

// Cancel button resets form and returns to Add mode
btnCancel.addEventListener("click", function () {
  clearData();
  showListTask();
  hideBtnCancel();
  btnOpt = true;
});

// Add/Edit button click event
document.getElementById("btn-add").addEventListener("click", function () {
  if (btnOpt == true) {
    AddData();           // Add new task
    hideBtnCancel();     // Hide cancel button after adding
    txtTtask.focus();
  } else {
    editData();          // Save edited task
  }
  showListTask();        // Refresh task list display
});

// ==============================
// Show Task List
// ==============================
function showListTask() {
  let txt = "";

  // Loop through task list and generate HTML
  for (let i = 0; i < taskList.length; i++) {
    txt += `
      <div id="data">
        <div class="box-task">
          <h6 class="t-task">${taskList[i]["title"]} :&nbsp;&nbsp;&nbsp;</h6>
          <p class="d-task">${taskList[i]["description"]}</p>
        </div>
        <div class="box-btn">
          <button class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `;
  }

  // Update the DOM
  document.querySelector(".data-box").innerHTML = txt;
  clearData(); // Clear input fields after update

  // ========== Edit Button ========== //
  const btnEditList = document.querySelectorAll(".btn-edit");
  btnEditList.forEach((element, i) => {
    element.addEventListener("click", function () {
      // Populate form fields with selected task
      txtTtask.value = taskList[i].title;
      txtDtask.value = taskList[i].description;
      x = i;
      btnOpt = false; // Switch to Edit mode

      // Update Add button UI for editing
      document.getElementById("btn-add").innerHTML = "Save";
      document.getElementById("btn-add").style.backgroundColor = "seagreen";

      // Show cancel button
      btnCancel.style.display = "block";
    });
  });

  // ========== Delete Button ========== //
  const btnDel = document.querySelectorAll(".btn-delete");
  btnDel.forEach((element, i) => {
    element.addEventListener("click", function () {
      x = i;
      document.querySelector(".frm-popup").style.display = "flex"; // Show confirm delete popup
    });
  });
}

// ==============================
// Popup Confirm Buttons
// ==============================

// Confirm deletion
document.getElementById("btn-yes-del").addEventListener("click", async function () {
  await deleteTask(x); // Perform delete
  document.querySelector(".frm-popup").style.display = "none"; // Hide popup
});

// Cancel deletion
document.getElementById("btn-no-del").addEventListener("click", function () {
  showListTask(); // Simply refresh the list
  document.querySelector(".frm-popup").style.display = "none"; // Hide popup
});

// ==============================
// UI Helpers
// ==============================

// Reset Add button to default style
function hideBtnCancel() {
  document.getElementById("btn-add").innerHTML = `<i class="fa-solid fa-plus"></i> <span>Add Task</span>`;
  document.getElementById("btn-add").style.backgroundColor = "#4f4ffc";
  btnCancel.style.display = "none";
}

// Clear input fields
function clearData() {
  txtTtask.value = "";
  txtDtask.value = "";
}

// Validate input fields before submitting
function validator() {
  if (txtTtask.value == "") {
    alert("Please Enter Title Task");
    txtTtask.focus();
    return false;
  } else if (txtDtask.value == "") {
    alert("Please Enter Description Task");
    txtDtask.focus();
    return false;
  }
  return true;
}

// ==============================
// API Interaction
// ==============================

// Load all tasks from server on page load
// async function loadTasks() {
//   const res = await fetch('http://localhost:3000/tasks');
//   const tasks = await res.json();
//   taskList.length = 0;
//   taskList.push(...tasks);
//   showListTask(); // Display tasks
// }


async function loadTasks() {
  try {
    const res = await fetch('http://192.168.1.2:3000/tasks');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const tasks = await res.json();
    taskList.length = 0;
    taskList.push(...tasks);
    showListTask();
  } catch (error) {
    console.error('Failed to load tasks:', error);
    alert('Error loading tasks from server. See console for details.');
  }
}

window.onload = loadTasks;

// Add new task to server
async function AddData() {
  if (!validator()) return;

  const newTask = {
    title: txtTtask.value,
    description: txtDtask.value
  };

  const res = await fetch('http://192.168.1.2:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });

  const data = await res.json();
  taskList.unshift(data); // Add to front of array
  showListTask();
  clearData();
}

// Edit existing task
async function editData() {
  if (!validator()) return;

  const updatedTask = {
    title: txtTtask.value,
    description: txtDtask.value
  };

  const taskId = taskList[x].id;

  await fetch(`http://192.168.1.2:3000/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  });

  taskList[x] = { ...taskList[x], ...updatedTask }; // Update local task
  btnOpt = true; // Switch back to Add mode
  hideBtnCancel();
  showListTask();
}

// Delete task from server and local array
async function deleteTask(index) {
  const taskId = taskList[index].id;

  await fetch(`http://192.168.1.2:3000/tasks/${taskId}`, {
    method: 'DELETE'
  });

  taskList.splice(index, 1); // Remove from local array
  showListTask();
}
