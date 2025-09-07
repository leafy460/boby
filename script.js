<script>
(function() {
  var popup = document.getElementById('popup');
  var popupMessage = document.getElementById('popup-message');
  var closeBtn = document.getElementById('popup-close');

  function openPopup(message) {
    popupMessage.textContent = message || "This game doesn't work right now.";
    popup.style.display = 'flex';
    popup.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }

  function closePopup() {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
  }

  // Close when clicking the overlay outside the box
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });

  // Close with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.style.display === 'flex') {
      closePopup();
    }
  });

  closeBtn.addEventListener('click', closePopup);

  // Attach to all .game-button anchors
  document.querySelectorAll('.game-button').forEach(function(button) {
    button.addEventListener('click', function(e) {
      var msg = button.getAttribute('data-message');
      if (msg) {
        // If data-message exists, prevent the link and show popup
        e.preventDefault();
        openPopup(msg);
      }
      // If no data-message, link works normally
    });
  });
})();
</script>
