// THE DATA https://petlatkea.dk/2021/hogwarts/students.json

"use strict"
window.addEventListener("DOMContentLoaded", start); 

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";
// an array that will contain objects representing each student
let halfBlood = [];
let pureBlood = [];
let allStudents = [];

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

//   fetch the data, call the prepareObjects() function for each student in the data using
function start() {
  console.log("lets begin");
  loadJson1();
}

async function loadJson1() {
  const resp = await fetch(urlFamilies);
  const data = await resp.json();
  console.log("Blood data loaded");
  halfBlood = data.half;
  pureBlood = data.pure;

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
  buildList();
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
    let firstName = fullname.substring(0, fullname.indexOf(" ")).toLowerCase();
    let lastName = fullname.substring(fullname.lastIndexOf(" ") + 1).toLowerCase();
    let urlImage = lastName + "_" + firstName.charAt(0) + ".png";
    if (firstName === "") {
      urlImage = "empty.png";
    }
    if (lastName === "patil") {
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

  for (let datum of data) {
    const td = document.createElement("td");
    if (datum === student.portrait) {
      const img = document.createElement("img");
      img.src = `./images/${datum}`;
      img.alt = `img`;
      td.appendChild(img);
    } else if (datum === student.house) {
      const img = document.createElement("img");
      img.src = `./images/${datum}.png`; // assuming the house image file names end with ".png"
      img.alt = `img`;
      td.appendChild(img);
    } else {
      td.textContent = datum;
    }
    row.appendChild(td);
  }


  function displayList() {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
  
    // build a new list
    allStudents.forEach(displayStudent);
  }
  
  function displayStudent(alumni) {
    // create clone
    const clone = document.querySelector("template#alumni").content.cloneNode(true);
  
    // set clone data

    clone.querySelector("[data-field=firstName]").textContent = alumni.firstName;
    clone.querySelector("[data-field=lastName]").textContent = alumni.lastName;
    clone.querySelector("[data-field=middleName]").textContent = alumni.middleName;
    clone.querySelector("[data-field=nickName]").textContent = alumni.nickName;
    clone.querySelector("[data-field=house]").textContent = alumni.house;
         clone.querySelector("[data-field=image]").textContent = alumni.image;
        //  clone.querySelector("[data-field=image] img").src = `images/${alumni.image}`;
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
  }


