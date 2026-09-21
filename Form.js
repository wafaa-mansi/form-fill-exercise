const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const gender = document.getElementById("gender");
const saveBtn = document.getElementById("saveBtn");
const userTable = document.getElementById("userTable");

let users = JSON.parse(localStorage.getItem("users")) || [];

debugger;
// Checks if all fields are written 
function checkForm() {

  if (
    firstName.value.trim() !== "" &&
    lastName.value.trim() !== "" &&
    gender.value !== ""
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

// Save button
saveBtn.addEventListener("click", function() {

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${firstName.value}</td>
    <td>${lastName.value}</td>
    <td>${gender.value}</td>
    <td>
      <button class="delete-btn">Delete</button>
    </td>
  `;

  userTable.appendChild(row);
  localStorage.setItem("users", JSON.stringify(users)); 


  // Delete button
  const deleteBtn = row.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", function() {
    row.remove();

    localStorage.removeItem("users");
  });


  // Clear fields
  firstName.value = "";
  lastName.value = "";
  gender.value = "";


  // Disable save button again
  checkForm();

});