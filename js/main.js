loadSortIcons();
const xhr = new XMLHttpRequest(); // create XMLHttpRequest object

/* Declarations */

function populateData(){
  // property specifies function to execute every time object status changes
  xhr.onreadystatechange = () =>{
    const randomUsers = [];
    // request finished and response is ready, status OK
    if (xhr.readyState === 4 && xhr.status === 200){
      const datas = JSON.parse(xhr.responseText).results; // response as array
      for (let i = 0; i < datas.length; ++i){
        const temp = {
          name: `${datas[i].name.first}`,
          uri: `${datas[i].picture.large}`,
          size: `${datas[i].location.street.number}`,
          seeders: `${datas[i].dob.age}`,
          leechers: `${datas[i].registered.age}`
        };
        randomUsers.push(temp);
      }
    populateTable(randomUsers);
    }
  }
  // specify request (GET/POST, URL)
  xhr.open("GET", "https://randomuser.me/api/?results=10");
  // send GET request to server
  xhr.send();
}


function getFormInput(selector){
  const torrentInputs = document.querySelectorAll(`#${selector}`);
  const torrent = [{}];

  torrent[0].name = torrentInputs[0].value;
  torrent[0].uri = torrentInputs[1].value;
  torrent[0].size = torrentInputs[2].value;
  torrent[0].seeders = torrentInputs[3].value;
  torrent[0].leechers = torrentInputs[4].value;

  return torrent;
}


function enableInputs(){
  const inputs = document.querySelectorAll('#torrent-input input');
  for (let i = 0; i < inputs.length; ++i){
    inputs[i].removeAttribute('disabled');
  }
}


function resetIcons(column, target){
  for (let i = 0; i < 5; ++i){
    if (i === column){
      continue;
    } else {
      document.getElementById(target[i]).innerHTML = '&laquo;';
    }
  }
}


function loadSortIcons(){
  // add event handlers to sort buttons
  const sortBtns = ['name-sort', 'uri-sort', 'size-sort', 'seeders-sort', 'leechers-sort'];
  for (let i = 0; i < sortBtns.length; ++i){
    document.getElementById(sortBtns[i]).addEventListener('click', (e) =>{
      let curBtn = e.target;
      const col = e.target.parentNode.cellIndex;
      if (curBtn.innerHTML === '\u00AB'){
        curBtn.innerHTML = '&and;';
        resetIcons(col, sortBtns);
        sortAsc(e);
      } else if (curBtn.innerHTML === '\u2227'){
        curBtn.innerHTML = '&or;';
        resetIcons(col, sortBtns);
        sortDesc(e);
      } else if (curBtn.innerHTML === '\u2228'){
        curBtn.innerHTML = '&laquo;';
        resetIcons(col, sortBtns);
        sortInitial();
      }
    });
  }
}


function populateTable(torrents){
  const tableBody = document.getElementById('torrent-data');
  let i = 0, j = document.getElementsByTagName('tr').length-1; // existing rows in tbody
  for (i, j; i < torrents.length; ++i, ++j){
    const row = constructRowTemplate(torrents[i], j);
    tableBody.appendChild(row); // insert row
  }
}


function constructRowTemplate(torrent, index){
  const tr = document.createElement('tr');
  tr.id = `row-${index}`;

  // convert into array of torrent's values (iterable, has length)
  const torrentValues = Object.values(torrent);
  for (let i = 0; i < torrentValues.length; ++i){
    const td = document.createElement('td');
    // condition for span insertion
    if (i == 2){
      td.innerHTML = `${torrentValues[i]}<span>MB</span>`;
    } else{
    td.textContent = torrentValues[i];
    }
    tr.appendChild(td);
  }

  const tdOption = document.createElement('td');
  const editBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');
  
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('type', 'button'); // avoid firing as submit
  editBtn.addEventListener('click', enableEdit);
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.addEventListener('click', deleteRow);
  
  tdOption.appendChild(editBtn);
  tdOption.appendChild(deleteBtn);
  tr.appendChild(tdOption);

  return tr;
}


function deleteRow(e){
  const userRow = e.target.parentElement.parentElement;
  userRow.remove(userRow);
  enableInputs(); // renable tfoot inputs
}


