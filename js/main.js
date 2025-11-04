// ========================================
// リンパマッサージサロン メインJavaScript
// Tailwind CSS対応版
// ========================================

// ========================================
// DOM要素の取得
// ========================================
const hamburger = document.querySelector('#hamburger');
const mobileMenu = document.querySelector('#mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const backToTopBtn = document.querySelector('#back-to-top');
const header = document.querySelector('#header');

// ========================================
// ハンバーガーメニューの開閉
// ========================================
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // アクセシビリティ対応
        const isActive = mobileMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });
    
    // メニューリンクをクリックしたらメニューを閉じる
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // メニュー外をクリックしたら閉じる
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// ========================================
// スムーススクロール
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // ハッシュのみの場合（#contactなど）
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// スクロール時のヘッダー効果
// ========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // スクロール位置が50pxを超えたらヘッダーに影を追加
    if (currentScroll > 50) {
        header.classList.add('shadow-xl');
        header.classList.remove('shadow-md');
    } else {
        header.classList.remove('shadow-xl');
        header.classList.add('shadow-md');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// トップへ戻るボタンの表示/非表示
// ========================================
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // トップへ戻るボタンのクリックイベント
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// スクロールアニメーション（Intersection Observer）
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// アニメーション対象の要素を選択
const animateElements = document.querySelectorAll(`
    .problem-item,
    .benefit-item,
    .feature-item,
    .menu-item,
    .testimonial-item
`);

// 初期状態を設定してオブザーバーに登録
animateElements.forEach((element, index) => {
    // 既にopacity: 0がHTMLに設定されているため、transition だけ追加
    element.style.transition = `all 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(element);
});

// ========================================
// ページロード時のフェードインアニメーション
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // URLにハッシュがある場合、該当セクションへスクロール
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// ========================================
// パフォーマンス最適化：デバウンス関数
// ========================================
function debounce(func, wait = 10) {
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

// ========================================
// レスポンシブ対応：ウィンドウリサイズ処理
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // ウィンドウサイズが変更された時の処理
        if (window.innerWidth > 768) {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    }, 250);
});

// ========================================
// アクセシビリティ：キーボードナビゲーション
// ========================================
document.addEventListener('keydown', (e) => {
    // Escキーでモーダルやメニューを閉じる
    if (e.key === 'Escape') {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
});

// ========================================
// 外部リンクに target="_blank" と rel="noopener" を自動追加
// ========================================
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ========================================
// スクロール進捗表示（オプション機能）
// ========================================
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercentage}%`;
    }
}

// デバウンスを適用したスクロールイベント
window.addEventListener('scroll', debounce(updateScrollProgress, 10));

// ========================================
// 数字カウントアップアニメーション（将来の拡張用）
// ========================================
function countUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ========================================
// フォームバリデーション（将来の拡張用）
// ========================================
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// ========================================
// モーダル機能（将来の拡張用）
// ========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// トースト通知（将来の拡張用）
// ========================================
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// ========================================
// ローカルストレージ管理（将来の拡張用）
// ========================================
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }
};

// ========================================
// コンソールログ（開発者向け）
// ========================================
console.log('%c🌿 Lymph Care Salon Website', 'color: #8A9A5B; font-size: 16px; font-weight: bold;');
console.log('%cWebsite loaded successfully with Tailwind CSS!', 'color: #4D4D4D; font-size: 12px;');

// ========================================
// エクスポート（モジュール使用時）
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openModal,
        closeModal,
        validateForm,
        countUp,
        debounce,
        showToast,
        storage
    };
}
