'use strict';

// Note to self: Change store information to array
const seattle = new Store('Seattle', '6am - 7pm', '123-456-7890', '2901 3rd Ave #300, Seattle, WA 98121', 23, 65, 6.3);
const tokyo = new Store('Tokyo', '6am - 7pm', '222-222-2222', '1 Chrome-1-2 Oshiage, Sumida City, Tokyo 131-8634', 3, 24, 1.2);
const dubai = new Store('Dubai', '6am - 7pm', '333-333-3333', '1 Sheikh Mohammed bin Rashid Blvd- Dubai', 11, 38, 3.7);
const paris = new Store('Paris', '6am - 7pm', '444-444-4444', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris', 20, 38, 2.3);
const lima = new Store('Lima', '6am - 7pm', '555-555-5555', 'Ca. Gral. Borgoño cuadra 8, Miraflores 15074)', 2, 16, 4.6);

const storeArray = [seattle, tokyo, dubai, paris, lima];

// Finds #orderForm's submit input and adds event listener
// Sends order to local storage if order exists
// Checks if on order-processing.html. Calls listOrders() if true
function orderUp() {
  const submit = getID('orderSubmit');
  const pending = getID('pendingOrders');
  const form = getID('orderForm');
  if (submit) {
    submit.addEventListener('click', function(e) {
      e.preventDefault();
      const storageArray = [];
      if (localStorage.getObj('pendingOrder')) {
        storageArray.push(localStorage.getObj('pendingOrder'));
      }
      storageArray.push(storeOrder(form));
      console.log(storageArray);
      localStorage.setObj('pendingOrder', storageArray);
      form.reset();
    });
  }
  if (pending) {
    listOrders();
  }
}

// Function to contain light dark switcher
// Sets up event listener for check box
// Changes states if check box is checked and keeps checked information in local storage
// Calls updateColors at all points to ensure state synced across pages.
function lightDark() {
  const checkbox = getID('checkBox');

  checkbox.addEventListener('change', function() {
    localStorage.setItem('checkboxStatus', checkbox.checked);
    updateColors();
  });

  // Set initial checkbox state
  const storedCheckboxStatus = localStorage.getItem('checkboxStatus');
  if (storedCheckboxStatus) {
    checkbox.checked = JSON.parse(storedCheckboxStatus);
    updateColors();
  }
}

// Function to update specified colors based on checkbox state
function updateColors() {
  const checkbox = getID('checkBox');
  const body = document.body;

  if (checkbox.checked) {
    body.style.backgroundColor = 'black';
    body.style.color = 'white';
  } else {
    body.style.backgroundColor = 'white';
    body.style.color = 'black';
  }
}

// Runs all the functions that print to html pages
// Checks if pages are loaded before running appropriate functions
function printFunctions() {
  if (getID('tables')){
    createSalesTable();
    createStaffTable();
    renderStores();
    getTableTotals();
    getStoreForm();
  }
  if (getID('storeInfo')){
    informStores();
  }
}

// Adds event listener to #storeForm's submit input
// Creates new Store object from form
// Calls replaceStore() if newStore.name matches a name in saleTable
// Calls appendStore() if not
// Calls getTableTotals() to recalculate daily totals based off new store information
function getStoreForm() {
  const form = getID('storeForm');
  const submit = getID('storeSubmit');
  submit.addEventListener('click', function(e) {
    e.preventDefault();
    const array = storeOrder(form);

    form.reset();

    const newStore = createStore(array);

    const table = getID('saleTable');
    const rows = table.rows;
    let isIn = false;
    let i = 0;
    for (let x of rows) {
      if (String(newStore.name) === String(x.cells[0].childNodes.item(0).data)) {
        replaceStore(newStore, i);
        isIn = true;
        break;
      }
      i++;
    }
    if (!isIn) {
      appendStore(newStore);
    }
    getTableTotals();
  });
}

// Creates new Store object.
// Accepts array as argument
// Inputs form array values into newStore object and returns newStore
function createStore(form) {
  const newStore =  new Store(form[0], 'NA', 'NA', 'NA', form[1], form[2], form[3]);
  return newStore;
}

// Creates new table row and replaces old table row
// Takes store object and index as arguments.
// Creates new row with store values.
// Replaces row at index with new row.
function replaceStore(store, index) {
  const table1 = getID('saleTable');
  const table2 = getID('staffTable');

  const row1 = cEl('tr');
  const row2 = cEl('tr');

  const tD1 = cEl('td');
  const tD2 = cEl('td');

  tD1.textContent = store.name;
  tD2.textContent = store.name;

  row1.appendChild(tD1);
  row2.appendChild(tD2);

  for (let x of store.cookies) {
    const tdCookie = cEl('td');
    tdCookie.textContent = x;
    row1.appendChild(tdCookie);
  }

  for (let x of store.staff) {
    const tdStaff = cEl('td');
    tdStaff.textContent = x;
    row2.appendChild(tdStaff);
  }

  const total = cEl('th');
  total.textContent = store.cookies.reduce((acc, c) => acc + c, 0);
  row1.appendChild(total);

  table1.replaceChild(row1, table1.rows[index]);
  table2.replaceChild(row2, table2.rows[index]);
}

// Takes new Store and calls render functions
// AKA prints store info to tables.
function appendStore(store) {
  store.renderSales();
  store.renderStaff();
}

// Create base sales table
function createSalesTable() {
  const article = getID('tables');
  const section = cEl('section');
  section.setAttribute('class', 'tableSection');
  article.append(section);

  const header = cEl('h2');
  header.textContent = 'Hourly Cookie Sales';
  section.append(header);

  const table = cEl('table');
  table.setAttribute('id', 'saleTable');
  section.append(table);

  const tRH = cEl('tr');
  tRH.setAttribute('id', 'firstRow');
  table.appendChild(tRH);

  const tHLocation = cEl('th');
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

  const tHTotal = cEl('th');
  tHTotal.textContent = 'Location Totals';
  tRH.appendChild(tHTotal);

  // Table row header end
  const tRHE = cEl('tr');
  tRHE.setAttribute('id', 'tRHE');
  table.appendChild(tRHE);

  const tHLocationEnd = cEl('th');
  tHLocationEnd.textContent = 'Hourly Totals for All Locations';
  tRHE.appendChild(tHLocationEnd);
}

// Create base staff table. Largely redundant, but too lazy to make generic.
function createStaffTable() {
  const article = getID('tables');
  const section = cEl('section');
  section.setAttribute('class', 'tableSection');
  article.append(section);

  const header = cEl('h2');
  header.textContent = 'Minimum Staff';
  section.append(header);

  const table = cEl('table');
  table.setAttribute('id', 'staffTable');
  section.append(table);

  const tRH = cEl('tr');
  tRH.setAttribute('id', 'firstRow');
  table.appendChild(tRH);

  const tHLocation = cEl('th');
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
}

// Function to print all store info. Called on index.html load
function informStores() {
  for (let x of storeArray) {
    x.inform();
  }
}

// Calls render method for all stores. Essentially prints store info to table.
function renderStores() {
  for (let x of storeArray) {
    x.renderSales();
    x.renderStaff();
  }
}

// Adds table columns together to get total daily values.
function getTableTotals() {
  const table = getID('saleTable');
  const row = getID('tRHE');
  for (let x = 1; x < table.rows[0].cells.length; x++) {
    const tH = cEl('th');
    let total = 0;
    for (let i = 1; i < (table.rows.length - 1); i++){
      let number = table.rows[i].cells[x].childNodes.item(0).data;
      total += Number(number);
    }
    tH.textContent = total;
    if (row.cells[x]) {
      row.replaceChild(tH, row.cells[x]);
    } else {
      row.appendChild(tH);
    }
  }
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
  this.cookies = getCookies(this.maxCus, this.cookiePer);
  this.staff = getStaff(this.maxCus);
}

// Method to append store sales onto table.
Store.prototype.renderSales = function() {
  const table = getID('saleTable');

  const lastRowIndex = table.rows.length;
  const row = table.insertRow(lastRowIndex - 1);

  const tdName = cEl('td');
  tdName.textContent = this.name;
  row.appendChild(tdName);

  for (let x of this.cookies) {
    const tdCookie = cEl('td');
    tdCookie.textContent = x;
    row.appendChild(tdCookie);
  }
  const total = cEl('th');
  total.textContent = this.cookies.reduce((acc, c) => acc + c, 0);
  row.appendChild(total);
};

// Method to append store staff onto table.
Store.prototype.renderStaff = function() {
  const table = getID('staffTable');

  const lastRowIndex = table.rows.length;
  const row = table.insertRow(lastRowIndex);

  const tdName = cEl('td');
  tdName.textContent = this.name;
  row.appendChild(tdName);

  for (let x of this.staff) {
    const tdStaff = cEl('td');
    tdStaff.textContent = x;
    row.appendChild(tdStaff);
  }
};

// Method to print store information onto index.html page
Store.prototype.inform = function() {
  const storeSection = getID('storeInfo');

  const section = cEl('section');
  section.setAttribute('class', 'storeInformation');
  storeSection.append(section);

  const h3 = cEl('h3');
  h3.textContent = this.name;
  section.append(h3);

  const ul = cEl('ul');
  section.append(ul);

  const liHour = cEl('li');
  liHour.textContent = 'Hours Open: ' + this.hours;
  ul.append(liHour);

  const liContact = cEl('li');
  liContact.textContent = 'Contact Info: ' + this.contact;
  ul.append(liContact);

  const liLocation = cEl('li');
  liLocation.textContent = 'Location: ' + this.address;
  ul.append(liLocation);
};

// Get # of cookies. Generates a random number of customers and multiplies them by average cookies per customer.
function getCookies(max, average) {
  const traffic = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4];
  const cookies = [];
  for (let x = 0; x <= 13; x++) {
    cookies[x] = Math.ceil(max * traffic[x] * average);
  }
  return cookies;
}

