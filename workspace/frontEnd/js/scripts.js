const myURL = "https://personalfinancesapp-production.up.railway.app";
// let userLogged;
// let accessToken = window.localStorage.getItem("accessToken");
let userID;
let accessToken;

// Date
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

// Delay function
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Elements for showing/hiding passwords
const eye = document.getElementById("eye");
const loginEye = document.getElementById("loginEye");

// Forms
const signUpForm = document.getElementById("signUpForm");
const loginForm = document.getElementById("loginForm");
const operationForm = document.getElementById("operationForm");
const logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  authElementsToggle();
  location.reload()
});

// Toggle logged in Elements
function authElementsToggle() {
  notLoggedElements = document.querySelectorAll(".notLogged");
  notLoggedElements.forEach((element) => {
    element.classList.toggle("d-none");
  });
  loggedElements = document.querySelectorAll(".logged");
  loggedElements.forEach((element) => {
    element.classList.toggle("d-none");
  });
}

// Toggle pass visibility functions
function show() {
  var p = signUpForm["password"];
  var p2 = signUpForm["passwordx2"];
  var loginP = loginForm["loginPassword"];
  p.setAttribute("type", "text");
  p2.setAttribute("type", "text");
  p.setAttribute("placeholder", "Password");
  p2.setAttribute("placeholder", "Password again :)");
  loginP.setAttribute("type", "text");
  loginP.setAttribute("placeholder", "Your password");
}

function hide() {
  var p = signUpForm["password"];
  var p2 = signUpForm["passwordx2"];
  var loginP = loginForm["loginPassword"];

  p.setAttribute("type", "password");
  p2.setAttribute("type", "password");
  p.setAttribute("placeholder", "●●●●●●●●");
  p2.setAttribute("placeholder", "●●●●●●●●");
  loginP.setAttribute("type", "password");
  loginP.setAttribute("placeholder", "●●●●●●●●");
}

var pwShown = 0;

const switchToggle = function () {
  if (pwShown == 0) {
    pwShown = 1;
    show();
  } else {
    pwShown = 0;
    hide();
  }
};

const togglePass = document.querySelectorAll(".togglePass");
togglePass.forEach((element) => {
  element.addEventListener("click", switchToggle, false);
});

// Earnings/Expenses category switcher

const earningsLabel = document.getElementById("earningsLabel");
const earningsSelect = document.getElementById("earningsSelect");
const earningsCategory = document.getElementById("earningsCategory");
const expensesLabel = document.getElementById("expensesLabel");
const expensesSelect = document.getElementById("expensesSelect");
const expensesCategory = document.getElementById("expensesCategory");

const classToggle = (element) => {
  element.classList.toggle("d-none");
};

earningsLabel.addEventListener("click", () => {
  classToggle(earningsSelect);
  earningsSelect.setAttribute("required", "");

  earningsCategory.setAttribute("required", "");
  if (!expensesSelect.classList.contains("d-none")) {
    expensesSelect.classList.add("d-none");
    expensesCategory.removeAttribute("required", "");
  }
});

expensesLabel.addEventListener("click", () => {
  classToggle(expensesSelect);
  expensesCategory.setAttribute("required", "");
  if (!earningsSelect.classList.contains("d-none")) {
    earningsSelect.classList.add("d-none");
    earningsCategory.removeAttribute("required", "");
  }
});

// Form data management
let operationID;
async function sendHTTPRequest(method, endpoint, data, token) {
  let options;
  if (data == undefined) {
    options = {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        token: token,
      }, 
    };
  } else { 
    options = {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        token: token,
      },
      body: JSON.stringify({ data })
    };
  }

  async function API_Fetch() {
    const promise = await fetch(myURL + endpoint, options);
    const json = await promise.json();
    const response = await json;
    return await response;
  }
  return await API_Fetch();
}

async function handleAuthResponse(response) {
  const res = await response;
  userID = res.userID;
  accessToken = res.accessToken;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("userID" , userID);
  if (res.message=="User logged in") {
    authElementsToggle()
    getOperations()
  }
  if (res.message=="User succesfully created") {
    authElementsToggle()
    console.log("Welcome ;)");
  }
}

async function handleOperationsResponse(response , data){
  const res = await response;
  if (data) {
  const dbID = res.createdOperation.ID
  addOperationRow(data , dbID , true, false)
  data.id = dbID
  dbRows.push(data)
  }
  return await res
}

