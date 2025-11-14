/**
 * Header Component JavaScript
 * Handles mobile hamburger menu functionality
 */

class HeaderMenu {
  constructor() {
    this.hamburger = document.querySelector('.gf-hamburger');
    this.navActions = document.querySelector('.gf-header__nav-actions');
    this.body = document.body;
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    if (this.hamburger && this.navActions) {
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (
          this.isMenuOpen &&
          !this.hamburger.contains(e.target) &&
          !this.navActions.contains(e.target)
        ) {
          this.closeMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.closeMenu();
        }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && this.isMenuOpen) {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.hamburger.classList.add('gf-hamburger--active');
    this.navActions.classList.add('gf-header__nav-actions--open');
    this.body.classList.add('gf-menu-open');
    this.isMenuOpen = true;

    // Set focus to first menu item for accessibility
    const firstLink = this.navActions.querySelector('a, button');
    if (firstLink) {
      firstLink.focus();
    }
  }

  closeMenu() {
    this.hamburger.classList.remove('gf-hamburger--active');
    this.navActions.classList.remove('gf-header__nav-actions--open');
    this.body.classList.remove('gf-menu-open');
    this.isMenuOpen = false;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeaderMenu();
});
