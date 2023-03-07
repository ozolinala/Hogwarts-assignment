"use strict"
window.addEventListener("DOMContentLoaded", start); 

const url = "https://petlatkea.dk/2021/hogwarts/students.json";


// an array that will contain objects representing each student
let allStudents = [];

// an object that serves as a template for each student object
const Student = {
    image: "", 
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    house: "",
  };

//   fetch the data, call the prepareObjects() function for each student in the data using
 function start(){
    fetch(url)
    .then((response) => response.json())
    .then((allStudentData) => allStudentData.forEach(prepareObjects));
  }

//   trimm whitespace, capitalize names and nicknames, create a new Student object, and then push the new object into the allStudents array 

function prepareObjects(studentObject) {
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
    // IMAGE
    student.image = grabImage("images/", student.firstName, student.lastName);

    student.prefect = false;
student.inquisitor = false;

    let newHouse = capitalization(studentObject.house.trim());
    student.house = newHouse;
    allStudents.push(student);
    displayList();
  }
function garbImage(firstName, lastName){
    let picture;
    return picture;
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
       clone.querySelector("[data-field=image]").textContent = alumni.image;
    clone.querySelector("[data-field=firstName]").textContent = alumni.firstName;
    clone.querySelector("[data-field=lastName]").textContent = alumni.lastName;
    clone.querySelector("[data-field=middleName]").textContent = alumni.middleName;
    clone.querySelector("[data-field=nickName]").textContent = alumni.nickName;
    clone.querySelector("[data-field=house]").textContent = alumni.house;
  
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
  }
