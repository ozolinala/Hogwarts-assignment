// THE DATA https://petlatkea.dk/2021/hogwarts/students.json

"use strict"
window.addEventListener("DOMContentLoaded", start); 

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const familiesUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

// an array that will contain objects representing each student
let halfB = [];
let pureB = [];
let allStudents = [];
let filteredArray;


// an object that serves as a template for each student object
const Student = {
    
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    image: "", 
    house: "",
    blood:"",
  };

//   fetch the data, call the prepareObjects() function for each student in the data 
function start() {
  console.log("lets begin");
  loadJson1();
}

async function loadJson1() {
  const resp = await fetch(familiesUrl);
  const data = await resp.json();
  console.log("Blood data loaded");
  halfB = data.half;
  pureB = data.pure;

  loadJson2();
}

async function loadJson2() {
  const resp = await fetch(url);
  const data = await resp.json();
  console.log("Student data loaded");
  prepareObjects(data);
}
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  filteredArray = allStudents;
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
    allStudents.push(student);
    displayList();
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
    if (lastName === "patil") {
      console.log("Searching for Patil sisters");
      urlImage = lastName + "_" + firstName + ".png";
    }
  
    if (lastName.includes("-")) {
      lastName = lastName.substring(lastName.indexOf("-") + 1);
      urlImage = lastName + "_" + firstName.charAt(0) + ".png";
      return urlImage;
    } else {
      return urlImage;
    }
  }


  function displayList() {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
  
    // build a new list
    allStudents.forEach(displayStudent);
  }
  
  function displayStudent(wizards) {
    // create clone
    const clone = document.querySelector("template#wizards").content.cloneNode(true);
  
    // set clone data

    clone.querySelector("[data-field=firstName]").textContent = wizards.firstName;
    clone.querySelector("[data-field=lastName]").textContent = wizards.lastName;
    clone.querySelector("[data-field=middleName]").textContent = wizards.middleName;
    clone.querySelector("[data-field=nickName]").textContent = wizards.nickName;
    clone.querySelector("[data-field=house]").textContent = wizards.house;
         clone.querySelector("[data-field=image] img").src = `images/${wizards.image}`;
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
  }

// TODO: FILTERING
// TODO: SORTING
// TODO: INQUISITIONAL LIST
// TODO: HACKING