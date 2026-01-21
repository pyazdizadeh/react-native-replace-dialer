function chunkEntries(entries) {
  const rows = [];
  let index = 0;
  let rowSize = 1;
  while (index < entries.length) {
    rows.push(entries.slice(index, index + rowSize));
    index += rowSize;
    rowSize += 1;
  }
  return rows;
}

function ensureStyles(container) {
  if (container.querySelector(':scope > style[data-leaderboard-style]')) {
    return;
  }

  const style = document.createElement('style');
  style.setAttribute('data-leaderboard-style', 'true');
  style.textContent = `
    .leaderboard-widget {
      font-family: system-ui, -apple-system, sans-serif;
    }
    .leaderboard-widget .leaderboard-pyramid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    .leaderboard-widget .leaderboard-row {
      display: flex;
      gap: 12px;
      justify-content: center;
      width: 100%;
      flex-wrap: nowrap;
    }
    .leaderboard-widget .leaderboard-card {
      background: #101828;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 12px;
      min-width: 140px;
      text-align: center;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .leaderboard-widget .leaderboard-card.leader {
      padding: 20px 28px;
      min-width: 200px;
      font-size: 1.1rem;
      box-shadow: 0 0 24px rgba(124, 92, 255, 0.8), 0 12px 30px rgba(0, 0, 0, 0.35);
    }
  `;
  container.prepend(style);
}

function renderCard(entry, isLeader) {
  const card = document.createElement('div');
  card.className = `leaderboard-card${isLeader ? ' leader' : ''}`;
  card.innerHTML = `
    <div class="leaderboard-name">${entry.name}</div>
    <div class="leaderboard-score">${entry.score}</div>
  `;
  return card;
}

function renderPyramid(container, entries) {
  const pyramid = document.createElement('div');
  pyramid.className = 'leaderboard-pyramid';

  const rows = chunkEntries(entries);
  rows.forEach((rowEntries, rowIndex) => {
    const row = document.createElement('div');
    row.className = 'leaderboard-row';
    rowEntries.forEach((entry, entryIndex) => {
      const isLeader = rowIndex === 0 && entryIndex === 0;
      row.appendChild(renderCard(entry, isLeader));
    });
    pyramid.appendChild(row);
  });

  container.appendChild(pyramid);
}

function renderLeaderboard({ container, entries, designPreset = 'default' }) {
  if (!container) {
    throw new Error('container is required');
  }
  if (!Array.isArray(entries)) {
    throw new Error('entries must be an array');
  }

  container.classList.add('leaderboard-widget');
  container.innerHTML = '';
  ensureStyles(container);

  if (designPreset === 'pyramid') {
    renderPyramid(container, entries);
    return;
  }

  const list = document.createElement('div');
  entries.forEach((entry) => {
    list.appendChild(renderCard(entry, false));
  });
  container.appendChild(list);
}

module.exports = {
  renderLeaderboard,
};
