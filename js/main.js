// add user input into table
document.getElementById("torrent-form").onsubmit = function() {addRow(); return false;};
function addRow() {
  let name, uri, size, seeders, leechers, options;
  const tdElements = [name, uri, size, seeders, leechers, options]; 

  const torrentForm = document.forms["torrent-form"];
  const tdElementContents = [torrentForm["name"].value,
                        torrentForm["uri"].value,
                        torrentForm["size"].value,
                        torrentForm["seeders"].value,
                        torrentForm["leechers"].value,
                        '<button type="button" onclick="editRow(this)" onmouseover="revealOptions(this)">Edit</button><button type="button" onclick="deleteRow(this)">Delete</button>'];

  const trElement = document.createElement("tr");
  const trClass = document.createAttribute("class");
  trClass.value = "user-row";
  trElement.setAttributeNode(trClass);
  for (let i = 0; i < tdElements.length; i++) {
    tdElements[i] = document.createElement("td");
    tdElements[i].innerHTML = tdElementContents[i]; 
    trElement.appendChild(tdElements[i]);
  }
  // add onmouseover attribute to last td since no id for selecting
  const tdEventOver = document.createAttribute("onmouseover");
  tdEventOver.value = "revertOptions(this)";
  tdElements[5].setAttributeNode(tdEventOver);
  // insert row before inputs
  const torrentRow = document.getElementById("torrent-row");
  torrentRow.parentNode.insertBefore(trElement, torrentRow);

  // clear inputs after adding row (TODO: hide invalidation, preserve detection on user input/submit)
  const torrentNames = ["name", "uri", "size", "seeders", "leechers"];
  for (let i = 0; i < torrentNames.length; i++) {
    torrentForm[torrentNames[i]].value = "";
  }
}

// TODO
function editRow(e) {
}

// TODO: need a function for double mouse click to highlight/copy data (overflow is hidden)

// button element with btn-delete id should remove its ancestor row on user click
// TODO: how to separate from HTML and manipulate unrendered btn-delete element?
function deleteRow(e) {
  const userRow = e.parentElement.parentElement;
  userRow.remove(userRow);
}

// clear non-empty inputs (TODO: hide invalidation, preserve detection on user input/submit)
document.getElementById("btn-clear").onclick = function() {
  const torrentNames = ["name", "uri", "size", "seeders", "leechers"];
  const torrentForm = document.forms["torrent-form"];
  for (let i = 0; i < torrentNames.length; i++) {
    if (torrentForm[torrentNames[i]].value != "")
      torrentForm[torrentNames[i]].value = "";
  }
};

// toggle color theme (TODO: switch between 2 image indicators)
document.getElementById("btn-theme").onclick = function() {
  document.body.classList.toggle("dark") === true ? this.innerHTML = "Light Mode" : this.innerHTML = "Dark Mode";
}

// column sort indicator (TODO: add asc/desc logic)
document.getElementById("btn-name").onclick = function() {toggleSort(this)};
document.getElementById("btn-uri").onclick = function() {toggleSort(this)};
document.getElementById("btn-size").onclick = function() {toggleSort(this)};
document.getElementById("btn-seeders").onclick = function() {toggleSort(this)};
document.getElementById("btn-leechers").onclick = function() {toggleSort(this)};

function toggleSort(e) {
  if (e.innerHTML === "▷") {
    e.innerHTML = "&#9651";
  } else if (e.innerHTML === "△") {
    e.innerHTML = "&#9661";
  } else {
    e.innerHTML = "&#9655";
  }
}

// reveal edit options onmouseover
function revealOptions(e) {
  // create cancel button
  const cancel = document.createElement("button");
  const cancelType = document.createAttribute("type");
  cancelType.value = "button";
  cancel.setAttributeNode(cancelType);
  cancel.innerHTML = "Cancel";
  const cancelId = document.createAttribute("id");
  cancelId.value = "btn-cancel";
  cancel.setAttributeNode(cancelId);
  // create save button
  const save = document.createElement("button");
  const saveType = document.createAttribute("type");
  saveType.value = "button";
  save.setAttributeNode(saveType);
  save.innerHTML = "Save";
  const saveId = document.createAttribute("id");
  saveId.value = "btn-save";
  save.setAttributeNode(saveId);
  // add buttons before delete button
  e.parentNode.insertBefore(cancel, e.parentNode.childNodes[e.parentNode.childNodes.length-1]);
  e.parentNode.insertBefore(save, e.parentNode.childNodes[e.parentNode.childNodes.length-1]);
  e.remove(e);
}

// TODO: remove cancel and save buttons, re-add edit button
function revertOptions(e) {
  /* old code for revertOptions(e)
  const edit = document.createElement("button");
  const editType = document.createAttribute("type");
  editType.value = "button";
  edit.setAttributeNode(editType);
  edit.innerHTML = "Edit";
  const editEvent = document.createAttribute("onclick");
  editEvent.value = "editRow(this)";
  edit.setAttributeNode(editEvent);
  // add buttons before btn-delete
  e.insertBefore(edit, e.childNodes[e.childNodes.length-1]);
  // TODO: only remove btn-cancel and btn-save
  e.removeChild(e.childNodes[0]);
  e.removeChild(e.childNodes[0]);*/
}