function sortInitial(){
  // w3 example as starting point
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  while (switching) {
    switching = false;
    rows = document.getElementById('torrent-data').children;
    for (i = 0; i < rows.length-1; ++i){
      shouldSwitch = false;
      x = rows[i].id;
      y = rows[i+1].id;
      if (Number(x.slice(4)) > Number(y.slice(4))){ // exclude 'row-' prepend
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch){
      rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
      switching = true;
    }
  }
}


function sortAsc(e){
  const col = e.target.parentNode.cellIndex;
  // w3 example as starting point
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  if (col === 0 || col === 1){
    while (switching) {
      switching = false;
      rows = document.getElementById('torrent-data').children;
      for (i = 0; i < rows.length-1; ++i){
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[col];
        y = rows[i+1].getElementsByTagName('td')[col];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()){
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch){
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        switching = true;
      }
    }
  } else if (col === 2){
    while (switching){
      switching = false;
      rows = document.getElementById('torrent-data').children;
      for (i = 0; i < rows.length-1; ++i){
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[col];
        y = rows[i+1].getElementsByTagName('td')[col];
        if (Number(x.innerHTML.slice(0, x.innerHTML.length-15)) > Number(y.innerHTML.slice(0, y.innerHTML.length-15))){
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch){
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        switching = true;
      }
    }
  } else {
    while (switching) {
      switching = false;
      rows = document.getElementById('torrent-data').children;
      for (i = 0; i < rows.length-1; ++i){
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[col];
        y = rows[i+1].getElementsByTagName('td')[col];
        if (Number(x.innerHTML) > Number(y.innerHTML)){
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch){
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        switching = true;
      }
    }
  }
}


function sortDesc(e){
  const col = e.target.parentNode.cellIndex;
  // w3 example as starting point
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  if (col === 0 || col === 1){
    while (switching) {
      switching = false;
      rows = document.getElementById('torrent-data').children;
      for (i = 0; i < rows.length-1; ++i){
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[col];
        y = rows[i+1].getElementsByTagName('td')[col];
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()){
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch){
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        switching = true;
      }
    }
  } else if (col === 2){
    while (switching){
      switching = false;
      rows = document.getElementById('torrent-data').children;
      for (i = 0; i < rows.length-1; ++i){
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[col];
        y = rows[i+1].getElementsByTagName('td')[col];
        if (Number(x.innerHTML.slice(0, x.innerHTML.length-15)) < Number(y.innerHTML.slice(0, y.innerHTML.length-15))){
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch){
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        switching = true;
      }
    }
  } else {
    while (switching) {
      switching = false;
      rows = document.getElementById('torrent-data').children;
      for (i = 0; i < rows.length-1; ++i){
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('td')[col];
        y = rows[i+1].getElementsByTagName('td')[col];
        if (Number(x.innerHTML) < Number(y.innerHTML)){
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch){
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        switching = true;
      }
    }
  }
}


function enableEdit(e){
  // cancel any other rows in edit mode
  if (document.getElementsByClassName('edit-mode')[0] != undefined && document.getElementsByClassName('edit-mode')[0].childElementCount === 6){
    const editRow = document.getElementsByClassName('edit-mode')[0];
    editRow.childNodes[editRow.childElementCount-1].firstElementChild.click();
  }

  // store values of the row that clicked edit
  const initialInputs = e.target.parentNode.parentNode;
  const row = document.createElement('tr');
  const id = initialInputs.id;
  row.id = id;
  for (let i = 0; i < initialInputs.childElementCount; ++i){
    const temp = document.createElement('td');
    temp.innerHTML = initialInputs.children[i].innerHTML; // maybe textContent until last td?
    row.appendChild(temp);
  }

  e.target.parentNode.parentNode.classList.add('edit-mode'); // set indicator
  e.target.textContent = 'Save'; // remap edit to save
  e.target.id = 'save-btn'; // add id for submission condition
  e.target.removeEventListener('click', enableEdit);
  e.target.addEventListener('click', saveEdit);

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button');

  // pass original row BEFORE populating cancel so it has data
  cancel.addEventListener('click', ()=>{cancelEdit(row);});
  cancel.textContent = 'Cancel';
  
  e.target.parentNode.insertBefore(cancel, e.target); // insert cancel before save button
  
  // disableInputs() disable tfoot inputs before transforming row
  const inputs = document.querySelectorAll('#torrent-input input');
  for (let i = 0; i < inputs.length; ++i){
    inputs[i].setAttribute('disabled','');
  }
  // transform row tds into inputs
  for (let i = 0; i < 5; ++i){
    const inputVal = e.target.parentNode.parentNode.children[i].textContent;
    const inputEle = document.createElement('input');
    // re-add pattern attribute
    switch(i){
      case 0:
        inputEle.setAttribute('type','text');
        inputEle.setAttribute('required','');
        break;
      case 1:
        inputEle.setAttribute('type','text');
        inputEle.setAttribute('pattern', '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})'); // need double escape char
        inputEle.setAttribute('required','');
        break;
      case 2:
        inputEle.setAttribute('type', 'number');
        inputEle.setAttribute('min', '1');
        inputEle.setAttribute('required','');
        break;
      default:
        inputEle.setAttribute('type','number');
        inputEle.setAttribute('min', '0');
        inputEle.setAttribute('required','');
    }
    // condition to remove MB span
    if (i ==  2){
      inputEle.value = inputVal.slice(0, inputVal.length-2); //textContent ignores the HTML char
    } else{
      inputEle.value = inputVal;
    }
    const tdEle = document.createElement('td');
    tdEle.appendChild(inputEle);
    e.target.parentNode.parentNode.children[i].replaceWith(tdEle);
  }
}


function checkNumInputs(){ // TODO: call in submit handler's else condition
  const numInputs = document.querySelectorAll('input[type="number"]');
  // prevent submitting numbers that start with consecutive zero digits
  for (let i = 0; i < numInputs.length; ++i){
    const temp = numInputs[i].value.toString(); // how to handle <empty string> 
    // allow if single 0 is the only character
    // otherwise handle portion of string matching regex: ^0+
    // by removing or blocking submit
    // MAGIC GOES HERE
  }
}


function cancelEdit(torrentArchive){
  // prepare replacement row
  const id = torrentArchive.id;
  const initialRow = document.getElementById(id);
  initialRow.classList.remove('edit-mode');

  // re-add edit listener
  torrentArchive.children[torrentArchive.children.length-1].firstElementChild.addEventListener('click', enableEdit);
  // breaks without re-add (why?)
  torrentArchive.children[torrentArchive.children.length-1].lastElementChild.addEventListener('click', deleteRow);
  initialRow.replaceWith(torrentArchive);
  // re-enable tfoot inputs
  enableInputs();
}


function saveEdit(e){
  e.target.setAttribute('type','submit'); // set outside of enableEdit to avoid submit on edit
}

/* Operators */

document.getElementById('torrent-form').addEventListener('submit', (e)=>{
  e.preventDefault();

  // if submitter is add-btn
  if (e.submitter.id === 'add-btn'){
    populateTable(getFormInput('torrent-input input'));
    document.getElementById('clear-btn').click(); // clear inputs
  } else {// submit conditional whether to append row on add, or construct and replace row on SAVE)
    const finalInputs = document.getElementById(e.submitter.id).parentNode.parentNode;
    const row = document.createElement('tr');
    const id = finalInputs.id;
    row.id = id;

    for (let i = 0; i < finalInputs.childElementCount-1; ++i){
      const temp = document.createElement('td');
      temp.textContent = finalInputs.children[i].children[0].value;
      if (i == 2){
        temp.innerHTML += '<span>MB</span>';
      }
      row.appendChild(temp);
    }

    // make buttons
    const options = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('type', 'button');
    editBtn.addEventListener('click', enableEdit);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.addEventListener('click', deleteRow);
    options.appendChild(editBtn);
    options.appendChild(deleteBtn);
    row.appendChild(options);
    finalInputs.replaceWith(row); // separate {else} into saveRow function?
    // re-enable tfoot inputs
    enableInputs();
    // does edit need id?
  }
});


// toggle color theme
document.getElementById('theme-btn').addEventListener('click', () =>{
  if (document.body.classList.toggle('dark') === true){
    this.textContent = 'Light Mode';
  } else{
    this.textContent = 'Dark Mode';
  }
});


// TEST FEATURE: add 10 rows from sample JSON
document.getElementById('json-test').addEventListener('click', () =>{
  populateData();
});
