const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const gender = document.getElementById("gender");
const saveBtn = document.getElementById("saveBtn");
const userTable = document.getElementById("userTable");

let users = JSON.parse(localStorage.getItem("users")) || [];

let isEditing = false;


// Checks if all fields are written
function checkForm() {

  if (
    firstName.value.trim() !== "" &&
    lastName.value.trim() !== "" &&
    gender.value !== "" &&
    isEditing === false
  ) {
    saveBtn.disabled = false;
  }
  else {
    saveBtn.disabled = true;
  }

}


// Check fields while user is typing
firstName.addEventListener("input", checkForm);
lastName.addEventListener("input", checkForm);
gender.addEventListener("change", checkForm);


// Display users
function displayUsers() {

  userTable.innerHTML = "";

  users.forEach(function(user, index) {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.gender}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;


    // Edit button
    const editBtn = row.querySelector(".edit-btn");

    editBtn.addEventListener("click", function() {

      if (editBtn.innerText === "Edit") {

        firstName.value = user.firstName;
        lastName.value = user.lastName;
        gender.value = user.gender;

        editBtn.innerText = "Save";

        isEditing = true;

        saveBtn.disabled = true;
      }

      else {

        users[index].firstName = firstName.value;
        users[index].lastName = lastName.value;
        users[index].gender = gender.value;

        localStorage.setItem("users", JSON.stringify(users));

        isEditing = false;

        firstName.value = "";
        lastName.value = "";
        gender.value = "";

        displayUsers();

        checkForm();
      }

    });


    // Delete button
    const deleteBtn = row.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function() {

      users.splice(index, 1);

      localStorage.setItem("users", JSON.stringify(users));

      displayUsers();

    });


    userTable.appendChild(row);

  });

}


saveBtn.addEventListener("click", function() {

  const user = {
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value
  };

  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  displayUsers();


  
  firstName.value = "";
  lastName.value = "";
  gender.value = "";


  checkForm();

});


displayUsers();