function modalReset(modal, form) {
  modal.hide();
  if (form) {
    form.reset();
  }
}

// Login Form
const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    email: loginForm["loginEmail"].value,
    password: loginForm["loginPassword"].value,
  };
  let authResponse = sendHTTPRequest("POST", "/auth/login", data);
  handleAuthResponse(authResponse)
  modalReset(loginModal, loginForm);
});

// Sign up form
const signUpModal = new bootstrap.Modal(
  document.getElementById("registerModal")
);

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (signUpForm["password"].value == signUpForm["passwordx2"].value) {
    let data = {
      email: signUpForm["registerEmail"].value,
      password: signUpForm["password"].value,
    };
      let authResponse = sendHTTPRequest("POST", "/auth/signup", data);
      handleAuthResponse(authResponse)
    // Reset Form & hide modal
    modalReset(signUpModal, signUpForm);
  } else {
    signUpForm["passwordx2"].setCustomValidity("Passwords don't match");
  }
});

// Operation Form
let dbRows = []
let rowsArr = [];
function storeRows(array) {
  // Stringify Array
  let jsonArray = JSON.stringify(array);
  // Save in localStorage
  localStorage.setItem("rows", jsonArray);
}

const operationModal = new bootstrap.Modal(
  document.getElementById("operationModal")
);

operationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let category;
  if (operationForm["expensesCategory"].value == "") {
    category = operationForm["earningsCategory"].value;
  } else {
    category = operationForm["expensesCategory"].value;
  }
  let operationData = {
    userID: userID,
    type: operationForm["type"].value,
    amount: operationForm["amount"].value,
    concept: operationForm["conceptInput"].value,
    category: category,
  };
  if (userID == undefined) {
    // parsedArray.lenght? eso cada cuanto se actualiza??
    addOperationRow(operationData, parsedArray.length , true);
    rowsArr.push(operationData);
    storeRows(rowsArr);
    updateTable()
  
  } else {
      let response =  sendHTTPRequest("POST", "/operations/create", operationData, accessToken);
      handleOperationsResponse(response , operationData)
      updateTable()
  }

  modalReset(operationModal, operationForm);
  // Reset Select Input
  if (!earningsSelect.classList.contains("d-none")) {
    earningsSelect.classList.add("d-none");
  }
  if (!expensesSelect.classList.contains("d-none")) {
    expensesSelect.classList.add("d-none");
  }
  earningsCategory.removeAttribute("required", "");
  expensesCategory.removeAttribute("required", "");

});

let tableBody;
const balanceSpan = document.getElementById("balance")

const minusIcon = "<i class='fas fa-minus'></i>";
const plusIcon = "<i class='fas fa-plus'></i>";
const editBtn =
  "<button id='editButton' data-bs-target='#editModal' data-bs-toggle='modal' class='btn btn-outline-secondary'><i class='fas fa-pen'></i></button>";

const deleteBtn =
  "<button id='deleteButton' type='button' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Double click to delete ;)' class='btn btn-outline-secondary'><i class='fas fa-trash'></i></button>";

const editOperationForm = document.getElementById("editOperationForm");
const editOperationModal = new bootstrap.Modal(
  document.getElementById("editModal")
);
let editID;

const editEarningsCategory = document.getElementById("editEarningsSelect");
const editExpensesCategory = document.getElementById("editExpensesSelect");
function resetEditForm() {
  editOperationForm.reset();
  // Reset Select Input
  if (!editEarningsCategory.classList.contains("d-none")) {
    editEarningsCategory.classList.add("d-none");
    editOperationForm["editEarnings"].removeAttribute("checked", "checked");
  }
  if (!editExpensesCategory.classList.contains("d-none")) {
    editExpensesCategory.classList.add("d-none");
    editOperationForm["editExpenses"].removeAttribute("checked", "checked");
  }
}

