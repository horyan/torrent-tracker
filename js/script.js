
let body;

document.addEventListener('DOMContentLoaded', function() {
    body = document.getElementById("torrent-table");
});


function addNewRow() {

  let newRow = document.createElement("tr");

  for (var i = 0; i < 5; i++) {
    var tempElement = document.createElement("td");
    tempElement.innerHTML = "blah";
    newRow.appendChild(tempElement);
  }

  body.appendChild(newRow);
}


