document.addEventListener('DOMContentLoaded', () => {
  // Function to highlight active navigation link
  const highlightActiveNav = (currentPage) => {
    document.querySelectorAll('.main-nav ul li a').forEach(link => {
      link.classList.remove('active');
      // Check if the link's href matches the current page's filename
      const linkFilename = link.getAttribute('href').split('/').pop();
      if (linkFilename === currentPage) {
        link.classList.add('active');
      }
    });
  };

  // Get current page filename (e.g., "index.html", "work.html")
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if root

  // Call on load
  highlightActiveNav(currentPage);

  // Smooth scrolling for anchor links (if any, typically on index.html)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      const navHeight = document.querySelector('.main-nav').offsetHeight;

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - navHeight - 20, // Offset for sticky header and some padding
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -80px 0px' // Start observing slightly before element enters viewport
  });

  // Observe all sections for fade-in effect
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Simple contact form submission (for Formspree or similar)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Sending...';
      formStatus.className = ''; // Clear previous status classes

      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = 'Message sent successfully!';
          formStatus.classList.add('status-success');
          contactForm.reset();
        } else {
          const data = await response.json();
          if (Object.hasOwnProperty.call(data, 'errors')) {
            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
          } else {
            formStatus.textContent = 'Oops! There was a problem sending your message.';
          }
          formStatus.classList.add('status-error');
        }
      } catch (error) {
        formStatus.textContent = 'Oops! An error occurred. Please try again later.';
        formStatus.classList.add('status-error');
      }
    });
  }
});