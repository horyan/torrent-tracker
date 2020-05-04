/* Declarations */

function addNewRow() {
  let name, uri, size, seeders, leechers, options;
  const newTds = [name, uri, size, seeders, leechers, options]; 

  const torrentForm = document.forms['torrent-form'];
  const newTdContents = [torrentForm['name'].value, torrentForm['uri'].value, torrentForm['size'].value,
                        torrentForm['seeders'].value, torrentForm['leechers'].value,
                        '<button type="button">Edit</button>' +
                        '<button type="button" onclick="deleteRow(this)">Delete</button>']; // TODO: fix HTML clutter

  const newTr = document.createElement('tr');
  newTr.className = 'user-row';

  for (let i = 0; i < newTds.length; i++) {
    newTds[i] = document.createElement('td'); // store input inside local td children of tr
    newTds[i].innerHTML = newTdContents[i]; // support HTML content
    newTr.appendChild(newTds[i]);
  }
  
  newTds[newTds.length-1].addEventListener('mouseenter', enableRowEdit); // TODO: map edit button click
  
  document.getElementById('torrent-tbody').appendChild(newTr);
  
  // fix invalidation styling in this scenario
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  for (let i = 0; i < torrentNames.length; i++) {
    torrentForm[torrentNames[i]].value = ''; // clear input text fields
  }
}


function deleteRow(e) {
  const userRow = e.parentElement.parentElement; // TODO: specify unique tr id attr
  userRow.remove(userRow);
}


function toggleSort(e) {
  if (e.target.innerHTML === '\u00AB') {
    console.log('enter if');
    e.target.innerHTML = '&and;';
  } else if (e.target.innerHTML === '\u2227') {
    console.log('enter else if');
    e.target.innerHTML = '&or;';
  } else {
    console.log('enter else');
    e.target.innerHTML = '&laquo;';
  }
}


// TODO: transform row into inputs
function enableRowEdit(e) {
  e.target.firstElementChild.textContent = 'Save'; // remap edit to save

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button')
  cancel.innerHTML = 'Cancel';

  e.target.insertBefore(cancel, e.target.firstElementChild); // add cancel button before save button
  e.target.addEventListener('mouseleave', disableRowEdit);
}


function disableRowEdit(e) {
  e.target.removeChild(e.target.firstElementChild); // remove exposed cancel button
  e.target.firstElementChild.textContent = 'Edit'; // remap save to edit
}


/* Operators */

// onclick: toggle color theme
document.getElementById('btn-theme').addEventListener('click', () => {
  if (document.body.classList.toggle('dark') === true) {
    this.textContent = 'Light Mode';
  } else {
    this.textContent = 'Dark Mode';
  }
});


// onclick: toggle column sort |TODO: add asc/desc sort logic
const sortButtons = ['btn-name', 'btn-uri', 'btn-size', 'btn-seeders', 'btn-leechers'];
for (let i = 0; i < sortButtons.length; i++) {
  document.getElementById(sortButtons[i]).addEventListener('click', toggleSort);
}


// onsubmit: add-button fires addNewRow() and don't send form anywhere
document.getElementById('torrent-form').addEventListener('submit', (e) => {
  e.preventDefault();
  addNewRow();
});


// onclick: remove non-empty input fields |TODO: fix invalidation styling in this scenario
document.getElementById('btn-clear').addEventListener('click', () => {
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  const torrentForm = document.forms['torrent-form'];

  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value !== '') torrentForm[torrentNames[i]].value = '';
  }
});


// onclick: mimic user and add test rows 
document.getElementById('test-add').addEventListener('click', () => {
  const torrentForm = document.forms['torrent-form'];
  const numNewRows = 10;
  
  for (let i = 0; i < numNewRows; i++) {
    torrentForm['name'].value = i;
    torrentForm['uri'].value = i;
    torrentForm['size'].value = i;
    torrentForm['seeders'].value = i;
    torrentForm['leechers'].value = i;
    document.getElementById('btn-submit').click();
  }
});


// TODO: consider using named functions with addEventListener
// TODO: clipboard copy name/uri data cell on dblclick event
