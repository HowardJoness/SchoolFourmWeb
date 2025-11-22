const API_BASE = 'https://api.howardjones.dev/api';
const SERVER_URL = 'https://api.howardjones.dev:8000';

// 获取完整头像URL
function getAvatarUrl(url) {
    if (!url) return `${SERVER_URL}/static/avatars/default.png`;
    if (url.startsWith('http')) return url;
    // 确保不重复拼接
    if (url.startsWith('/')) return `${SERVER_URL}${url}`;
    return `${SERVER_URL}/${url}`;
}

function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.className = 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-sm transition-opacity duration-300 z-50 pointer-events-none';
        document.body.appendChild(el);
    }
    el.innerText = msg;
    el.style.opacity = '1';
    setTimeout(() => el.style.opacity = '0', 2000);
}

async function api(endpoint, method = 'GET', body = null, isFile = false) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (!isFile) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const opts = { method, headers };
        if (body) opts.body = isFile ? body : JSON.stringify(body);
        
        const res = await fetch(`${API_BASE}${endpoint}`, opts);
        if (res.status === 401) {
            localStorage.clear();
            window.location.href = 'index.html';
            return null;
        }
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || '请求失败');
        }
        return await res.json();
    } catch (e) {
        toast(e.message);
        return null;
    }
}

// 检查登录状态
function checkAuth() {
    if (!localStorage.getItem('token') && !window.location.href.includes('index.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'index.html';
    }
}

// 注入底部导航
function renderBottomNav(activePage) {
    const nav = document.createElement('nav');
    nav.className = 'fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-10 pb-safe';
    
    const itemClass = (page) => `flex flex-col items-center w-full ${activePage === page ? 'text-blue-600' : 'text-gray-400'}`;
    
    nav.innerHTML = `
        <a href="home.html" class="${itemClass('home')}">
            <i class="fas fa-home text-xl mb-0.5"></i>
            <span class="text-xs">首页</span>
        </a>
        <a href="me.html" class="${itemClass('me')}">
            <i class="fas fa-user text-xl mb-0.5"></i>
            <span class="text-xs">我的</span>
        </a>
    `;
    document.body.appendChild(nav);

}


