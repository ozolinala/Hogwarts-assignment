// THE DATA https://petlatkea.dk/2021/hogwarts/students.json

"use strict"
window.addEventListener("DOMContentLoaded", start); 

// const url = "https://petlatkea.dk/2021/hogwarts/students.json";
// const familiesUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

// an array that will contain objects representing each student
let halfB = [];
let pureB = [];
let allStudents = [];
let filteredArray;
// let filteredList;
// let buttonDataFilter = {filter: "*"};


// an object that serves as a template for each student object
const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender:"",
    image: "", 
    house: "",
    blood:"",
    prefect:false,
    inquisitor:false,
    expelled:false,
  };
const settings = {
  filter:"enrolled",
  sortBy:"firstname",
  sortDir:"asc",

}

//   fetch the data, add the event listeners, call the prepareObjects() function for each student in the data 
function start() {
  console.log("lets begin");
  loadJSON();
  registerButtons();
  console.log(allStudents);
}
function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("#search-bar").addEventListener("input", searching);
  //Hack the system
//   document.querySelector("#enterthevoid").addEventListener("click", hackSystem);
// 
}

async function loadJSON() {
  await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
    // When loaded, prepare data objects
    prepareObjects(jsonData[0], jsonData[1]);
  });
}
// async function loadJson1() {
//   const resp = await fetch(familiesUrl);
//   const data = await resp.json();
//   console.log("Blood data loaded");
//   halfB = data.half;
//   pureB = data.pure;
//   loadJson2();
// }

// async function loadJson2() {
//   const resp = await fetch(url);
//   const data = await resp.json();
//   console.log("Student data loaded");
//   prepareObjects(data);
// }
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  filteredArray = allStudents;
  buildList();
}

function buildList(){
  const currentList = filteredArray(allStudents);
  displayList(filteredArray);
  console.log("hi")
}

//   trimm whitespace, capitalize names and nicknames, create a new Student object, and then push the new object into the allStudents array 

function prepareObject(studentObject) {
    let fullname = studentObject.fullname.trim();
    let newFullname = capitalization(fullname);
    const student = Object.create(Student);
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
    let newHouse = capitalization(studentObject.house.trim());
    student.house = newHouse;
   console.log(allStudents.push(student));
    displayList(allStudents);
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
    console.log("Capitalization log", fullnameArray);
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
// ----------------------------------------
  function displayList(list) {
    allStudents = list;
    console.log(allStudents);
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
  
    // build a new list
    allStudents.forEach(displayStudent);
  }
  
  function displayStudent(wizards) {
    // create clone
    const clone = document.querySelector("template#wizards").content.cloneNode(true);
  
    // set clone data
console.log(clone);
    clone.querySelector("[data-field=firstName]").textContent = wizards.firstName;
    console.log(wizards.firstName);
    clone.querySelector("[data-field=lastName]").textContent = wizards.lastName;
    clone.querySelector("[data-field=middleName]").textContent = wizards.middleName;
    clone.querySelector("[data-field=nickName]").textContent = wizards.nickName;
    clone.querySelector("[data-field=house]").textContent = wizards.house;
         clone.querySelector("[data-field=image] img").src = `images/${wizards.image}`;
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
  }
// SEARCH 
function searchList() {
  const searchWord = document.querySelector("#search").value.toLowerCase();
  const searchedList = allStudents.filter(isSearched);

  function isSearched(student) {
    if (student.lastName == undefined) {
      const fullName = `${student.firstName}`.toLowerCase();

      return fullName.includes(searchWord);
    } else {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(searchWord);
    }
  }

  displayList(searchedList);
}
//  ------------------- FILTERING ---------------------

// tried to filter like the animal base
// function selectFilter(event){
//   let filteredList = all;
//   buttonDataFilter = event.target.dataset.filter;
//   if (buttonDataFilter !== "*") {
//       filteredList = allStudents.filter(whichHouse);
//   } else {
//       filteredList = allStudents;
//   }
//   displayList(filteredList);
// }
// function whichHouse(wizards){
//   if (wizards.house === buttonDataFilter){
//       return true;
//   }
// }
// FILTERING
// const filterButtons = document.querySelectorAll('.filter');

// filterButtons.forEach(button => {
//   button.addEventListener('click', (event) => {
//     const filter = event.target.dataset.filter;
//     const studentList = document.querySelectorAll('#list tbody tr');

//     studentList.forEach((s) => {
//       if (filter === '*') {
//         // console.log(s);
//         s.style.display = '';
//       console.log("this is the filter", `${filter}`)
//         return;
//       }

//       if (s.house === filter )
//         // || student.dataset.enrolled === filter || student.dataset.expelled === filter) 
//         {
//           console.log("this is the filter", `${filter}`, `${s.house}`)
//         s.style.display = '';
//       } else {
//         s.style.display = 'none';
//       }
//     });
//   });
// });

// TODO: SORTING
// TODO: INQUISITIONAL LIST
// TODO: EXPELLING
// TODO: HACKING