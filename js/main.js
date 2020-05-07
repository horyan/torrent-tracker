/* Declarations */

function populateTable(torrents) {
  const tableBody = document.getElementById('torrent-data');
  let i = 0, j = document.getElementsByTagName('tr').length-1; // existing rows minus input row
  for (i, j; i < torrents.length; ++i, ++j){
    tableBody.appendChild(constructRowTemplate(torrents[i], j)); // insert row child
  }
}


function constructRowTemplate(torrent, index){
  const tr = document.createElement('tr');
  tr.setAttribute('id', `row-${index}`);

  // convert into array of object's values (iterable, has length)
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


function deleteRow(e) {
  const userRow = e.target.parentElement.parentElement; // TODO: target matching row-id in the future
  userRow.remove(userRow);
}


function toggleSort(e) {
  if (e.target.innerHTML === '\u00AB') {
    e.target.innerHTML = '&and;';
  } else if (e.target.innerHTML === '\u2227') {
    e.target.innerHTML = '&or;';
  } else {
    e.target.innerHTML = '&laquo;';
  }
}


function enableEdit(e) {
  // TODO: transform row tds into inputs
  //

  e.target.textContent = 'Save'; // remap edit to save
  e.target.removeEventListener('click', enableEdit);
  //e.target.addEventListener('click', saveEdit)

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button');
  cancel.textContent = 'Cancel';

  e.target.parentNode.insertBefore(cancel, e.target); // add cancel button before save button
  //e.target.addEventListener('click', disableEdit);
}


function cancelEdit(){
  // TODO: remove cancel button
  // remap save textContent/event handler callback: Edit/disableEdit
}


function saveEdit(){
// TODO: store input values into td.textContent
// remove input element
// cancelEdit()
}


function disableRowEdit(e) {
  e.target.removeChild(e.target.firstElementChild); // remove exposed cancel button
  e.target.firstElementChild.textContent = 'Edit'; // remap save to edit
}

/* Operators */

// onclick: toggle color theme
document.getElementById('theme-btn').addEventListener('click', () => {
  if (document.body.classList.toggle('dark') === true) {
    this.textContent = 'Light Mode';
  } else {
    this.textContent = 'Dark Mode';
  }
});


// onclick: toggle column sort |TODO: add asc/desc sort logic
const sortButtons = ['name-sort', 'uri-sort', 'size-sort', 'seeders-sort', 'leechers-sort'];
for (let i = 0; i < sortButtons.length; ++i) {
  document.getElementById(sortButtons[i]).addEventListener('click', toggleSort);
}


document.getElementById('json-test').addEventListener('click', () => {
  const dynamicTorrents = [];

  let i =  0, j = document.getElementsByTagName('tr').length-1; // existing rows minus input row
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


// onsubmit: add row from inputs
document.getElementById('torrent-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const torrentInputs = document.querySelectorAll('#torrent-input input');
  const torrent = [{name:'', uri:'', size:'', seeders:'', leechers:''}];

  torrent[0].name = torrentInputs[0].value;
  torrent[0].uri = torrentInputs[1].value;
  torrent[0].size = torrentInputs[2].value;
  torrent[0].seeders = torrentInputs[3].value;
  torrent[0].leechers = torrentInputs[4].value;

  populateTable(torrent);

  // clear inputs |TODO: hide invalidation style for this scenario
  for (let i = 0; i < torrentInputs.length; ++i){
    torrentInputs[i].value = '';
  }
});
