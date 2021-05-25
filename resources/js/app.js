const commodityNames = [
  "Alexandrite",
  "Bauxite",
  "Benitoite",
  "Bertrandite",
  "Bromellite",
  "Coltan",
  "Cryolite",
  "Gallite",
  "Goslarite",
  "Grandidierite",
  "Indite",
  "Jadeite",
  "Lepidolite",
  "Lithium Hydroxide",
  "Low Temperature Diamonds",
  "Methane Clathrate",
  "Methanol Monohydrate Crystals",
  "Moissanite",
  "Monazite",
  "Musgravite",
  "Painite",
  "Pyrophyllite",
  "Rhodplumsite",
  "Rutile",
  "Serendibite",
  "Taaffeite",
  "Uraninite",
  "Void Opal",
];

$('#calculator').on('submit', e => {
  e.preventDefault();

  let wingMembers = {};

  for (const el of document.querySelectorAll('#wing-members > div')) {
    let name = el.querySelector('[name="player-name"]').value;
    let cargoCapacity = el.querySelector('[name="cargo-capacity"]').value;

    if (name && cargoCapacity) {
      wingMembers[name] = {cargoCapacity: parseInt(cargoCapacity) || 0, cargo: {}}
    }
  }

  let commodities = {};
  for (const el of document.querySelectorAll('#commodities > div')) {
    let name = el.querySelector('[name="commodity-name"]').value;
    let delivered = parseInt(el.querySelector('[name="commodity-delivered"]').value) || 0;
    let total = parseInt(el.querySelector('[name="commodity-total"]').value) || 0;
    let count = total - delivered;

    if (name in commodities) {
      commodities[name] += count;
    } else {
      commodities[name] = count;
    }
  }

  let wingMemberKeys = Object.keys(wingMembers).sort((a, b) => (wingMembers[a].cargoCapacity > wingMembers[b].cargoCapacity) ? 1 : -1);

  for (const [i, wingMemberKey] of wingMemberKeys.entries()) {
    let wingMember = wingMembers[wingMemberKey];

    for (const [commodity, commodityCount] of Object.entries(commodities)) {
      let cargoUsed = Object.values(wingMember.cargo).reduce((t, n) => t + n, 0);
      let cargoSpace = wingMember.cargoCapacity - cargoUsed;

      let add = Math.min(cargoSpace, Math.floor(commodityCount / (Object.keys(wingMembers).length - i)));
      wingMember.cargo[commodity] = add;
      commodities[commodity] = commodityCount - add;
    }
  }

  // Output
  let output = $('output');
  let outputHead = $('#output > thead');
  let outputBody = $('#output > tbody');

  // Header
  let newRow = $('<tr>');
  let cols = '<th></th>';

  for (const commodity of Object.keys(commodities)) {
    cols += `<th scope="col">${commodity}</th>`;
  }

  newRow.append(cols);
  outputHead.empty();
  outputHead.append(newRow);

  // Rows
  outputBody.empty();

  for (const [wingMemberName, wingMember] of Object.entries(wingMembers)) {
    let newRow = $('<tr>');
    let cols = `<th scope="row">${wingMemberName}</th>`;

    for (const count of Object.values(wingMember.cargo)) {
      cols += `<td>${count}</td>`;
    }

    newRow.append(cols);
    outputBody.append(newRow);
  }
});

$("#add-commodity").on('click', e => {
  let list = '';
  for (const name of commodityNames) {
    list += `<option>${name}</option>`;
  }

  $('#commodities').append(`
    <div class="input-group mb-3">
      <select class="custom-select" data-live-search="true" name="commodity-name">
        ${list}
      </select>

      <input type="text" name="commodity-delivered" class="form-control" placeholder="Delivered">
      <input type="text" name="commodity-total" class="form-control" placeholder="Total" value="0">

      <div class="input-group-append">
        <button type="button" name="commodity-delete" class="btn btn-danger">Delete</button>
      </div>
    </div>
  `);
});

$(document).on('click', '[name="commodity-delete"]', function(e) {
  $(this).closest('.input-group').remove();
});
