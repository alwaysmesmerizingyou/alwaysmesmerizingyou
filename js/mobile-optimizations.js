(function () {

    function setViewportHeight() {

        let vh = window.innerHeight * 0.01;

        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function handleResize() {
        setViewportHeight();

        document.body.style.height = window.innerHeight + 'px';
    }

    function setupTouchDetection() {
        try {
            document.documentElement.classList.add(
                'ontouchstart' in window ||
                    (window.DocumentTouch && document instanceof window.DocumentTouch) ?
                    'touch' : 'no-touch'
            );
        } catch (e) {
            console.error('Error detecting touch support:', e);
        }
    }

    function setupFastClick() {
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function () {
                if (window.FastClick) {
                    FastClick.attach(document.body);
                }
            }, false);
        }
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(err => {
                        console.error('ServiceWorker registration failed: ', err);
                    });
            });
        }
    }

    function setupPWAInstallPrompt() {
        let deferredPrompt;
        const addToHomeScreenBtn = document.createElement('button');

        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://') ||
            window.matchMedia('(display-mode: fullscreen)').matches) {
            return;
        }

        addToHomeScreenBtn.style.display = 'none';
        addToHomeScreenBtn.style.position = 'fixed';
        addToHomeScreenBtn.style.bottom = '20px';
        addToHomeScreenBtn.style.right = '20px';
        addToHomeScreenBtn.style.padding = '10px 20px';
        addToHomeScreenBtn.style.background = '#3b82f6';
        addToHomeScreenBtn.style.color = 'white';
        addToHomeScreenBtn.style.border = 'none';
        addToHomeScreenBtn.style.borderRadius = '5px';
        addToHomeScreenBtn.style.cursor = 'pointer';
        addToHomeScreenBtn.style.zIndex = '9999';
        addToHomeScreenBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        addToHomeScreenBtn.textContent = 'Install App';
        document.body.appendChild(addToHomeScreenBtn);

        window.addEventListener('beforeinstallprompt', (e) => {

            e.preventDefault();

            deferredPrompt = e;

            addToHomeScreenBtn.style.display = 'block';

            addToHomeScreenBtn.addEventListener('click', () => {

                addToHomeScreenBtn.style.display = 'none';

                deferredPrompt.prompt();

                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            addToHomeScreenBtn.style.display = 'none';
            deferredPrompt = null;
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                addToHomeScreenBtn.style.display = 'none';
            }
        });
    }

    function init() {

        setViewportHeight();

        window.addEventListener('resize', debounce(handleResize, 100));
        window.addEventListener('orientationchange', handleResize);

        setupTouchDetection();

        setupFastClick();

        registerServiceWorker();

        setupPWAInstallPrompt();

        console.log('Mobile optimizations initialized');

        document.documentElement.classList.add('js-loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();