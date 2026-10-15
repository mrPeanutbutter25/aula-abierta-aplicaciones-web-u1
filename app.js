'use strict';

// Sin JavaScript la navegación y todos los talleres permanecen visibles.
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navegacion');
const mobileQuery = window.matchMedia('(max-width: 47.999rem)');

function setMenu(open) {
  const focusWasInside = navigation.contains(document.activeElement);
  navigation.hidden = mobileQuery.matches && !open;
  menuButton.setAttribute('aria-expanded', String(open));
  if (navigation.hidden && focusWasInside) menuButton.focus();
}

function syncMenu() {
  menuButton.hidden = !mobileQuery.matches;
  setMenu(!mobileQuery.matches);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobileQuery.matches) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileQuery.matches && !navigation.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
mobileQuery.addEventListener('change', syncMenu);
syncMenu();

const filters = document.querySelector('.filters');
const cards = [...document.querySelectorAll('.workshop-card')];
filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  let visible = 0;
  cards.forEach((card) => {
    card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) visible += 1;
  });
  filters.querySelectorAll('button').forEach((item) => {
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelector('#resultados').textContent = `${visible} ${visible === 1 ? 'taller disponible' : 'talleres disponibles'}`;
});

const form = document.querySelector('#interest-form');
const fields = [...form.querySelectorAll('input, select')];
const status = document.querySelector('#form-status');
// La validación nativa sigue disponible si JavaScript está desactivado.
form.noValidate = true;
form.querySelector('[type="submit"]').disabled = false;

function errorMessage(field) {
  if (!field.value.trim()) return 'Completa este campo.';
  if (field.id === 'nombre' && field.value.trim().length < 3) return 'Escribe al menos 3 caracteres.';
  if (field.validity.typeMismatch) return 'Escribe un correo válido, por ejemplo nombre@ejemplo.com.';
  if (field.validity.tooLong) return 'Reduce la longitud de este campo.';
  return '';
}

function validateField(field) {
  const message = errorMessage(field);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  document.querySelector(`#${field.id}-error`).textContent = message;
  return !message;
}

fields.forEach((field) => {
  field.addEventListener('input', () => {
    status.textContent = '';
    if (field.hasAttribute('aria-invalid')) validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = fields.filter((field) => !validateField(field));
  if (invalid.length) {
    status.textContent = `Revisa ${invalid.length === 1 ? 'el campo indicado' : `los ${invalid.length} campos indicados`}. No se ha enviado información.`;
    invalid[0].focus();
    return;
  }
  status.textContent = '¡Validación completada! Tu selección es válida. Esta es una demostración: no se enviaron ni guardaron datos y no se reservó un cupo.';
});

document.querySelectorAll('[data-workshop]').forEach((link) => {
  link.addEventListener('click', () => {
    const select = document.querySelector('#taller');
    select.value = link.dataset.workshop;
    if (select.hasAttribute('aria-invalid')) validateField(select);
    status.textContent = '';
  });
});
