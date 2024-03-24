const apiKey = '0ff106280b544f1e85c8824e6c53d9ff'; // Replace with your News API key
const newsContainer = document.getElementById('news-container');
const updateInterval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

let currentNews = [];

const getNews = async () => {
  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Error fetching news articles'); // Handle non-200 status codes
    }
    currentNews = data.articles.slice(0, 30); // Get first 30 articles
    displayNews();
  } catch (error) {
    console.error('Error fetching news:', error);
    showError('You seem to be disconnected. Retry'); // Display error message
  }
};

const displayNews = () => {
  newsContainer.innerHTML = ''; // Clear existing content
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
