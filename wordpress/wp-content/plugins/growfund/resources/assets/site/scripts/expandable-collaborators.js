document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gf-creator-card').forEach(function (card) {
    const summary = card.querySelector('.gf-creator-card-summary');
    const content = card.querySelector('.gf-creator-card__content');

    const toggleDown = card.querySelector('.gf-contributors-toggle-button-down');
    const toggleUp = card.querySelector('.gf-contributors-toggle-button-up');

    if (summary && content) {
      handleToggleUp();

      if (toggleDown) {
        toggleDown.addEventListener('click', handleToggleDown);
      }

      if (toggleUp) {
        toggleUp.addEventListener('click', handleToggleUp);
      }
    }

    function handleToggleUp() {
      content.classList.remove('active', 'hidden');
      content.classList.add('hidden');
      summary.style.display = 'flex';
    }

    function handleToggleDown() {
      summary.style.display = 'none';
      content.classList.remove('active', 'hidden');
      content.classList.add('active');
    }
  });
});
