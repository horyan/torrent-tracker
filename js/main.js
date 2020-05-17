const myStorage = window.localStorage;
window.addEventListener('load', restoreTheme); // restore dark theme onload

/* Declarations */

function toggleTheme(){
  if (document.body.classList.toggle('dark') === true){
    document.getElementById('theme-btn').textContent = 'Light Mode';
    // set storage
    myStorage.setItem('theme', 'dark');
  } else{
    document.getElementById('theme-btn').textContent = 'Dark Mode';
    // clear storage
    myStorage.clear();
  }
}


function restoreTheme(){
  if (myStorage.getItem('theme')==='dark'){
    document.getElementById('theme-btn').click();
  }
}


function populateRandom(){
  const randomUsers = [];
  fetch('https://randomuser.me/api/?results=10')
    .then(response => response.json())
    .then(result =>{
      result.results.forEach(data =>
          randomUsers.push({
            name: data.name.first,
            uri: data.picture.large,
            size: data.location.street.number,
            seeders: data.dob.age,
            leechers: data.registered.age,
          })
      );
      populateTable(randomUsers);
      // load icons at exactly 10 tbody rows
      if (document.querySelectorAll('#torrent-data tr').length === 10){
        loadIcon();
      }
    })
}


function copyContent(e){
  // w3+stack as starting point
  const content = e.target.previousSibling.textContent;

  // copy to clipboard without input element
  const temp = document.createElement("input"); // hidden dummy
  temp.value = content;
  
  temp.setAttribute('readonly', ''); // tamper-proof
  temp.style.position = 'absolute';
  temp.style.left = '-9999px'; // move outside screen (invisible)
  
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  temp.setSelectionRange(0, 99999); // mobile

  document.execCommand('copy');
  alert(`Copied: ${content}`); // alert

  document.body.removeChild(temp); // remove after copy
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
  inputs.forEach(input => input.removeAttribute('disabled'))
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


function addIconListeners(){
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


function loadIcon(){
  // display icons with id assignments for addIconListeners
  const ids = ['name-sort', 'uri-sort', 'size-sort', 'seeders-sort', 'leechers-sort'];
  const ths = document.querySelectorAll('th');
  const labels = document.querySelectorAll('label');
  for (let i = 0; i < labels.length; ++i){
    const sortBtn = document.createElement('button');
    sortBtn.id = ids[i];
    sortBtn.setAttribute('type', 'button');
    sortBtn.innerHTML = '&laquo;';
    ths[i].insertBefore(sortBtn, labels[i].nextSibling); // insertAfter
  }
  addIconListeners();
}


function populateTable(torrents){
  // load icon display and functionality at exactly 2 tbody rows
  if (document.querySelectorAll('#torrent-data tr').length === 1){
    loadIcon();
  }
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
    // TODO: make reusable function for cancel/save
    const td = document.createElement('td');
    const div = document.createElement('div');
    const p = document.createElement('p');
    if (i == 2){
      p.textContent = `${torrentValues[i]}MB`; // MB handling
    } else{
      p.textContent = torrentValues[i];
    }
    div.appendChild(p);
    // TODO: tooltip/clipboard if overflow
    const clipboard = document.createElement('button');
    clipboard.innerHTML = '&#128203;';
    clipboard.setAttribute('type', 'button');
    clipboard.addEventListener('click', copyContent);
    div.appendChild(clipboard);
    td.appendChild(div);
    td.setAttribute('title', p.textContent);
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
  if (userRow.classList.contains('edit-mode')){
    enableInputs(); // renable tfoot inputs if delete while in edit
    enableSorts(); // remove disabled attr
  }
  // remove sort icons if num rows fall below 2
  if (document.querySelectorAll('#torrent-data tr').length < 2){
    removeSorts();
  }
}


function removeSorts(){
  const ths = document.querySelectorAll('th');
  const sortBtns = document.querySelectorAll('th button');
  for (let i = 0; i < sortBtns.length; ++i){
    ths[i].removeChild(sortBtns[i]);
  }
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
        // exclude button text
        if (x.textContent.slice(0, -1).toLowerCase() > y.textContent.slice(0, -1).toLowerCase()){
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
        // exclude button text
        if (Number(x.textContent.slice(0, -4)) > Number(y.textContent.slice(0, -4))){
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
        // exclude button text
        if (Number(x.textContent.slice(0, -2)) > Number(y.textContent.slice(0, -2))){
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
        // exclude button text
        if (x.textContent.slice(0, -2).toLowerCase() < y.textContent.slice(0, -2).toLowerCase()){
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
        // exclude button text
        if (Number(x.textContent.slice(0, -4)) < Number(y.textContent.slice(0, -4))){
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
        // exclude button text
        if (Number(x.textContent.slice(0, -2)) < Number(y.textContent.slice(0, -2))){
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


function disableSorts(){
  const sortBtns = document.querySelectorAll('th button');
  for (let i = 0; i < sortBtns.length; ++i){
    sortBtns[i].setAttribute('disabled', '');
  }
}


function enableSorts(){
  const sortBtns = document.querySelectorAll('th button');
  for (let i = 0; i < sortBtns.length; ++i){
    sortBtns[i].removeAttribute('disabled');
  }
}


function enableEdit(e){
  // cancel previous edit mode if exists
  if (document.getElementsByClassName('edit-mode')[0] !== undefined){
    const editRow = document.getElementsByClassName('edit-mode')[0];
    //TODO: call special cancel function that doesn't re-enable sorts
    editRow.childNodes[editRow.childElementCount-1].firstElementChild.click();
  }
  disableSorts(); // AFTER cancelEdit re-enables
  // store values of the row that clicked edit
  const initialInputs = e.target.parentNode.parentNode;
  const row = document.createElement('tr');
  const id = initialInputs.id;
  row.id = id;
  for (let i = 0; i < initialInputs.childElementCount; ++i){
    const temp = document.createElement('td');
    temp.innerHTML = initialInputs.children[i].innerHTML; // maybe textContent until last td?
    temp.setAttribute('title', temp.textContent.slice(0, -2)); // maintain tooltip without button text
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
    if (i ==  2){ // size column
      inputEle.value = inputVal.slice(0, -4); // exclude button text
    } else{
      inputEle.value = inputVal.slice(0, -2); // exclude button text
    }
    const divEle = document.createElement('div');
    const pEle = document.createElement('p');
    const tdEle = document.createElement('td');
    pEle.appendChild(inputEle);
    divEle.appendChild(pEle);
    tdEle.appendChild(divEle);

    e.target.parentNode.parentNode.children[i].replaceWith(tdEle);
  }
}


function checkNumInputs(){
  // exclude tfoot input to avoid empty fields misfire
  const numInputs = document.querySelectorAll('tbody input[type="number"]');
  // strip leading zeros but leave 1 if all zeros
  for (let i = 0; i < numInputs.length; ++i){  
    if (numInputs[i].value.replace(/^0+/, '') === ''){
      numInputs[i].value = 0;
    } else {
      numInputs[i].value = numInputs[i].value.replace(/^0+/, '');
    }
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
  // re-enable sort
  enableSorts();
}


function saveEdit(e){
  e.target.setAttribute('type','submit'); // remap save to submit
}

/* Operators */

document.getElementById('torrent-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  checkNumInputs();
  // append if add-btn
  if (e.submitter.id === 'add-btn'){
    populateTable(getFormInput('torrent-input input'));
    document.getElementById('clear-btn').click(); // clear inputs
  } else { // construct and replace row if save-btn
    const finalInputs = document.getElementById(e.submitter.id).parentNode.parentNode;
    const row = document.createElement('tr');
    const id = finalInputs.id;
    row.id = id;

    for (let i = 0; i < finalInputs.childElementCount-1; ++i){
      const td = document.createElement('td');
      const div = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = finalInputs.children[i].children[0].children[0].children[0].value;
      if (i == 2){
        p.textContent += 'MB';
      }
      div.appendChild(p);
      const clipboard = document.createElement('button');
      clipboard.innerHTML = '&#128203;';
      clipboard.setAttribute('type','button');
      div.appendChild(clipboard);
      td.appendChild(div);
      td.setAttribute('title', p.textContent);
      row.appendChild(td);
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
    finalInputs.replaceWith(row);
    // re-enable tfoot inputs
    enableInputs();
    // re-enable sorts
    enableSorts();
  }
});


document.getElementById('theme-btn').addEventListener('click', toggleTheme);
document.getElementById('json-test').addEventListener('click', populateRandom); // add 10 rows