// Edit form submit-----------------------------------
editOperationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let editedRow = document.getElementById(editID);
  let objectInArray = parsedArray[editID];
  let category;
  if (editOperationForm["editExpensesCategory"].value == "") {
    category = editOperationForm["editEarningsCategory"].value;
  } else {
    category = editOperationForm["editExpensesCategory"].value;
  }
  editedRow.classList.add("animate__backOutLeft");

  let amount = editOperationForm["editAmount"].value;
  let concept = editOperationForm["editConcept"].value;
  const data = {
    amount: amount,
    concept: concept,
    category: category,
    ID: editID
  };

  if (accessToken && userID) {
    let editRequest =  sendHTTPRequest("PUT" , "/operations/edit" , data , accessToken);
    let response =  handleOperationsResponse(editRequest);
  }

  delay(600).then(() => {
    editedRow.classList.remove("animate__backOutLeft");
    editedRow.children[1].innerHTML = "$" + amount;
    editedRow.children[2].innerHTML = concept;
    editedRow.children[4].innerHTML = category;
    editedRow.classList.add("animate__backInLeft");
    updateTable()
  });
  // Save in localStorage-------
  if (userID == undefined) {
    objectInArray.amount = amount;
    objectInArray.concept = concept;
    objectInArray.category = category;
    storeRows(parsedArray);
  }



  // Reset Inputs & close modal
  resetEditForm();
  modalReset(editOperationModal);
});


function formatNumbers(int) {
  let newValue = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "usd",
  }).format(int);
  let newNumber = newValue.slice(1, newValue.length - 3);
  return newNumber;
}

function addOperationRow(data, dbID , visibility , isGet) {
  tableBody = document.getElementById("tableBody");
  let newRow = tableBody.insertRow(0);
  newRow.classList.add("animate__animated");
  if (dbID) {
    newRow.setAttribute("id", dbID);
  }
  if (dbID == 0) {
    newRow.setAttribute("id", 0);
  }
  let trArray = [];
  // Create cells
  for (let i = 0; i < 7; i++) {
    let cell = newRow.insertCell(i);
    trArray.push(cell);
  }

  if (visibility == false) {
    newRow.classList.add("d-none")
  }

  // Type of Operation
  trArray[0].setAttribute("scope", "row");
  if (data.type == "earnings") {
    trArray[0].innerHTML = plusIcon;
  } else {
    trArray[0].innerHTML = minusIcon;
  }

  // Amount
  trArray[1].innerHTML = "$" + formatNumbers(data.amount);

  // Concept
  trArray[2].innerHTML = data.concept;

  // Date
  trArray[3].innerHTML = today;

  // Category
  trArray[4].innerHTML = data.category;

  // EditBtn
  trArray[5].innerHTML = editBtn;

  // DeleteBtn
  trArray[6].innerHTML = deleteBtn;

  if (isGet != true) {
    updateTable()
  }
}

// Load past operations saved in localStorage

let editButtons;
let deleteButtons;
let parsedArray = [];


function getOfflineOperations() {
    const str = localStorage.getItem("rows");
    if (str != undefined) {
      parsedArray = JSON.parse(str);
      let maxIterations = parsedArray.length;
      if (parsedArray.length > 10) {
        maxIterations = 10;
      }
      for (let index = 0; index < maxIterations; index++) {
        addOperationRow(parsedArray[index], index);
        rowsArr.push(parsedArray[index]);
      }
      initializeButtons();
    }
}



