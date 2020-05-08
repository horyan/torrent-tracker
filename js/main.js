/* Declarations */

function getFormInput(){
  const torrentInputs = document.querySelectorAll('#torrent-input input');
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
  editBtn.setAttribute('type', 'button'); // delete btn isn't firing the same submit issue?
  editBtn.addEventListener('click', enableEdit);
  deleteBtn.textContent = 'Delete';
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
  const row = e.target.parentNode.parentNode; // store row for cancel selection

  // popoulate/remap buttons
  e.target.textContent = 'Save'; // remap edit to save
  e.target.removeEventListener('click', enableEdit);
  // TODO 5: e.target.addEventListener('click', saveEdit); // inside saveEdit, remap save back to Edit

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button');
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', cancelEdit);

  e.target.parentNode.insertBefore(cancel, e.target); // insert cancel before save button
  
  // allow 1 row edit at a time, cancel any edits
  row.classList.toggle('edit-mode'); // no row is being editted (MOVE DOWN AFTER CANCEL-BTN TEST)
  if (document.getElementsByClassName('edit-mode').length > 0){
    const editRow = document.getElementsByClassName('edit-mode')[0];
    editRow.childNodes[editRow.childElementCount-1].firstElementChild.click();
  }

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


function cancelEdit(){
  // TODO 3: remove cancel button
  // strip edit-mode id
  // remap save textContent/event handler callback: Edit/disableEdit
  console.log('cancel clicked');
}


function saveEdit(){
// TODO 6: store input values into td.textContent
// strip edit-mode id
// remove input element
// cancelEdit()
}


/* Operators */

// add new row
document.getElementById('torrent-form').addEventListener('submit', (e) =>{
  e.preventDefault();

  populateTable(getFormInput());

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


// sort table |TODO: add asc/desc sort logic
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
