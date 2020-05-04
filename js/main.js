/* Declarations */

var testTorrents = [
  {
    name: "test",
    uri: "test.test.com",
    size: 12345,
    seeders: 123,
    leechers: 123,
  },
  {
    name: "test 234",
    uri: "test.ioi.com",
    size: 1232,
    seeders: 23,
    leechers: 23
  }
]

function populateTable(testTorrents){

  const torrentBody = document.getElementById('torrent-body');

  for (var i = 0; i < testTorrents.length; ++i) {
    torrentBody.appendChild(constructRowTemplate(testTorrents[i], i)); // insert 
  }
}


function constructRowTemplate(torrent, index) {

  const newTr = document.createElement('tr');
  newTr.setAttribute("id", `row-${index}`)

  // Magic!
  let tdName = document.createElement('td');
  tdName.innerText = torrent.name;
  newTr.appendChild(tdName);

  let tdUri = document.createElement('td');
  tdUri.innerText = torrent.uri;
  newTr.appendChild(tdUri);

  let tdSize = document.createElement('td');
  tdSize.innerText = torrent.size;
  newTr.appendChild(tdSize);


  let tdSeeders = document.createElement('td');
  tdSeeders.innerText = torrent.seeders;
  newTr.appendChild(tdSeeders);

  let tdLeechers = document.createElement('td');
  tdLeechers.innerText = torrent.leechers;
  newTr.appendChild(tdLeechers);


  let tdOptions = document.createElement('td');
  tdOptions.setAttribute('class', 'options-hover')

  let optionsDefault = document.createElement('div');
  let editButton = document.createElement('button');
  editButton.innerText = "Edit"
  let deleteButton = document.createElement('button');  
  deleteButton.innerText = "Delete"

  let optionsHidden = document.createElement('div');
  optionsHidden.setAttribute('class', 'hidden')

  let cancelButton = document.createElement('button');
  cancelButton.innerText = "Cancel"
  let saveButton = document.createElement('button');
  saveButton.innerText = "Save"

  optionsDefault.appendChild(editButton);
  optionsDefault.appendChild(deleteButton);
  optionsHidden.appendChild(cancelButton);
  optionsHidden.appendChild(saveButton);
  
  tdOptions.appendChild(optionsDefault);
  tdOptions.appendChild(optionsHidden);

  newTr.appendChild(tdOptions);

  return newTr;
}




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
  const userRow = e.parentElement.parentElement; // TODO: specify unique tr id attr
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


// onclick: add 5 new test rows to table (for testing)
document.getElementById('add5').addEventListener('click', () => {
  const torrentForm = document.forms['torrent-form'];
  const numNewRows = 5;
  
  for (let i = 0; i < numNewRows; i++) {
    torrentForm['name'].value = i;
    torrentForm['uri'].value = i;
    torrentForm['size'].value = i;
    torrentForm['seeders'].value = i;
    torrentForm['leechers'].value = i;
    addNewRow();
  }
});

// TODO: consider using named functions with addEventListener
// TODO: clipboard copy name/uri data cell on dblclick event

