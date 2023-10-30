'use strict';




// Store object constructor
function Store(name, hours, contact, address, customers=[]) {
  this.name = name;
  this.hours = hours;
  this.contact = contact;
  this.address = address;
  this.customers = customers;
  this.average = function() {
    return this.customers.reduce((acc, c) => acc + c, 0) / this.customers.length;
  };
}

// Get cookie amounts
function getCookies(hour) {
  if (hour < 10) {
    return Math.floor(Math.random() * 40 + 10);
  } else if (hour < 15) {
    return Math.floor(Math.random() * 200 + 100);
  } else {
    return Math.floor(Math.random() * 100 + 50);
  }
}






// Repetitive get ID function
function getID(element) {
  return document.getElementById(element);
}
