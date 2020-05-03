/* Declarations */

function addNewRow() {
  let name, uri, size, seeders, leechers, options;
  const newTds = [name, uri, size, seeders, leechers, options]; 

  const torrentForm = document.forms['torrent-form'];
  const newTdContents = [torrentForm['name'].value, torrentForm['uri'].value, torrentForm['size'].value,
                        torrentForm['seeders'].value, torrentForm['leechers'].value,
                        '<button type="button">Edit</button>' +
                        '<button type="button" onclick="deleteRow(this)">Delete</button>']; // fix last item clutter

  const newTr = document.createElement('tr');
  newTr.className = 'user-row';

  for (let i = 0; i < newTds.length; i++) {
    newTds[i] = document.createElement('td'); // store input inside local td children of tr
    newTds[i].innerHTML = newTdContents[i]; // support HTML content
    newTr.appendChild(newTds[i]);
  }
  
  newTds[newTds.length-1].setAttribute('onmouseenter', 'hoverEditOn(this)'); // assign attr to last td
  
  const torrentRow = document.getElementById('torrent-row');
  torrentRow.parentNode.insertBefore(newTr, torrentRow); // insert new row before torrentRow
  
  //TODO: remove invalidation styles in this scenario
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
  if (e.innerHTML === '\u25b7' /*'▷'*/) {
    e.innerHTML = '&#9651';
  } else if (e.innerHTML === '\u25b3' /*'△'*/) {
    e.innerHTML = '&#9661';
  } else {
    e.innerHTML = '&#9655';
  }
}


function hoverEditOn(e) {
  e.firstElementChild.textContent = 'Save'; // remap edit to save

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button')
  cancel.innerHTML = 'Cancel';

  e.insertBefore(cancel, e.firstElementChild); // add cancel button before save button
  e.onmouseleave = function() {hoverEditOff(this);}; // similar issue with arrow conversion
}


function hoverEditOff(e) {
  e.removeChild(e.firstElementChild); // remove exposed cancel button
  e.firstElementChild.textContent = 'Edit'; // remap save to edit
}


/* Operators */

// onclick: toggle color theme
document.getElementById('btn-theme').onclick = () => {
  document.body.classList.toggle('dark') === true ? this.textContent = 'Light Mode' : this.textContent = 'Dark Mode';
};


// onsubmit: add-button fires addNewRow() and doesn't send form anywhere
document.getElementById('torrent-form').onsubmit = () => { addNewRow(); return false; };


// onclick: remove non-empty input fields
// TODO: remove invalidation style in this scenario
document.getElementById('btn-clear').onclick = () => {
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  const torrentForm = document.forms['torrent-form'];

  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value !== '') torrentForm[torrentNames[i]].value = '';
  }
};


// TODO: add asc/desc sort logic
// (e) => {toggleSort(this);}; syntax issue even if function parameter and 'this' argument are excluded
document.getElementById('btn-name').onclick = function() {toggleSort(this);}; // won't work with implicit this
document.getElementById('btn-uri').onclick = function() {toggleSort(this);};
document.getElementById('btn-size').onclick = function() {toggleSort(this);};
document.getElementById('btn-seeders').onclick = function() {toggleSort(this);};
document.getElementById('btn-leechers').onclick = function() {toggleSort(this);};


// onclick: add 5 new test rows to table (TESTING PURPOSES)
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
