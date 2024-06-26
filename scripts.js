document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authLink = document.getElementById('auth');
    const newsContainer = document.getElementById('news-container');
    const weatherContainer = document.getElementById('weather-container');
    const galleryContainer = document.getElementById('gallery-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    let currentPage = 1;

    const fetchNews = async () => {
        const apiKey = 'YOUR_NEWSAPI_KEY';
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const data = await response.json();
        newsContainer.innerHTML = '';
        data.articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.innerHTML = `
                <img src="${article.urlToImage}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <p>${new Date(article.publishedAt).toLocaleDateString()}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(articleDiv);
        });
    };

    const fetchWeather = async () => {
        const apiKey = 'YOUR_WEATHERAPI_KEY';
        const city = 'Kyiv';
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`);
        const data = await response.json();
        weatherContainer.innerHTML = '';
        data.forecast.forecastday.forEach(day => {
            const weatherDiv = document.createElement('div');
            weatherDiv.innerHTML = `
                <h3>${new Date(day.date).toLocaleDateString()}</h3>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p>Temperature: ${day.day.avgtemp_c}°C</p>
                <p>Pressure: ${day.day.avghumidity} mmHg</p>
                <p>Wind: ${day.day.maxwind_kph} kph</p>
                <p>Precipitation: ${day.day.totalprecip_mm} mm</p>
            `;
            weatherContainer.appendChild(weatherDiv);
        });
    };

    const fetchGallery = async (page) => {
        const apiKey = 'YOUR_PEXELSAPI_KEY';
        const response = await fetch(`https://api.pexels.com/v1/curated?page=${page}&per_page=10`, {
            headers: {
                Authorization: apiKey
            }
        });
        const data = await response.json();
        galleryContainer.innerHTML = '';
        data.photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.src.small;
            galleryContainer.appendChild(img);
        });
    
    };

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchGallery(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        fetchGallery(currentPage);
    });

    if (newsContainer) fetchNews();
    if (weatherContainer) fetchWeather();
    if (galleryContainer) fetchGallery(currentPage);

    const handleAuth = () => {
        if (localStorage.getItem('loggedIn') || sessionStorage.getItem('loggedIn')) {
            authLink.innerHTML = '<a href="#" id="logout">Logout</a>';
        } else {
            authLink.innerHTML = '<a href="login.html">Login</a>';
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target.id === 'logout') {
            e.preventDefault();
            localStorage.removeItem('loggedIn');
            sessionStorage.removeItem('loggedIn');
            handleAuth();
            window.location.href = 'login.html';
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            const rememberMe = loginForm['remember-me'].checked;

            if (username === 'user' && password === 'password') {
                if (rememberMe) {
                    localStorage.setItem('loggedIn', 'true');
                } else {
                    sessionStorage.setItem('loggedIn', 'true');
                }
                handleAuth();
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = registerForm['new-username'].value;
            const password = registerForm['new-password'].value;
            const confirmPassword = registerForm['confirm-password'].value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Registration logic here (e.g., save user to database)
            alert('Registration successful');
            window.location.href = 'login.html';
        });
    }

    handleAuth();
});
