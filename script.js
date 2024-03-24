const apiKey = '0ff106280b544f1e85c8824e6c53d9ff'; // Replace with your News API key
const newsContainer = document.getElementById('news-container');
const loadingIndicator = document.getElementById('loading-indicator'); // Assuming you have this element in your HTML
const updateInterval = 2 * 60 * 60 * 1000; // 1 hour in milliseconds

let currentNews = [];

const getNews = async () => {
  try {
    loadingIndicator.style.display = 'block'; // Show loading indicator

    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`, {
      timeout: 10000, // Set a 10-second timeout
    });

    if (!response.ok) {
      throw new Error('Error fetching news articles'); // Handle non-200 status codes
    }
    currentNews = await response.json().slice(0, 30); // Get first 30 articles
    displayNews();
  } catch (error) {
    console.error('Error fetching news:', error);
    setTimeout(() => {
      loadingIndicator.style.display = 'none'; // Hide loading indicator after timeout
      showError('You seem to be disconnected. Retry');
    }, 10000); // Wait 10 seconds before showing error
  } finally {
    loadingIndicator.style.display = 'none'; // Ensure hiding indicator even on successful fetch
  }
};

const displayNews = () => {
  newsContainer.innerHTML = '';
  if (currentNews.length > 0) {
    // Display news articles if data is available
    currentNews.forEach((article) => {
      const newsItem = document.createElement('div');
      newsItem.classList.add('news-item');
      newsItem.innerHTML = `
        <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News article image">
        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
        <p>${article.description}</p>
      `;
      newsContainer.appendChild(newsItem);
    });
  } else {
    // Display a message if no news available (initial load or error)
    showError('No news available yet. Please try again later.');
  }
};

const showError = (message) => {
  newsContainer.innerHTML = `<p class="error-message">${message}</p>`;
};

const showNotification = async () => {
  if (Notification.permission === 'granted') {
    const latestArticle = currentNews[0]; // Get the first (latest) article
    const notification = new Notification(`${latestArticle.title} - See what's new!`);
  } else if (Notification.permission !== 'denied') {
    // Request permission if not already granted or denied
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotification(); // Call again if permission is granted
      }
    });
  }
};

// Initial news fetch
getNews();

// Update news and show notification every hour
setInterval(() => {
  getNews();
}, updateInterval);
