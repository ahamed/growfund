document.addEventListener('DOMContentLoaded', function () {
  // Initialize video functionality
  initVideoComponent();
});

function initVideoComponent() {
  // Find all video containers
  const videoContainers = document.querySelectorAll('[data-video-container]');

  videoContainers.forEach((container) => {
    const videoId = container.getAttribute('data-video-container');
    const video = document.getElementById(videoId);
    const playOverlay = document.querySelector(`[data-play-overlay="${videoId}"]`);

    if (!video || !container) return;

    // Handle play button click
    if (playOverlay) {
      playOverlay.addEventListener('click', function () {
        video.play();
      });
    }

    // Handle video events
    video.addEventListener('play', function () {
      if (playOverlay) {
        playOverlay.classList.add('hidden');
      }
      // Show controls when playing
      video.setAttribute('controls', 'controls');
    });

    video.addEventListener('pause', function () {
      if (playOverlay && video.currentTime === 0) {
        playOverlay.classList.remove('hidden');
      }
    });

    video.addEventListener('ended', function () {
      if (playOverlay) {
        playOverlay.classList.remove('hidden');
      }
    });

    // Handle video click to toggle play/pause
    video.addEventListener('click', function () {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
}
