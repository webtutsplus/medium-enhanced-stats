const intervalId = setInterval(() => {
  const tfoot = document.querySelector('table tfoot');
  if (!tfoot) {
    init();
  }
}, 1000);
window.addEventListener('unload', () => clearInterval(intervalId));
init();


function init() {
  chrome.runtime.sendMessage({ type: 'GET_TOTALS'}, {}, data => {
    if (window.location.pathname.includes('responses')) {
      updateTable(data.responses);
    } else {
      updateTable(data.articles);
    }
  });
}

function updateTable(totals) {
  const table = document.querySelector('table');
  const { items, views, syndicatedViews, reads, fans, ratio } = totals;
  console.log(totals);
  let tfoot = table.querySelector('tfoot');
  if (!tfoot) {
    tfoot = document.createElement('tfoot');
    table.appendChild(tfoot);
  }
  tfoot.innerHTML = `
      <tr>
        <td title="Items count" class="articles-count">${formatValue(items)}</td>
        <td title="${formatWholeNumber(views)}">
          ${formatValue(views)}
          ${syndicatedViews ? `<span>+${formatValue(syndicatedViews)}</span>` : ''}
        </td>
        <td title="${formatWholeNumber(reads)}">${formatValue(reads)}</td>
        <td title="Weighted average">${ratio}%</td>
        <td title="${formatWholeNumber(fans)}">${formatValue(fans)}</td>
      </tr>
    `;
}

function formatValue(number) {
  return number >= 1000000
    ? (number / 1000000).toFixed(1) + 'M'
    :  number >= 1000
      ? (number / 1000).toFixed(1) + 'K'
      : number.toFixed(0);
}

function formatWholeNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
