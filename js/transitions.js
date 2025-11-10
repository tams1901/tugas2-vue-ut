// Smooth page transitions and dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body for fade-in effect
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);

    // Handle navigation clicks for smooth transitions
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Add fade-out class for smooth exit
            document.body.classList.add('fade-out');

            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 300); // Match transition duration
        });
    });



    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        } else {
            darkModeToggle.textContent = '🌙';
        }

        // Toggle dark mode on button click
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            darkModeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        });
    }
});
