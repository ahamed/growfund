/**
 * Receipt Modal JavaScript
 * Handles receipt modal functionality including opening/closing, form handling, and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.gf-modal');
  const closeButtons = document.querySelectorAll('.gf-modal-close');
  const overlays = document.querySelectorAll('.gf-modal .gf-modal__overlay');

  if (!modals) {
    return;
  }

  /**
   * Open the modal
   */
  function openModal(e) {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the modal
   */
  function closeModal(e) {
    e.target.closest('.gf-modal').classList.add('is-closing');

    setTimeout(() => {
      e.target.closest('.gf-modal').classList.remove('is-open', 'is-closing');
      document.body.style.overflow = '';
    }, 300);
  }

  if (closeButtons) {
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', closeModal);
    });
  }

  if (overlays) {
    overlays.forEach((overlay) => {
      overlay.addEventListener('click', closeModal);
    });
  }
});
