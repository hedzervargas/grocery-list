// ******* VARIABLES *******
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const groceryList = document.querySelector(".grocery-list");
const container = document.querySelector(".grocery-container");
const clearBtn = document.querySelector(".clear-btn");
const submitBtn = document.querySelector(".submit-btn");
const alert = document.querySelector(".alert");

// ******* LIST *******
let list = [];

// ******* EDIT OPTIONS *******
let editFlag = false;
let editElement;
let editID = "";

// ******* EVENT LISTENERS *******
form.addEventListener("submit", submitForm);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", loadItems);

// ******* FUNCTIONS *******
// submit form
function submitForm(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    list.push({ value: value, id: id });
    updateUI();
    toDefault();
    showAlert("grocery added to the list", "success");
    addToLocalStorage();
  } else if (value && editFlag) {
    list.forEach(function (item) {
      if (item.id == editID) {
        item.value = value;
      }
    });
    updateUI();
    toDefault();
    showAlert("grocery changed", "success");
    addToLocalStorage();
  } else {
    showAlert("enter grocery", "danger");
  }
}
// update UI
function updateUI() {
  const mappedList = list
    .map(function (item) {
      return `<article data-id="${item.id}" class="grocery-item">
            <p class="title">${item.value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </article>`;
    })
    .join("");
  groceryList.innerHTML = mappedList;
  // button event listeners
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const editBtns = document.querySelectorAll(".edit-btn");
  deleteBtns.forEach(function (btn) {
    btn.addEventListener("click", deleteItem);
  });
  editBtns.forEach(function (btn) {
    btn.addEventListener("click", editItem);
  });
  // container visability
  if (groceryList.children.length > 0) {
    container.classList.add("show-container");
  } else {
    container.classList.remove("show-container");
  }
}
// show alert
function showAlert(text, status) {
  alert.textContent = text;
  alert.classList.add(`alert-${status}`);
  // stop alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${status}`);
  }, 2000);
}
// back to default
function toDefault() {
  grocery.value = "";
  submitBtn.textContent = "add";
  editFlag = false;
}
// clear items
function clearItems() {
  list = [];
  updateUI();
  toDefault();
  showAlert("all groceries removed", "success");
  addToLocalStorage();
}
// delete item
function deleteItem(e) {
  const currentID =
    e.currentTarget.parentElement.parentElement.getAttribute("data-id");
  list = list.filter(function (item) {
    if (item.id !== currentID) {
      return item;
    }
  });
  updateUI();
  showAlert("grocery removed", "success");
  addToLocalStorage();
}
// edit item
function editItem(e) {
  editFlag = true;
  editElement = e.currentTarget.parentElement.parentElement;
  editID = editElement.getAttribute("data-id");
  const currentValue = list.find(function (item) {
    return item.id == editID;
  }).value;
  grocery.value = currentValue;
  submitBtn.textContent = "change";
  grocery.focus();
}
// load items
function loadItems() {
  list = JSON.parse(localStorage.getItem("list"));
  if (list.length < 1) {
    list = [];
  }
  updateUI();
  grocery.focus();
}

// ******* LOCAL STORAGE *******
function addToLocalStorage() {
  localStorage.setItem("list", JSON.stringify(list));
}
