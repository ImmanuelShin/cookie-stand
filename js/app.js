'use strict';

// Note to self: Change store information to array
const seattle = new Store('Seattle', '6am - 7pm', '123-456-7890', '2901 3rd Ave #300, Seattle, WA 98121', 23, 65, 6.3);
const tokyo = new Store('Tokyo', '6am - 7pm', '222-222-2222', '1 Chrome-1-2 Oshiage, Sumida City, Tokyo 131-8634', 3, 24, 1.2);
const dubai = new Store('Dubai', '6am - 7pm', '333-333-3333', '1 Sheikh Mohammed bin Rashid Blvd- Dubai', 11, 38, 3.7);
const paris = new Store('Paris', '6am - 7pm', '444-444-4444', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris', 20, 38, 2.3);
const lima = new Store('Lima', '6am - 7pm', '555-555-5555', 'Ca. Gral. Borgoño cuadra 8, Miraflores 15074)', 2, 16, 4.6);


// Run tables
function runTables() {
  createTable();
  loadStoreSales();
  getTableTotals();
}

// Create base table
function createTable() {
  let storeSales = getID('storeSales');
  let section = cEl('section');
  section.setAttribute('id', 'tableSection');
  storeSales.append(section);

  let table = cEl('table');
  table.setAttribute('id', 'saleTable');
  section.append(table);

  let tRH = cEl('tr');
  tRH.setAttribute('id', 'firstRow');
  table.appendChild(tRH);

  let tHLocation = cEl('th');
  tHLocation.textContent = 'Locations';
  tRH.appendChild(tHLocation);

  for (let x = 6; x <= 19; x++) {
    let tH = cEl('th');
    if (x < 13) {
      tH.textContent = (x) + ':00am';
    } else {
      tH.textContent = (x - 12) + ':00pm';
    }
    tRH.appendChild(tH);
  }

  let tHTotal = cEl('th');
  tHTotal.textContent = 'Location Totals';
  tRH.appendChild(tHTotal);

  // Table row header end
  let tRHE = cEl('tr');
  tRHE.setAttribute('id', 'tRHE');
  table.appendChild(tRHE);

  let tHLocationEnd = cEl('th');
  tHLocationEnd.textContent = 'Hourly Totals for All Locations';
  tRHE.appendChild(tHLocationEnd);
}


// Function to print all store info. Called on index.html load
function loadStoreInfo() {
  printStoreInfo(seattle);
  printStoreInfo(tokyo);
  printStoreInfo(dubai);
  printStoreInfo(paris);
  printStoreInfo(lima);
}

// Function to append all store sales info to table.
function loadStoreSales() {
  printStoreSales(seattle);
  printStoreSales(tokyo);
  printStoreSales(dubai);
  printStoreSales(paris);
  printStoreSales(lima);
}

// Adds table columns together to get total daily values.
function getTableTotals() {
  let table = getID('saleTable');
  let row = getID('tRHE');
  console.log('test');
  for (let x = 1; x < table.rows[0].cells.length; x++) {
    console.log(table.rows[0].cells.length);
    let tH = cEl('th');
    let total = 0;
    for (let i = 1; i < (table.rows.length - 1); i++){
      let number = table.rows[i].cells[x].childNodes.item(0).data;
      console.log((number));
      total += Number(number);
    }
    console.log(total);
    tH.textContent = total;
    row.appendChild(tH);
  }
}

// Prints store information
function printStoreInfo(store) {
  let storeSection = getID('storeInfo');

  let section = cEl('section');
  section.setAttribute('class', 'storeInformation');
  storeSection.append(section);

  let h3 = cEl('h3');
  h3.textContent = store.name;
  section.append(h3);

  let ul = cEl('ul');
  section.append(ul);

  let liHour = cEl('li');
  liHour.textContent = 'Hours Open: ' + store.hours;
  ul.append(liHour);

  let liContact = cEl('li');
  liContact.textContent = 'Contact Info: ' + store.contact;
  ul.append(liContact);

  let liLocation = cEl('li');
  liLocation.textContent = 'Location: ' + store.address;
  ul.append(liLocation);
}

// Prints store sales info
function printStoreSales(store) {
  let table = getID('saleTable');

  let lastRowIndex = table.rows.length;
  let row = table.insertRow(lastRowIndex - 1);
  row.setAttribute('id', store.name);

  let tdName = cEl('td');
  tdName.textContent = store.name;
  row.appendChild(tdName);

  for (let x of store.cookies) {
    let tdCookie = cEl('td');
    tdCookie.textContent = x;
    row.appendChild(tdCookie);
  }
  let total = cEl('th');
  total.textContent = store.cookies.reduce((acc, c) => acc + c, 0);
  row.appendChild(total);
}

// Store object constructor
function Store(name, hours, contact, address, min, max, average) {
  this.name = name;
  this.hours = hours;
  this.contact = contact;
  this.address = address;
  this.minCus = min;
  this.maxCus = max;
  this.cookiePer = average;
  let cookies = [];
  for (let x = 6; x <= 19; x++) {
    cookies[x-6] = getCookies(x, this.minCus, this.maxCus, this.cookiePer);
  }
  this.cookies = cookies;
}

// Get # of cookies. Generates a random number of customers and multiplies them by average cookies per customer.
function getCookies(hour, min, max, average) {
  if (hour < 10) {
    let minMax = Math.ceil(min * (Math.random() + 1));
    return Math.ceil(Math.ceil(Math.random() * (minMax - min) + min) * average);
  } else if (hour < 15) {
    let maxMin = Math.ceil(max * ((Math.random() * 0.25) + 0.75));
    return Math.ceil(Math.ceil(Math.random() * (max - maxMin) + maxMin) * average);
  } else {
    let maxMinEnd = Math.ceil(max * ((Math.random() * 0.33) + 0.33));
    return Math.ceil(Math.ceil(Math.random() * (max - maxMinEnd) + min) * average);
  }
}

// Repetitive get ID function
function getID(element) {
  return document.getElementById(element);
}

// Repetitive create element function
function cEl(element) {
  return document.createElement(element);
}