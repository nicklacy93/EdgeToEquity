(function () {
  try {
    const theme = localStorage.getItem('edgetoequity-theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.warn('⚠️ Theme preload failed:', e);
  }
})();
