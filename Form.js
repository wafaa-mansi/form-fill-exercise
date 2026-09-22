const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const gender = document.getElementById("gender");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

const userTable = document.getElementById("userTable");
const userCount = document.getElementById("userCount");

const searchInput = document.getElementById("searchInput");

const filterGender = document.querySelectorAll(".filterGender");

const fnSort = document.getElementById("fnSort");
const lnSort = document.getElementById("lnSort");

const firstNameError =
  document.getElementById("firstNameError");

const lastNameError =
  document.getElementById("lastNameError");

const genderError =
  document.getElementById("genderError");

const pagination =
  document.getElementById("pag");

const pageInfo =
  document.getElementById("pageNb");

const totalUsers = 
    document.getElementById("totalUsers");

const maleUsers = 
    document.getElementById("maleUsers");

const femaleUsers = 
    document.getElementById("femaleUsers");

let users =
  JSON.parse(localStorage.getItem("users")) || [];

let isEditing = false;

let selectedGender = "All";

let fieldSort = "";

let alphSort = "asc";

let currentPage = 1;

const usersPerPage = 5;


function checkForm() {

  let isValid = true;



  if (firstName.value.trim() === "") {

    firstNameError.textContent =
      "First Name required.";

    isValid = false;
  }

  else if (firstName.value.trim().length < 3) {

    firstNameError.textContent =
      "Minimum length of 3 characters required.";

    isValid = false;
  }

  else if (/\d/.test(firstName.value)) {

    firstNameError.textContent =
      "Name cannot contain numbers.";

    isValid = false;
  }

  else {

    firstNameError.textContent = "";
  }


  if (lastName.value.trim() === "") {

    lastNameError.textContent =
      "Last Name required.";

    isValid = false;
  }

  else if (lastName.value.trim().length < 3) {

    lastNameError.textContent =
      "Minimum length of 3 characters required.";

    isValid = false;
  }

  else if (/\d/.test(lastName.value)) {

    lastNameError.textContent =
      "Name cannot contain numbers.";

    isValid = false;
  }

  else {

    lastNameError.textContent = "";
  }



  if (gender.value === "") {

    genderError.textContent =
      "Please select a gender.";

    isValid = false;
  }

  else {

    genderError.textContent = "";
  }



  if (isValid && isEditing === false) {

    saveBtn.disabled = false;
  }

  else {

    saveBtn.disabled = true;
  }
}


firstName.addEventListener("input", checkForm);

lastName.addEventListener("input", checkForm);

gender.addEventListener("change", checkForm);


//user count 
function addUserCount() {

  userCount.textContent = users.length;

}



