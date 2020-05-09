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


function populateTable(torrents){
  const tableBody = document.getElementById('torrent-data');
  let i = 0, j = document.getElementsByTagName('tr').length-1; // existing rows in tbody
  for (i, j; i < torrents.length; ++i, ++j){
    tableBody.appendChild(constructRowTemplate(torrents[i], j)); // insert row
  }
}


function constructRowTemplate(torrent, index){
  const tr = document.createElement('tr');
  tr.setAttribute('id', `row-${index}`);

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
  const userRow = e.target.parentElement.parentElement; // TODO: target matching row-id in the future
  userRow.remove(userRow);
}


function toggleSort(e){
  if (e.target.innerHTML === '\u00AB'){
    e.target.innerHTML = '&and;';
  } else if (e.target.innerHTML === '\u2227'){
    e.target.innerHTML = '&or;';
  } else{
    e.target.innerHTML = '&laquo;';
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

  // pass original row (AFTER if-cancel is clicked, BEFORE populating cancel so it has data)
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
  const initialRow = document.querySelector(`#${id}`);
  initialRow.classList.remove('edit-mode');

  // re-add edit listener
  torrentArchive.children[torrentArchive.children.length-1].firstElementChild.addEventListener('click', enableEdit);
  // NOT SURE WHY WE HAVE TO RE-ADD HANDLER FOR THIS
  torrentArchive.children[torrentArchive.children.length-1].lastElementChild.addEventListener('click', deleteRow);
  initialRow.replaceWith(torrentArchive);
}


function saveEdit(e){ // reduce duplicate code between delete, cancel functions
  // replace row using final inputs (modify existing row instead later)
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
  console.log({row});
  finalInputs.replaceWith(row);
  
  // TODO: eventually make cancelEdit() modular (separate enableEdit chunk for allowSingleEdit)
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


// sort table |TODO 1: add asc/desc sort logic
const sortButtons = ['name-sort', 'uri-sort', 'size-sort', 'seeders-sort', 'leechers-sort'];
for (let i = 0; i < sortButtons.length; ++i){
  document.getElementById(sortButtons[i]).addEventListener('click', toggleSort);
}


// TEST FEATURE: add 10 rows from sample JSON
document.getElementById('json-test').addEventListener('click', () =>{
  const dynamicTorrents = [];
  let i =  0, j = document.getElementsByTagName('tr').length-1; // existing rows in tbody

  for (i, j; i < 10; ++i, ++j){
    const temp = {
                  name: `torrent-${j}`,
                  uri: `example-${j}.torrents.com`,
                  size: `${j} GiB`,
                  seeders: `${j}`,
                  leechers: `${j}`
    };
    dynamicTorrents.push(temp);
  }

  populateTable(dynamicTorrents);
});
