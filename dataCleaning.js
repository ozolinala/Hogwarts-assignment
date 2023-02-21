// THE DATA https://petlatkea.dk/2021/hogwarts/students.json

"use strict"

// the JSON-data only contains the full name of each student, you need to write code that splits it into parts, capitalizes those parts correctly, and puts them into the newly created student object.
// If a student doesn't have a middle name, the object should either have null or undefined for the middle name - you decide.
// If a student has multiple middle names, you can combine them all into a single string, but remember to capitalize each one.
// Nick-names are put in quotation marks in the JSON, but should just be plain text in the student object.
// Make sure that there aren't any spaces around names.

// Usually the first letter of each name should be upper case, and the remaining should be lower case.
// However, names with a hyphen, must have the first letter after the hyphen capitalized as well.
// The house names should also be proper capitalized.

// You don't have to use the images in this version, but find a way to extract/calculate the image filename from the student name. You will find a pattern!


//  statement waits for the page to finish loading before calling the start() function.
window.addEventListener("DOMContentLoaded", start); 

const url = "https://petlatkea.dk/2021/hogwarts/students.json";


// an array that will contain objects representing each student
let allStudents = [];

// an object that serves as a template for each student object
const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    image: "",
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
    student.image = `images/${newFullname.toLowerCase().replace(/\s/g, '-')}.png`;
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
    clone.querySelector("[data-field=image]").textContent = alumni.image;
    clone.querySelector("[data-field=house]").textContent = alumni.house;
  
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
  }


