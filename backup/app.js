import { dataService } from './services/dataService.js';
import { authService } from './services/authService.js';

// DOM Elements
const dappsGrid = document.getElementById('dapps-grid');
const template = document.getElementById('dapp-card-template');
const networkSelect = document.querySelector('select[name="network"]');
const categorySelect = document.querySelector('select[name="category"]');
const sortSelect = document.querySelector('select[name="sortBy"]');
const searchInput = document.getElementById('search-input');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const userMenu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');
const favoritesBtn = document.getElementById('favorites-btn');

// State management
let currentFilters = {
    network: "",
    category: "",
    sortBy: "popular",
    searchQuery: "",
    showFavorites: false
};

// Event Listeners
networkSelect.addEventListener('change', handleFilterChange);
categorySelect.addEventListener('change', handleFilterChange);
sortSelect.addEventListener('change', handleFilterChange);
searchInput.addEventListener('input', debounce(handleSearch, 300));
loginBtn?.addEventListener('click', handleLogin);
registerBtn?.addEventListener('click', handleRegister);
logoutBtn?.addEventListener('click', () => authService.logout());
favoritesBtn?.addEventListener('click', toggleFavorites);

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await authService.init();
    updateAuthUI();
    fetchDapps();
});

// Auth event listener
authService.addAuthListener(updateAuthUI);

function updateAuthUI() {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    if (isAuthenticated && user) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        document.getElementById('user-name').textContent = user.name;
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

async function handleLogin() {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    
    try {
        await authService.login(email, password);
        showNotification('Logged in successfully!', 'success');
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegister() {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    const name = prompt('Enter your name:');
    
    try {
        await authService.register(email, password, name);
        showNotification('Registered successfully!', 'success');
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    }
}

async function fetchDapps() {
    try {
        addLoadingAnimation();
        let dapps = await dataService.getDapps();
        
        if (currentFilters.searchQuery) {
            dapps = await dataService.searchDapps(currentFilters.searchQuery);
        }

        if (currentFilters.showFavorites && authService.isAuthenticated()) {
            const favorites = await dataService.getFavorites(authService.getCurrentUser().id);
            dapps = dapps.filter(dapp => favorites.includes(dapp.id));
        }

        renderDapps(filterAndSortDapps(dapps));
    } catch (error) {
        console.error('Error fetching dapps:', error);
        showNotification('Failed to load DApps. Please try again.', 'error');
    } finally {
        removeLoadingAnimation();
    }
}

function handleFilterChange(event) {
    const { name, value } = event.target;
    currentFilters[name] = value;
    fetchDapps();
}

function handleSearch(event) {
    currentFilters.searchQuery = event.target.value;
    fetchDapps();
}

function toggleFavorites() {
    currentFilters.showFavorites = !currentFilters.showFavorites;
    favoritesBtn.classList.toggle('active');
    fetchDapps();
}

async function toggleFavorite(dappId) {
    if (!authService.isAuthenticated()) {
        showNotification('Please login to add favorites', 'warning');
        return;
    }

    try {
        await dataService.toggleFavorite(authService.getCurrentUser().id, dappId);
        const favoriteBtn = document.querySelector(`[data-favorite-btn="${dappId}"]`);
        favoriteBtn.classList.toggle('active');
        showNotification('Favorites updated!', 'success');
    } catch (error) {
        showNotification('Failed to update favorites', 'error');
    }
}

function filterAndSortDapps(dapps) {
    let filtered = dapps;

    if (currentFilters.network) {
        filtered = filtered.filter(dapp => 
            dapp.networks.includes(currentFilters.network)
        );
    }

    if (currentFilters.category) {
        filtered = filtered.filter(dapp => 
            dapp.categories.includes(currentFilters.category)
        );
    }

    filtered.sort((a, b) => {
        switch (currentFilters.sortBy) {
            case 'popular':
                return b.popularity - a.popularity;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'recent':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    return filtered;
}

function renderDapps(dapps) {
    // Clear existing content
    while (dappsGrid.firstChild) {
        if (!(dappsGrid.firstChild instanceof HTMLTemplateElement)) {
            dappsGrid.removeChild(dappsGrid.firstChild);
        }
    }

    // Render each dapp
    dapps.forEach(dapp => {
        const card = template.content.cloneNode(true);
        
        // Set dapp data
        card.querySelector('[data-dapp-logo]').src = dapp.logo;
        card.querySelector('[data-dapp-name]').textContent = dapp.name;
        card.querySelector('[data-dapp-description]').textContent = dapp.description;
        card.querySelector('[data-dapp-link]').href = dapp.url;

        // Add favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.dataset.favoriteBtn = dapp.id;
        favoriteBtn.innerHTML = '❤️';
        favoriteBtn.addEventListener('click', () => toggleFavorite(dapp.id));
        card.querySelector('.dapp-card-header').appendChild(favoriteBtn);

        // Render network badges
        const networksContainer = card.querySelector('[data-dapp-networks]');
        dapp.networks.forEach(network => {
            const badge = document.createElement('span');
            badge.className = 'network-badge';
            badge.textContent = network.charAt(0).toUpperCase() + network.slice(1);
            networksContainer.appendChild(badge);
        });

        // Render category tags
        const categoriesContainer = card.querySelector('[data-dapp-categories]');
        dapp.categories.forEach(category => {
            const tag = document.createElement('span');
            tag.className = 'category-tag';
            tag.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoriesContainer.appendChild(tag);
        });

        // Add TVL and volume if available
        if (dapp.tvl || dapp.dailyVolume) {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'dapp-stats';
            if (dapp.tvl) {
                statsContainer.innerHTML += `<span>TVL: ${dapp.tvl}</span>`;
            }
            if (dapp.dailyVolume) {
                statsContainer.innerHTML += `<span>24h Volume: ${dapp.dailyVolume}</span>`;
            }
            card.querySelector('.dapp-card-content').appendChild(statsContainer);
        }

        dappsGrid.appendChild(card);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function addLoadingAnimation() {
    dappsGrid.classList.add('animate-pulse');
}

function removeLoadingAnimation() {
    dappsGrid.classList.remove('animate-pulse');
}
