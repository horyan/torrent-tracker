//const unsortedRows = [];
loadSortIcons();

/* Declarations */

function getFormInput(selector){
  const torrentInputs = document.querySelectorAll(`${selector}`);
  const torrent = [{}];

  torrent[0].name = torrentInputs[0].value;
  torrent[0].uri = torrentInputs[1].value;
  torrent[0].size = torrentInputs[2].value;
  torrent[0].seeders = torrentInputs[3].value;
  torrent[0].leechers = torrentInputs[4].value;

  return torrent;
}


function loadSortIcons(){
  // add event handlers to sort buttons
  const sortButtons = ['name-sort', 'uri-sort', 'size-sort', 'seeders-sort', 'leechers-sort'];
  for (let i = 0; i < sortButtons.length; ++i){
    document.getElementById(sortButtons[i]).addEventListener('click', (e) =>{
      if (e.target.innerHTML === '\u00AB'){
        e.target.innerHTML = '&and;';
        sortAsc(e);
      } else if (e.target.innerHTML === '\u2227'){
        e.target.innerHTML = '&or;';
        sortDesc(e);
      } else{
        e.target.innerHTML = '&laquo;';
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
    //unsortedRows.push(row);
    tableBody.appendChild(row); // insert row
  }
}


function constructRowTemplate(torrent, index){
  const tr = document.createElement('tr');
  tr.setAttribute('id', `${index}`);

  // convert into array of torrent's values (iterable, has length)
  const torrentValues = Object.values(torrent);
  for (let i = 0; i < torrentValues.length; ++i){
    const td = document.createElement('td');
    td.textContent = torrentValues[i];
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
}


function sortInitial(){
  // re-order by numerical row id
  // w3 example as starting point
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  while (switching) {
    switching = false;
    rows = document.getElementById('torrent-data').children;
    for (i = 0; i < rows.length-1; ++i){
      shouldSwitch = false;
      x = rows[i].getAttribute('id');
      y = rows[i+1].getAttribute('id');
      if (Number(x) > Number(y)){
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
}


function sortDesc(e){
  const col = e.target.parentNode.cellIndex;
  // w3 example as starting point
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
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
  const id = initialInputs.getAttribute('id');
  row.setAttribute('id', id);
  for (let i = 0; i < initialInputs.childElementCount; ++i){
    const temp = document.createElement('td');
    temp.innerHTML = initialInputs.children[i].innerHTML; // maybe textContent until last td?
    row.appendChild(temp);
  }

  e.target.parentNode.parentNode.classList.add('edit-mode'); // set indicator
  e.target.textContent = 'Save'; // remap edit to save
  e.target.removeEventListener('click', enableEdit);

  e.target.addEventListener('click', saveEdit);

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button');

  // pass original row BEFORE populating cancel so it has data
  cancel.addEventListener('click', ()=>{cancelEdit(row);});
  cancel.textContent = 'Cancel';
  
  e.target.parentNode.insertBefore(cancel, e.target); // insert cancel before save button
  
  // transform row tds into inputs
  for (let i = 0; i < 5; ++i){
    const inputVal = e.target.parentNode.parentNode.children[i].textContent;
    const inputEle = document.createElement('input');
    inputEle.setAttribute('value', inputVal);
    const tdEle = document.createElement('td');
    tdEle.appendChild(inputEle);
    e.target.parentNode.parentNode.children[i].replaceWith(tdEle);
  }
}


function cancelEdit(torrentArchive){
  // prepare replacement row
  const id = torrentArchive.getAttribute('id');
  const initialRow = document.getElementById(id);
  initialRow.classList.remove('edit-mode');

  // re-add edit listener
  torrentArchive.children[torrentArchive.children.length-1].firstElementChild.addEventListener('click', enableEdit);
  // breaks without re-add (why?)
  torrentArchive.children[torrentArchive.children.length-1].lastElementChild.addEventListener('click', deleteRow);
  initialRow.replaceWith(torrentArchive);
}


function saveEdit(e){ // reduce duplicate code between delete, cancel functions
  // should refactor to modify existing row instead
  const finalInputs = e.target.parentNode.parentNode;
  const row = document.createElement('tr');
  const id = finalInputs.getAttribute('id');
  row.setAttribute('id', id);

  for (let i = 0; i < finalInputs.childElementCount-1; ++i){
    const temp = document.createElement('td');
    temp.textContent = finalInputs.children[i].children[0].value;
    row.appendChild(temp);
  }

  // make buttons
  const options = document.createElement('td');
  // options.innerHTML = finalInputs.children[5].children[0].innerHTML; // Cancel text stored
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
  
  // refactor and use cancelEdit(), enableEdit > allowSingleEdit
}

/* Operators */

// add new row
document.getElementById('torrent-form').addEventListener('submit', (e) =>{
  e.preventDefault();

  populateTable(getFormInput('#torrent-input input'));

  document.getElementById('clear-btn').click(); // clear inputs
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
  const dynamicTorrents = [];
  let i =  0, j = document.getElementsByTagName('tr').length-1; // existing rows in tbody

  for (i, j; i < 10; ++i, ++j){
    const temp = {
                  name: `torrent-${Math.floor(Math.random()*10)}`,
                  uri: `example-${Math.floor(Math.random()*10)}.torrents.com`,
                  size: `${Math.floor(Math.random()*10)} GiB`,
                  seeders: `${Math.floor(Math.random()*10)}`,
                  leechers: `${Math.floor(Math.random()*10)}`
    };
    dynamicTorrents.push(temp);
  }

  populateTable(dynamicTorrents);
});