// Edit & remove operations
function initializeButtons() {
  editButtons = document.querySelectorAll("#editButton");
  deleteButtons = document.querySelectorAll("#deleteButton");

  deleteButtons.forEach((element) => {
    element.addEventListener("dblclick", (e) => {
 
      e.preventDefault();
      let rowToDelete = getRow(e);
      let rowID = rowToDelete.id
      rowToDelete.classList.add("animate__backOutLeft");

      if (localStorage.rows && parsedArray[rowToDelete.ID] != undefined) {
        parsedArray.splice(rowID, 1);
        storeRows(parsedArray);
      }

      if (userID != undefined) {
      let deleteRequest = sendHTTPRequest("DELETE" , "/operations/delete", rowID , accessToken )
      let response = handleOperationsResponse(deleteRequest)
      }    
      function removeAndUpdate(row) {
        row.remove();
        updateTable()
      }
      delay(600).then(() => removeAndUpdate(rowToDelete) );
    });
  });

  editButtons.forEach((element) => {
    element.addEventListener("click", (e) => {
      resetEditForm();
      e.preventDefault();
      editID = getRow(e).id;
      let data
      if (dbRows.length > 2 ) {
        data = dbRows.find((e) => e.ID == editID)
      }


      if(parsedArray[editID]){
        data = parsedArray[editID];
      }


      // Toggle type & category
      if (data.type == "earnings") {
        editOperationForm["editEarnings"].setAttribute("checked", "checked");
        editEarningsCategory.classList.remove("d-none");
        selectOptions = editOperationForm["editEarningsCategory"].children;
        // Find the selected option Index
        for (let i = 0; i < selectOptions.length; i++) {
          if (selectOptions[i].value == data.category) {
            selectOptions[i].setAttribute("selected", "");
          }
        }
      } else {
        editOperationForm["editExpenses"].setAttribute("checked", "checked");
        editExpensesCategory.classList.remove("d-none");
        selectOptions = editOperationForm["editExpensesCategory"].children;
        // Find the selected option Index
        for (let i = 0; i < selectOptions.length; i++) {
          if (selectOptions[i].value == data.category) {
            selectOptions[i].setAttribute("selected", "");
          }
        }

      }
      // Set amount
      editOperationForm["editAmount"].setAttribute("value", data.amount);

      // Set concept
      editOperationForm["editConcept"].setAttribute(
        "value",
        data.concept
      );
    });
  });
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll("[data-bs-toggle='tooltip']")
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Check Auth State
if (localStorage.userID && localStorage.accessToken) {
  userID = window.localStorage.getItem("userID");
  accessToken = window.localStorage.getItem("accessToken")
  console.log("User logged");
  authElementsToggle()
  getOperations()
} else {
  getOfflineOperations()
}


async function getOperations() {
  let operations = sendHTTPRequest("GET" , "/operations/" ,  undefined , accessToken)
  let sequelizeOperations = await handleOperationsResponse(operations)
  let sequelizeOperationsArray = sequelizeOperations.userOperations
  let maxIterations = 9
  function reverseArray(array) {
    return array.reverse()
  }
  let reverseSequelizeOperationsArray = reverseArray(sequelizeOperationsArray)
  if (reverseSequelizeOperationsArray.length > 10) {
    for (let index = reverseSequelizeOperationsArray.length-1 ; index >= 0 && index >11 ; index--) {
      const data = reverseSequelizeOperationsArray[index];
      addOperationRow(data, data.ID , false , true)
      dbRows.push(data)
    }
  }
  if (reverseSequelizeOperationsArray.length <= maxIterations) {
    for (let index = reverseSequelizeOperationsArray.length-1 ; index >= 0; index--) {
      const data = reverseSequelizeOperationsArray[index];
      addOperationRow(data, data.ID , true , true)
      dbRows.push(data)
    }
  }

  initializeButtons();
  updateTable()
}

function updateTable() {
  let balance = 0
  tableBody = document.getElementById("tableBody")
    for (let index = 0; index < tableBody.children.length; index++) {
      const element = tableBody.children[index].children[1];
      let noCommas = element.innerHTML.replaceAll("," , "")
      console.log(noCommas , "nocommas");
      const number = parseInt(noCommas.slice(1))
      console.log(number);
      let typeCell = tableBody.children[index].children[0].firstChild
      if (typeCell.classList.contains("fa-plus")) {
        balance += number
      } 
      if (typeCell.classList.contains("fa-minus")) {
        balance -= number
      }
    }
  if (balance < 0) {
    if (balanceSpan.classList.contains("bg-success")) {
      balanceSpan.classList.remove("bg-success")
    }
    balanceSpan.classList.add("bg-danger");
    balanceSpan.innerHTML =  "-" + formatNumbers(balance);
  } else {
    if (balanceSpan.classList.contains("bg-danger")) {
      balanceSpan.classList.remove("bg-danger")
    }
    balanceSpan.classList.add("bg-success");
    
    balanceSpan.innerHTML =  formatNumbers(balance);
  }  
}






// Sync localStorage with Database
// Activate once hosted in remote DB to avoid preflight OPTIONS request
// Should work

function syncWithDB() {
  if (accessToken.length > 10 && localStorage.rows) {
    let userPermission = confirm("We found some operations you saved before creating your account, would you like to sync them in the cloud?");
    if (userPermission == true) {
      for (let index = parsedArray.length-1 ; 0 <= index; index--) {
        let sendOperation =  sendHTTPRequest("POST", "/operations/create", parsedArray[index], accessToken)
        let response = handleOperationsResponse(sendOperation)
        delay(5000).then(()=>{ index })
      }
      // If this works properly, whe should delete localStorage.rows to keep from prompting the confirm()
      // localStorage.removeItem("rows")
    }
  }
}

// delay(3500).then(syncWithDB)



// Returns Row id for Edit & delete functions
function getRow(e) {
  let tableRow = e.target.closest("tr");
  return tableRow;
}
