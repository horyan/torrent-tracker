/* Declarations */

function populateTable(torrents) {
  const tableBody = document.getElementById('torrent-tbody');
  for (let i = 0; i < torrents.length; ++i){
    tableBody.appendChild(constructRowTemplate(torrents[i], i)); // insert row child
  }
}

function constructRowTemplate(torrent, index){
  const tr = document.createElement('tr');
  tr.setAttribute('id', `row-${index}`); // TODO: fix index collision with next batch of rows

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
  editBtn.addEventListener('click', enableRowEdit);
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', deleteRow);
  
  tdOption.appendChild(editBtn);
  tdOption.appendChild(deleteBtn);
  tr.appendChild(tdOption);

  return tr;
}

function deleteRow(e) {
  const userRow = e.target.parentElement.parentElement;
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

// TODO: implement click listener: transform row tds into inputs, need cancel/save/delete buttons, 
function enableRowEdit(e) {
  e.target.firstElementChild.textContent = 'Save'; // remap edit to save

  const cancel = document.createElement('button');
  cancel.setAttribute('type', 'button');
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
for (let i = 0; i < sortButtons.length; ++i) {
  document.getElementById(sortButtons[i]).addEventListener('click', toggleSort);
}

// onclick: remove non-empty input fields |TODO: type="reset", fix invalidation styling in this scenario
document.getElementById('btn-clear').addEventListener('click', () => {
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  const torrentForm = document.forms['torrent-form'];

  for (let i = 0; i < torrentNames.length; ++i) {
    if (torrentForm[torrentNames[i]].value !== '') torrentForm[torrentNames[i]].value = '';
  }
});

document.getElementById('json-test').addEventListener('click', () => {
  const testTorrents = [
    {
      name: "test",
      uri: "test.test.com",
      size: 12345,
      seeders: 123,
      leechers: 123
    },
    {
      name: "test 1234",
      uri: "test.ioi.com",
      size: 1232,
      seeders: 23,
      leechers: 23
    }
  ];
  populateTable(testTorrents);
});

// onsubmit: add row from inputs
document.getElementById('torrent-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const torrentJson = [{name:'', uri:'', size:'', seeders:'', leechers:''}];
  const torrentInputs = document.querySelectorAll('#torrent-tr input');

  torrentJson[0].name = torrentInputs[0].value;
  torrentJson[0].uri = torrentInputs[1].value;
  torrentJson[0].size = torrentInputs[2].value;
  torrentJson[0].seeders = torrentInputs[3].value;
  torrentJson[0].leechers = torrentInputs[4].value;

  populateTable(torrentJson);
});

// TODO: consider using named functions with addEventListener
// TODO: clipboard copy name/uri data cell on dblclick event
