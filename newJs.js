"use strict"
// const url = "https://petlatkea.dk/2021/hogwarts/students.json";
// const familiesUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

window.addEventListener("DOMContentLoaded", start); 

// an array that will contain objects representing each student
let allStudents = [];

// an object that serves as a template for each student object
const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    gender:"",
    image: "", 
    house: "",
    blood:"",
    prefect:false,
    squad:false,
    expelled:false,
  };

const settings = {
  filter:"enrolled",
  sortBy:"firstName",
  sortDir:"asc",
  search: "",
}


//   fetch the data, add the event listeners, call the prepareObjects() function for each student in the data 
function start() {
    console.log("lets go!");
    loadJSON();
    registerButtons();
  }

  function registerButtons() {
    document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
    document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
    document.querySelector("#search").addEventListener("input", searchList);
  }
  
  async function loadJSON() {
    await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
      // When loaded, prepare data objects
      prepareObjects(jsonData[0], jsonData[1]);
    });
  }

  async function prepareObjects(jsonData) {
    allStudents = jsonData.map(prepareObject);
createList();
  }
  

function prepareObject(jsonObject) {
     const student = Object.create(Student);
     let fullname = jsonObject.fullname.trim();
    let newFullname = capitalization(fullname);
   
    let middle = newFullname.substring(newFullname.indexOf(" ") + 1, newFullname.lastIndexOf(" "));
    student.firstName = newFullname.substring(0, newFullname.indexOf(" ") + 1);
    student.lastName = newFullname.substring(newFullname.lastIndexOf(" ") + 1);
    if (middle.charAt(0) === '"' && middle.charAt(middle.length - 1) === '"') {
      middle = middle.substring(1, middle.length - 1); // remove the quotes
      student.nickName = middle;
    } else {
      student.middleName = middle;
    }
    student.image = getPortrait(newFullname);    
    let newHouse = capitalization(jsonObject.house.trim());
    student.house = newHouse;
   console.log(allStudents.push(student));
    displayList(allStudents);
    return student;
  }

  function capitalization(fullname) {
    fullname = fullname.toLowerCase();
    let fullnameArray = fullname.split("");
    fullnameArray[0] = fullnameArray[0].toUpperCase();
    for (let i = 0; i <= fullnameArray.length; i++) {
      if (fullnameArray[i] === " " || fullnameArray[i] === "-" || fullnameArray[i] === '"') {
        fullnameArray[i + 1] = fullnameArray[i + 1].charAt(0).toUpperCase();
      }
    }

    fullname = fullnameArray.join("");
    return fullname;
  }

  

// ------------------------IMAGES------------------

  function getPortrait(fullname) {
    console.log("Getting Image")
    let firstName = fullname.substring(0, fullname.indexOf(" ")).toLowerCase();
    let lastName = fullname.substring(fullname.lastIndexOf(" ") + 1).toLowerCase();
    let urlImage = lastName + "_" + firstName.charAt(0) + ".png";
    if (firstName === "") {
      urlImage = "empty.png";
    }
    // CODE FOR PATIL SISTERS
    if (lastName === "patil") {
      console.log("Searching for Patil sisters");
      urlImage = lastName + "_" + firstName + ".png";
    }
  // CODE FOR JUSTIN
    if (lastName.includes("-")) {
      console.log("Searching for Justin");
      lastName = lastName.substring(lastName.indexOf("-") + 1);
      urlImage = lastName + "_" + firstName.charAt(0) + ".png";
      return urlImage;
    } else {
      return urlImage;
    }
  }

  function createList() {
    allStudents.filter((student) => student.expelled === false);
    const filteredList = filterList(allStudents);
    const sortedList = sortList(filteredList);
    displayList(sortedList);
  }

function displayList(allStudents) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
  
    // build a new list
    allStudents.forEach(displayStudent);
  }

function displayStudent( student ) {

    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // console.log(clone);
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    clone.querySelector("[data-field=house]").textContent = student.house;
         clone.querySelector("[data-field=image] img").src = `images/${student.image}`;

if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = "⭐";
} else {
    clone.querySelector("[data-field=prefect]").textContent = "☆";

}

clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);
function clickPrefect(){
if(student.prefect === true){
    student.prefect = false;
} else {
    student.prefect = true;
}
createList();
}

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}
// FILTER

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`User is filtering by ${filter}`);
    setFilter(filter);
  }
  
  function setFilter(filter) {
    settings.filterBy = filter;
    createList();
  }
  
  function filterList(filteredList) {
    console.log("start if functions")
    if (settings.filterBy === "gryffindor") {
      filteredList = allStudents.filter(isGryffindor);
    } else if (settings.filterBy === "ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    } else if (settings.filterBy === "slytherin") {
        filteredList = allStudents.filter(isSlytherin);
    } else if (settings.filterBy === "hufflepuff") {
      filteredList = allStudents.filter(isHufflepuff);
    } else if (settings.filterBy === "prefect") {
      filteredList = allStudents.filter(isPrefect);
    } else if (settings.filterBy === "inquisitor") {
      filteredList = allStudents.filter(isInqSqd);
    } else if (settings.filterBy === "expelled") {
      filteredList = allStudents.filter(isExpelled);
    } else if (settings.filterBy === "*") {
        filteredList = allStudents;
      }
    return filteredList;
  }
  
  function isGryffindor(student) {
    return student.house === "Gryffindor";
  }
  
  function isHufflepuff(student) {
    return student.house === "Hufflepuff";
  }
  
  function isRavenclaw(student) {
    return student.house === "Ravenclaw";
  }
  
  function isSlytherin(student) {
    return student.house === "Slytherin";
  }
  
  function isPrefect(student) {
    return student.prefect === true;
  }
  
  function isInqSqd(student) {
    return student.inquisitor === true;
  }
  
  function isExpelled(student) {
    return student.expelled === true;
  }
// SORTING (does not function perfectly for the firstName)

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
  
    // toggle direction
    if (sortDir === "asc") {
      event.target.dataset.sortDirection = "desc";
    } else {
      event.target.dataset.sortDirection = "asc";
    }
    setSort(sortBy, sortDir);
  }
  
  function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    createList();
  }
  
  function sortList(sortedList) {
    let direction = 1;
    if (settings.sortDir === "desc") {
      direction = -1;
    } else {
      settings.direction = 1;
    }
    sortedList = sortedList.sort(sortByProperty);
  
    function sortByProperty(propertyA, propertyB) {
      if (propertyA[settings.sortBy] < propertyB[settings.sortBy]) {
        return -1 * direction;
      } else {
        return 1 * direction;
      }
    }
    return sortedList;
  }


// BLOOD TYPES

// SEARCH INPUT

  function searchFunction() {
    const input = document.querySelector("#search");
    const searchString = input.value.toUpperCase();
    const searchedStudents = allStudents.filter((student) => {
      return student.firstName.toUpperCase().includes(searchString) || student.lastName.toUpperCase().includes(searchString);
    });
    displayList(searchedStudents);
  }
  
// TODO: POP-UP


// TODO: EXPELLING

// TODO: HACKING