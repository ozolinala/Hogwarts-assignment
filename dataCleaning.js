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

  }

//   trimm whitespace, capitalize names and nicknames, create a new Student object, and then push the new object into the allStudents array 
  function prepareObjects(){

  }


