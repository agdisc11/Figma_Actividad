// dev.bug — interacciones simples (sin librerías)

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Toast ----------
  const toast = $('.toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  // ---------- Menú lateral + overlay ----------
  const drawer = $('.drawer');
  const overlay = $('.overlay');
  const sheet = $('.sheet');

  function closeAll() {
    drawer && drawer.classList.remove('is-open');
    sheet && sheet.classList.remove('is-open');
    overlay && overlay.classList.remove('is-open');
    $$('[data-open-drawer]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  $$('[data-open-drawer]').forEach(btn => btn.addEventListener('click', () => {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    const first = $('a', drawer);
    first && first.focus();
  }));
  $$('[data-close]').forEach(btn => btn.addEventListener('click', closeAll));
  overlay && overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  // ---------- Pestañas de categorías (escritorio) ----------
  const tabs = $$('.tab');
  const stories = $$('.story');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    const cat = tab.dataset.filter;
    stories.forEach(s => { s.hidden = cat !== 'all' && s.dataset.cat !== cat; });
  }));

  // ---------- Acciones del bug (móvil) ----------
  const app = $('.app');
  const statusChip = $('[data-status-chip]');
  const solveBtn = $('[data-action="solve"]');
  if (solveBtn) {
    solveBtn.addEventListener('click', () => {
      const solved = !app.classList.contains('is-solved');
      app.classList.toggle('is-solved', solved);
      solveBtn.querySelector('span').textContent = solved ? 'Reopen' : 'Mark solved';
      solveBtn.classList.toggle('btn--primary', !solved);
      solveBtn.classList.toggle('btn--secondary', solved);
      if (statusChip) {
        statusChip.textContent = solved ? 'Solved' : statusChip.dataset.open;
        statusChip.className = 'chip ' + (solved ? 'chip--ok' : statusChip.dataset.openClass);
      }
      showToast(solved ? 'Bug #1042 marked as solved' : 'Bug #1042 reopened');
    });
  }

  const assignBtn = $('[data-action="assign"]');
  if (assignBtn && sheet) {
    assignBtn.addEventListener('click', () => {
      sheet.classList.add('is-open');
      overlay.classList.add('is-open');
      const first = $('button.person', sheet);
      first && first.focus();
    });
    $$('button.person', sheet).forEach(p => p.addEventListener('click', () => {
      const name = p.dataset.name;
      $$('[data-assignee]').forEach(el => { el.textContent = name; el.classList.remove('muted'); });
      closeAll();
      showToast('Assigned to ' + name);
      assignBtn.focus();
    }));
  }

  // ---------- Elementos aún no construidos ----------
  $$('[data-soon]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    showToast((el.dataset.soon || 'This section') + ' — coming soon');
  }));
})();