function displayUsers(list) {

  userTable.innerHTML = "";


  list.forEach(function(user) {

    const row =
      document.createElement("tr");


    row.innerHTML = `
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.gender}</td>

      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;


    // edit btn

    const editBtn =
      row.querySelector(".edit-btn");


    editBtn.addEventListener(
      "click",
      function() {

        if (editBtn.innerText === "Edit") {

          firstName.value =
            user.firstName;

          lastName.value =
            user.lastName;

          gender.value =
            user.gender;


          editBtn.innerText = "Save";

          isEditing = true;

          saveBtn.disabled = true;
        }

        else {

          const originalIndex =
            users.indexOf(user);


          users[originalIndex].firstName =
            firstName.value.trim();

          users[originalIndex].lastName =
            lastName.value.trim();

          users[originalIndex].gender =
            gender.value;


          localStorage.setItem(
            "users",
            JSON.stringify(users)
          );


          isEditing = false;


          firstName.value = "";
          lastName.value = "";
          gender.value = "";


          addUserCount();

          applyFilters();

          checkForm();
          updateStatistics();
        }

      }
    );


    // delete btn

    const deleteBtn =
      row.querySelector(".delete-btn");


    deleteBtn.addEventListener(
      "click",
      function() {

        const confirmDelete = confirm(
          "Are you sure you want to delete " +
          user.firstName +
          " " +
          user.lastName +
          "?"
        );


        if (confirmDelete) {

          const originalIndex =
            users.indexOf(user);


          users.splice(originalIndex, 1);


          localStorage.setItem(
            "users",
            JSON.stringify(users)
          );


          addUserCount();

          applyFilters();
          updateStatistics();
        }

      }
    );


    userTable.appendChild(row);

  });

}


// filter function (search, gender & sort)

function applyFilters() {

  const searchValue =
    searchInput.value
      .trim()
      .toLowerCase();


  let filterUsers =
    users.filter(function(user) {


      const searchMatch =

        user.firstName
          .toLowerCase()
          .includes(searchValue)

        ||

        user.lastName
          .toLowerCase()
          .includes(searchValue);


      const genderMatch =

        selectedGender === "All"

        ||

        user.gender === selectedGender;


      return searchMatch && genderMatch;

    });


  //sort

  if (fieldSort !== "") {

    filterUsers.sort(function(a, b) {

      const nameA =
        a[fieldSort].toLowerCase();

      const nameB =
        b[fieldSort].toLowerCase();


      if (alphSort === "asc") {

        return nameA.localeCompare(nameB);
      }

      else {

        return nameB.localeCompare(nameA);
      }

    });

  }


  //pagination

  const totalPages =
    Math.ceil(
      filterUsers.length / usersPerPage
    );


  if (
    currentPage > totalPages &&
    totalPages > 0
  ) {

    currentPage = totalPages;
  }


  if (totalPages === 0) {

    currentPage = 1;
  }


  displayPage(filterUsers);

}


//search

searchInput.addEventListener(
  "input",
  function() {

    currentPage = 1;

    applyFilters();

  }
);


//gender

filterGender.forEach(
  function(button) {

    button.addEventListener(
      "click",
      function() {

        selectedGender =
          button.dataset.gender;

        currentPage = 1;

        applyFilters();

      }
    );

  }
);


// fn sort
fnSort.addEventListener(
  "click",
  function() {

    if (fieldSort === "firstName") {

      alphSort =
        alphSort === "asc"
          ? "desc"
          : "asc";
    }

    else {

      fieldSort = "firstName";

      alphSort = "asc";
    }


    fnSort.textContent =

      alphSort === "asc"
        ? "First Name A-Z"
        : "First Name Z-A";


    currentPage = 1;

    applyFilters();

  }
);


//ln sort

lnSort.addEventListener(
  "click",
  function() {

    if (fieldSort === "lastName") {

      alphSort =
        alphSort === "asc"
          ? "desc"
          : "asc";
    }

    else {

      fieldSort = "lastName";

      alphSort = "asc";
    }


    lnSort.textContent =

      alphSort === "asc"
        ? "Last Name A-Z"
        : "Last Name Z-A";


    currentPage = 1;

    applyFilters();

  }
);


// save btn 

saveBtn.addEventListener(
  "click",
  function() {


    //duplicate check

    const duplicateUsers =
      users.some(function(user) {

        return (

          user.firstName
            .toLowerCase()

          ===

          firstName.value
            .trim()
            .toLowerCase()

          &&

          user.lastName
            .toLowerCase()

          ===

          lastName.value
            .trim()
            .toLowerCase()

        );

      });


    if (duplicateUsers) {

      alert("This user already exists.");

      return;
    }



    const newUser = {

      firstName:
        firstName.value.trim(),

      lastName:
        lastName.value.trim(),

      gender:
        gender.value

    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    addUserCount();

    firstName.value = "";
    lastName.value = "";
    gender.value = "";

    currentPage = 1;

    applyFilters();
    checkForm();
    updateStatistics();

  }
);


//clear btn

clearBtn.addEventListener(
  "click",
  function() {

    users = [];


    localStorage.removeItem("users");


    currentPage = 1;


    addUserCount();

    applyFilters();
    updateStatistics();

  }
);


//page function

function displayPage(list) {

  const startIndex =
    (currentPage - 1) *
    usersPerPage;


  const endIndex =
    startIndex +
    usersPerPage;


  const usersForPage =
    list.slice(
      startIndex,
      endIndex
    );


  displayUsers(usersForPage);


  createPagination(list);

}


//pagination creation 

function createPagination(list) {

  pagination.innerHTML = "";


  const totalPages =
    Math.ceil(
      list.length / usersPerPage
    );


  const previousBtn =
    document.createElement("button");


  previousBtn.textContent =
    "Previous";


  if (currentPage === 1) {

    previousBtn.disabled = true;
  }


  previousBtn.addEventListener(
    "click",
    function() {

      currentPage--;

      displayPage(list);

    }
  );


  pagination.appendChild(previousBtn);

  //pg nb btn 
  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    const pageBtn =
      document.createElement("button");


    pageBtn.textContent = i;


    if (i === currentPage) {

      pageBtn.classList.add(
        "active-page"
      );
    }


    pageBtn.addEventListener(
      "click",
      function() {

        currentPage = i;

        displayPage(list);

      }
    );


    pagination.appendChild(pageBtn);

  }



  const nextBtn =
    document.createElement("button");


  nextBtn.textContent = "Next";


  if (
    currentPage === totalPages
    ||
    totalPages === 0
  ) {

    nextBtn.disabled = true;
  }


  nextBtn.addEventListener(
    "click",
    function() {

      currentPage++;

      displayPage(list);

    }
  );


  pagination.appendChild(nextBtn);


  //pg info

  const start =

    list.length === 0

      ? 0

      : (currentPage - 1) *
          usersPerPage + 1;


  const end = Math.min(

    currentPage *
      usersPerPage,

    list.length

  );


  pageInfo.textContent =

    "Showing " +
    start +
    "-" +
    end +
    " of " +
    list.length +
    " users";

}

//statistics function 
function updateStatistics() {

  totalUsers.textContent = users.length;

  const males = users.filter(function(user) {
    return user.gender === "Male";
  });

  const females = users.filter(function(user) {
    return user.gender === "Female";
  });

  maleUsers.textContent = males.length;
  femaleUsers.textContent = females.length;
}


addUserCount();
updateStatistics();
applyFilters();