// Light/Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  
  // Reload particles with new theme colors
  loadParticles();
});

// Function to load particles with theme-appropriate colors
function loadParticles() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const container = document.getElementById('tsparticles');

  // If user prefers reduced motion, destroy particles and exit
  if (prefersReducedMotion) {
    tsParticles.dom().forEach(instance => instance.destroy());
    if (container) container.innerHTML = '';
    return;
  }

  const isDark = document.body.dataset.theme === 'dark';
  const particleColor = isDark ? '#ffffff' : '#2563eb';
  const linkColor = isDark ? '#ffffff' : '#3b82f6';
  
  tsParticles.load("tsparticles", {
    background: {
      color: "transparent"
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: true
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: particleColor },
      links: { 
        color: linkColor, 
        distance: 150, 
        enable: true, 
        opacity: 0.4, 
        width: 1 
      },
      move: { 
        enable: true, 
        speed: 1, 
        direction: "none", 
        random: false, 
        straight: false, 
        outModes: { default: "out" } 
      },
      number: { value: 40, density: { enable: true, area: 900 } },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } }
    },
    detectRetina: true
  });
}

// Smooth Scrolling (Bootstrap handles scroll-behavior in CSS)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Fade-in on Scroll
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Initialize particles on page load
loadParticles();

// Project Embed Modal Handler
document.addEventListener('DOMContentLoaded', function() {
  const embedModal = new bootstrap.Modal(document.getElementById('projectEmbedModal'));
  const embedContainer = document.getElementById('embedContainer');
  const modalTitle = document.getElementById('projectEmbedModalLabel');
  const modalDescription = document.getElementById('modalDescription');
  const modalDescriptionText = document.getElementById('modalDescriptionText');
  
  // Function to get YouTube embed URL
  function getYouTubeEmbedUrl(videoId) {
    const id = extractYouTubeVideoId(videoId);
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }
  
  // Function to get Google Drive embed URL
  function getGoogleDriveEmbedUrl(fileId, isVideo = false) {
    if (isVideo) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    // For images, documents, etc.
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  // Function to get website embed URL (direct)
  function getWebsiteEmbedUrl(url) {
    return url;
  }

  // Function to extract Google Drive file ID from URL
  function extractDriveFileId(url) {
    // Handle different Google Drive URL formats
    if (url.includes('/file/d/')) {
      return url.split('/file/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
      return url.split('id=')[1].split('&')[0];
    }
    return url; // Assume it's already just the file ID
  }
  
  // Function to extract YouTube video ID
  function extractYouTubeVideoId(videoId) {
    // Handle full YouTube URL or just video ID
    let id = videoId;
    if (videoId.includes('youtube.com/watch?v=')) {
      id = videoId.split('v=')[1].split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
      id = videoId.split('youtu.be/')[1].split('?')[0];
    }
    return id;
  }
  
  // Function to get YouTube thumbnail URL
  function getYouTubeThumbnailUrl(videoId) {
    const id = extractYouTubeVideoId(videoId);
    // Try maxresdefault first (highest quality), fallback to hqdefault
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  
  // Function to get Google Drive thumbnail URL
  function getGoogleDriveThumbnailUrl(fileId) {
    const id = extractDriveFileId(fileId);
    // For images: use thumbnail API with size parameter
    return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
  }
  
  // Function to load thumbnails for all project cards
  function loadProjectThumbnails() {
    document.querySelectorAll('.project-card[data-embed-type]').forEach(card => {
      const embedType = card.getAttribute('data-embed-type');
      const embedId = card.getAttribute('data-embed-id');
      const thumbnailId = card.getAttribute('data-thumbnail-id'); // Optional: separate thumbnail source
      const thumbnail = card.querySelector('.project-thumbnail');
      const placeholder = card.querySelector('.project-placeholder');
      
      // Check if there's a separate thumbnail ID (for Google Drive images)
      let thumbnailUrl = '';
      
      if (thumbnailId && thumbnailId !== '' && !thumbnailId.startsWith('YOUR_')) {
        // Use custom thumbnail from Google Drive
        thumbnailUrl = getGoogleDriveThumbnailUrl(thumbnailId);
      } else if (!embedId || 
          embedId === 'YOUR_YOUTUBE_VIDEO_ID' || 
          embedId === 'YOUR_GOOGLE_DRIVE_FILE_ID' ||
          embedId.startsWith('YOUR_VIDEO_ID')) {
        // Show placeholder if no valid embed ID
        if (placeholder) placeholder.style.display = 'flex';
        if (thumbnail) thumbnail.style.display = 'none';
        return;
      } else {
        // Use default thumbnail based on embed type
        if (embedType === 'youtube') {
          thumbnailUrl = getYouTubeThumbnailUrl(embedId);
        } else if (embedType === 'gdrive') {
          thumbnailUrl = getGoogleDriveThumbnailUrl(embedId);
        }
      }
      
      if (thumbnailUrl) {
        thumbnail.src = thumbnailUrl;
        thumbnail.onerror = function() {
          // If thumbnail fails to load, show placeholder
          this.style.display = 'none';
          if (placeholder) placeholder.style.display = 'flex';
        };
        thumbnail.onload = function() {
          // Hide placeholder when thumbnail loads successfully
          if (placeholder) placeholder.style.display = 'none';
          this.style.display = 'block';
        };
      }
    });
  }
  
  // Load thumbnails when page loads
  loadProjectThumbnails();
  
  // Handle project view button clicks
  document.querySelectorAll('.project-view-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const projectCard = this.closest('.project-card');
      const embedType = projectCard.getAttribute('data-embed-type');
      const embedId = projectCard.getAttribute('data-embed-id');
      const projectTitle = projectCard.querySelector('.project-content h4').textContent;
      const projectDescription = projectCard.querySelector('.project-content p');
      
      if (!embedType || !embedId || embedId === 'YOUR_YOUTUBE_VIDEO_ID' || embedId === 'YOUR_GOOGLE_DRIVE_FILE_ID') {
        alert('Please configure the embed ID for this project. Replace YOUR_YOUTUBE_VIDEO_ID or YOUR_GOOGLE_DRIVE_FILE_ID with your actual video/file ID.');
        return;
      }
      
      // Set modal title
      modalTitle.textContent = projectTitle;
      
      // Set modal description (full text)
      if (projectDescription && projectDescription.textContent.trim()) {
        modalDescriptionText.textContent = projectDescription.textContent.trim();
        modalDescription.style.display = 'block';
      } else {
        modalDescription.style.display = 'none';
      }
      
      // Clear previous embed
      embedContainer.innerHTML = '';
      
      // Create and insert embed based on type
      let embedUrl = '';
      let iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      
      if (embedType === 'youtube') {
        embedUrl = getYouTubeEmbedUrl(embedId);
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      } else if (embedType === 'gdrive') {
        const fileId = extractDriveFileId(embedId);
        embedUrl = getGoogleDriveEmbedUrl(fileId);
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('allow', 'autoplay');
      } else if (embedType === 'website') {
        embedUrl = getWebsiteEmbedUrl(embedId);
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('allow', 'fullscreen; clipboard-write');
      }
      
      embedContainer.appendChild(iframe);
      embedModal.show();
    });
  });
  
  // Clean up embed when modal is closed
  document.getElementById('projectEmbedModal').addEventListener('hidden.bs.modal', function() {
    embedContainer.innerHTML = '';
  });
});