// Get minimum # of staff required at each hour.
function getStaff(max) {
  const traffic = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4];
  const staff = [];
  let i = 0;
  for (let x of traffic) {
    let reqStaff = Math.ceil(x * max / 20);
    if (reqStaff <= 2) {
      staff[i] = 2;
    } else {
      staff[i] = reqStaff;
    }
    i++;
  }
  return staff;
}

// Inputs all data from form into array
function storeOrder(form) {
  const formArray = [];
  for (let x of form.elements) {
    if ((x.nodeName === 'INPUT' || x.nodeName === 'SELECT') && x.name) {
      formArray.push(x.value);
    }
  }
  return formArray;
}

// Keeps track of orders
// Global for ease of access
let organizedArray = [];

// Takes array from localStorage and prints to order-processing.html
function listOrders() {
  const ul = getID('pendingList');
  let array = localStorage.getObj('pendingOrder');
  array = array.flat(Infinity);
  array = array.filter(a => (String(a) !== 'Order Now'));
  let tempArray = [];
  let i = 0;
  console.log(array);
  for (let x in array) {
    if (i === 4) {
      tempArray.push(array[x]);
      organizedArray.push(tempArray);
      tempArray = [];
      i = 0;
    } else {
      tempArray.push(array[x]);
      i++;
    }
  }

  let z = 0;
  for (let x of organizedArray) {
    const li = cEl('li');
    li.setAttribute('class', 'pendingItem');
    li.setAttribute('id', 'pending' + z);
    ul.append(li);
    let p = cEl('p');
    p.textContent = 'Name: ' + x[0] + ' | Address: ' + x[1] + ' | Product: ' + x[2] + ' | Amount: ' + x[3] + ' | Instructions: ' + x[4];
    li.append(p);
    const button = cEl('button');
    button.setAttribute('class', 'fillButton');
    button.textContent = 'Fill Order';
    button.addEventListener('click', fillOrder);
    li.append(button);
    z++;
  }
}

// Takes li from #pendingList and moves it to #filledList
// Called by buttons on #pendingList
// Updates localStorage to account for finished pending item.
function fillOrder() {
  const fill = getID('filledList');
  const pend = getID('pendingList');

  const li = this.parentElement;
  let id = li.id;
  id = id.match(/\d+/g);
  li.removeChild(li.lastChild);

  pend.removeChild(li);
  fill.appendChild(li);

  organizedArray.splice(Number(id), 1);
  let tempArray = organizedArray.flat(Infinity);
  localStorage.setObj('pendingOrder', tempArray);
}

// Add localStorage method to pass objects
// Just translates arrays or objects into JSON
Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

// New method to get objects
// Translates JSON back into object
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key));
};

// Repetitive get ID function
function getID(element) {
  return document.getElementById(element);
}

// Repetitive create element function
function cEl(element) {
  return document.createElement(element);
}

// Last calls
lightDark();
printFunctions();
orderUp();

