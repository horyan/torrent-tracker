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
  
  newTds[newTds.length-1].addEventListener('mouseenter', hoverEditOn); // listen for mouseenter on last td
  
  const torrentRow = document.getElementById('torrent-row');
  torrentRow.parentNode.insertBefore(newTr, torrentRow); // insert new row before torrentRow
  
  // fix invalidation styling in this scenario
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  for (let i = 0; i < torrentNames.length; i++) {
    torrentForm[torrentNames[i]].value = ''; // clear input text fields
  }
}


function deleteRow(e) {
  const userRow = e.parentElement.parentElement; // TODO: specify unique button id attr
  userRow.remove(userRow);
}


function toggleSort(e) {
  if (e.target.innerHTML === '\u25b7' /*'▷'*/) {
    e.target.innerHTML = '&#9651';
  } else if (e.innerHTML === '\u25b3' /*'△'*/) {
    e.target.innerHTML = '&#9661';
  } else {
    e.target.innerHTML = '&#9655';
  }
}


function hoverEditOn(e) {
  e.target.firstElementChild.textContent = 'Save'; // remap edit to save

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button')
  cancel.innerHTML = 'Cancel';

  e.target.insertBefore(cancel, e.target.firstElementChild); // add cancel button before save button
  e.target.addEventListener('mouseleave', hoverEditOff);
}


function hoverEditOff(e) {
  e.target.removeChild(e.target.firstElementChild); // remove exposed cancel button
  e.target.firstElementChild.textContent = 'Edit'; // remap save to edit
}


/* Operators */

// onclick: toggle color theme
document.getElementById('btn-theme').onclick = () => {
  document.body.classList.toggle('dark') === true ? this.textContent = 'Light Mode' : this.textContent = 'Dark Mode';
};


// onclick: toggle column sort |TODO: add asc/desc sort logic
const sortButtons = ['btn-name', 'btn-uri', 'btn-size', 'btn-seeders', 'btn-leechers'];
for (let i = 0; i < sortButtons.length; i++) {
  document.getElementById(sortButtons[i]).addEventListener('click', toggleSort);
}


// onsubmit: add-button fires addNewRow() and don't send form anywhere
document.getElementById('torrent-form').onsubmit = () => { addNewRow(); return false; };


// onclick: remove non-empty input fields |TODO: fix invalidation styling in this scenario
document.getElementById('btn-clear').onclick = () => {
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  const torrentForm = document.forms['torrent-form'];

  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value !== '') torrentForm[torrentNames[i]].value = '';
  }
};


// onclick: add 5 new test rows to table (for testing)
document.getElementById('add5').onclick = () => {
  const torrentForm = document.forms['torrent-form'];
  const numNewRows = 5;
  
  for (let i = 0; i < numNewRows; i++) {
    torrentForm['name'].value='1';
    torrentForm['uri'].value='1';
    torrentForm['size'].value='1';
    torrentForm['seeders'].value='1';
    torrentForm['leechers'].value='1';
    addNewRow();
  }
};


// TODO: clipboard copy name/uri data cell on dblclick event
