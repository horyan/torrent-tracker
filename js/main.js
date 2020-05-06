/* Declarations */

function populateTable(torrents) {
  const tableBody = document.getElementById('torrent-tbody');
  for (let i = 0; i < torrents.length; ++i){
    tableBody.appendChild(constructRowTemplate(torrents[i], i)); // insert row child
  }
}

function constructRowTemplate(torrent, index){
  console.log(torrent);
  // torrent doesn't have a length to loop through
  const tr = document.createElement('tr');
  tr.setAttribute('id', `row-${index}`);

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

// TODO: transform row into inputs
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
for (let i = 0; i < sortButtons.length; i++) {
  document.getElementById(sortButtons[i]).addEventListener('click', toggleSort);
}

// onclick: remove non-empty input fields |TODO: fix invalidation styling in this scenario
document.getElementById('btn-clear').addEventListener('click', () => {
  const torrentNames = ['name', 'uri', 'size', 'seeders', 'leechers'];
  const torrentForm = document.forms['torrent-form'];

  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value !== '') torrentForm[torrentNames[i]].value = '';
  }
});

/*// onclick: mimic user and add test rows 
document.getElementById('user-test').addEventListener('click', () => {
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
});*/

document.getElementById('json-test').addEventListener('click', () => {
  /*const lazyTorrent = [
  {
    0: "",
    1: "",
    2: "",
    3: "",
    4: ""
  }
  ];
  const testTorrent = [
    {
      name: "test",
      uri: "test.test.com",
      size: 12345,
      seeders: 123,
      leechers:123
    }
  ];*/

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

// onsubmit: add row from JSON
document.getElementById('user-test').addEventListener('click', () => {
  const inputsArray = [];
  const inputs = document.querySelectorAll('#torrent-tr input');
  for (let i = 0; i < inputs.length; ++i){
    inputsArray.push(inputs[i].value);
  }
  const testTorrents = {...inputsArray};
  console.log(testTorrents);
  populateTable(testTorrents);
  /*const inputs = document.querySelectorAll('#torrent-tr input');
  const temp = {1:"", 2:"", 3:"", 4:"", 5:""};
  let i = 0;
  Object.keys(temp).forEach( (key)=> {temp[key] = inputs[i].value; i++;} );
  console.log(temp);
  populateTable(temp);*/
});

// TODO: consider using named functions with addEventListener
// TODO: clipboard copy name/uri data cell on dblclick event
