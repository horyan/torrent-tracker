// add 5 test rows to table
document.getElementById('add5').onclick = () => {
  const torrentForm = document.forms['torrent-form'];
  const numRows = 5;
  for (let i = 0; i < numRows; i++) {
    torrentForm['name'].value='1';
    torrentForm['uri'].value='1';
    torrentForm['size'].value='1';
    torrentForm['seeders'].value='1';
    torrentForm['leechers'].value='1';
    addRow();
  }
};

// store input inside local td children of tr, then insert row before torrentRow
document.getElementById('torrent-form').onsubmit = () => {addRow(); return false;}; // don't send form (avoid refresh)
function addRow() {
  let name, uri, size, seeders, leechers, options;
  const tdElements = [name, uri, size, seeders, leechers, options]; 

  const torrentForm = document.forms['torrent-form'];
  const tdElementContents = [torrentForm['name'].value,
                            torrentForm['uri'].value,
                            torrentForm['size'].value,
                            torrentForm['seeders'].value,
                            torrentForm['leechers'].value,
                            '<button type="button">Edit</button><button type="button" onclick="deleteRow(this)">Delete</button>'];

  const trElement = document.createElement('tr');
  trElement.className = 'user-row';
  for (let i = 0; i < tdElements.length; i++) {
    tdElements[i] = document.createElement('td');
    tdElements[i].innerHTML = tdElementContents[i]; // innerHTML property to support last td element's content
    trElement.appendChild(tdElements[i]);
  }
  // assign onmouseenter attribute to last td element
  tdElements[tdElements.length-1].setAttribute('onmouseenter', 'revealOptions(this)');
  // insert tr element before torrentRow
  const torrentRow = document.getElementById('torrent-row');
  torrentRow.parentNode.insertBefore(trElement, torrentRow);
  // clear input text fields after inserting input row |TODO: remove invalidation styles in this scenario
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  for (let i = 0; i < torrentNames.length; i++) {
    torrentForm[torrentNames[i]].value = '';
  }
}

// TODO: clipboard copy name/uri data cell on dblclick event

// remove row on delete button's onclick event |TODO: specify unique button id attr
function deleteRow(e) {
  const userRow = e.parentElement.parentElement;
  userRow.remove(userRow);
}

// remove non-empty input texts |TODO: remove invalidation style in this scenario
document.getElementById('btn-clear').onclick = () => {
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  const torrentForm = document.forms['torrent-form'];
  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value != '')
      torrentForm[torrentNames[i]].value = '';
  }
};

// toggle color theme
document.getElementById('btn-theme').onclick = () => {
  document.body.classList.toggle('dark') === true ? this.textContent = 'Light Mode' : this.textContent = 'Dark Mode';
};

// rotate column sort indicator |TODO: add asc/desc sort logic
// document.getElementById("btn-name").onclick = (e) => {toggleSort(this);}; // arrow syntax issue regardless of parameter/this argument exclusion
document.getElementById('btn-name').onclick = function() {toggleSort(this);}; // won't work with implicit this
document.getElementById('btn-uri').onclick = function() {toggleSort(this);};
document.getElementById('btn-size').onclick = function() {toggleSort(this);};
document.getElementById('btn-seeders').onclick = function() {toggleSort(this);};
document.getElementById('btn-leechers').onclick = function() {toggleSort(this);};

function toggleSort(e) {
  if (e.innerHTML === '\u25b7' /*'▷'*/) {
    e.innerHTML = '&#9651';
  } else if (e.innerHTML === '\u25b3' /*'△'*/) {
    e.innerHTML = '&#9661';
  } else {
    e.innerHTML = '&#9655';
  }
}

// reveal edit options in user row's last td element on onmouseenter event
function revealOptions(e) {
  e.firstElementChild.textContent = 'Save'; // remap edit button text render
  // create save button
  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button')
  cancel.innerHTML = 'Cancel';
  // add cancel button before save button
  e.insertBefore(cancel, e.firstElementChild);
  e.onmouseleave = function() {revertOptions(this);}; // similar issue with arrow conversion
}

// remove cancel button and remap save
function revertOptions(e) {
  e.removeChild(e.firstElementChild);
  e.firstElementChild.textContent = 'Edit';
}
