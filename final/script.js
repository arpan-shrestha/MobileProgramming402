// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
// Bottom nav
const bottomNav = document.getElementById('mobile-bottom-nav');
const bottomButtons = bottomNav ? bottomNav.querySelectorAll('.bn-item') : [];
const micButton = document.getElementById('bn-mic');
// STT modal
const sttOverlay = document.getElementById('stt-overlay');
const sttClose = document.getElementById('stt-close');
const sttToggle = document.getElementById('stt-toggle');
const sttCopy = document.getElementById('stt-copy');
const sttClear = document.getElementById('stt-clear');
const sttTranscript = document.getElementById('stt-transcript');
const sttLang = document.getElementById('stt-lang');
const sttStatus = document.getElementById('stt-status');
const sttTarget = document.getElementById('stt-target');
const sttTranslateBtn = document.getElementById('stt-translate');
const sttTranslation = document.getElementById('stt-translation');

// Navigation Toggle for Mobile
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navigation functionality
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target page
        showPage(targetId);
    });
});

// Show specific page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Sync bottom nav active state
    bottomButtons.forEach(btn => {
        const target = btn.getAttribute('data-target');
        if (target === pageId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        showPage(sectionId);
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Itinerary Management (Firebase integration hooks)
const itineraryForm = document.getElementById('itinerary-form');
const itinerariesContainer = document.getElementById('itineraries-container');

function renderItineraries(items) {
    if (!itinerariesContainer) return;
    if (!items || items.length === 0) {
        itinerariesContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No itineraries yet.</p>';
        return;
    }
    itinerariesContainer.innerHTML = items.map((itinerary, index) => {
        const id = itinerary.id ?? index;
        return `
        <div class="itinerary-item" data-id="${id}">
            <button class="delete-btn js-delete-itinerary" data-id="${id}">
                <i class="fas fa-trash"></i>
            </button>
            <h4>${itinerary.tripName}</h4>
            <p><strong>Destination:</strong> ${itinerary.destination}</p>
            <p><strong>Dates:</strong> ${itinerary.startDate} to ${itinerary.endDate}</p>
            ${itinerary.notes ? `<p><strong>Notes:</strong> ${itinerary.notes}</p>` : ''}
        </div>`;
    }).join('');
}
window.renderItineraries = renderItineraries;

itineraryForm && itineraryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
        tripName: document.getElementById('trip-name').value,
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        notes: document.getElementById('notes').value
    };
    document.dispatchEvent(new CustomEvent('itinerary:create', { detail: payload }));
    itineraryForm.reset();
});

itinerariesContainer && itinerariesContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-delete-itinerary');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    document.dispatchEvent(new CustomEvent('itinerary:delete', { detail: { id } }));
});

// Bucket List Management (Firebase integration hooks)
const bucketListForm = document.getElementById('bucket-list-form');
const bucketListItems = document.getElementById('bucket-list-items');

function renderBucketList(items) {
    if (!bucketListItems) return;
    if (!items || items.length === 0) {
        bucketListItems.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Your bucket list is empty.</p>';
        return;
    }
    bucketListItems.innerHTML = items.map((item, index) => {
        const id = item.id ?? index;
        return `
        <div class="bucket-list-item priority-${item.priority}" data-id="${id}">
            <button class="delete-btn js-delete-bucket" data-id="${id}">
                <i class="fas fa-trash"></i>
            </button>
            <h4>${item.destination}</h4>
            <p><strong>Priority:</strong> <span style="text-transform: capitalize;">${item.priority}</span></p>
            ${item.description ? `<p><strong>Why:</strong> ${item.description}</p>` : ''}
        </div>`;
    }).join('');
}
window.renderBucketList = renderBucketList;

bucketListForm && bucketListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
        destination: document.getElementById('destination-name').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('dream-description').value
    };
    document.dispatchEvent(new CustomEvent('bucket:create', { detail: payload }));
    bucketListForm.reset();
});

bucketListItems && bucketListItems.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-delete-bucket');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    document.dispatchEvent(new CustomEvent('bucket:delete', { detail: { id } }));
});

// Contact Form
const contactForm = document.getElementById('contact-form');

contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };
    
    // In a real application, you would send this data to a server
    console.log('Contact form submitted:', formData);
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Initialize displays
document.addEventListener('DOMContentLoaded', () => {
    // Consumers can call window.renderItineraries([]) and window.renderBucketList([])
    
    // Set current date as minimum for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;
    
    // Update end date minimum when start date changes
    document.getElementById('start-date').addEventListener('change', (e) => {
        document.getElementById('end-date').min = e.target.value;
    });

    // If bottom nav exists, add body padding to avoid overlap
    if (bottomNav) {
        document.body.classList.add('has-bottom-nav');
        bottomButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                if (target) {
                    showPage(target);
                    // Update top nav active link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${target}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        // Mic button opens modal
        micButton && micButton.addEventListener('click', () => {
            openSttModal();
        });

        // Set initial bottom nav active
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            bottomButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-target') === activePage.id);
            });
        }
    }
});

// Add some sample data for demonstration
function addSampleData() {
    // Removed local sample seeding; Firebase should provide data
}

// Removed local seeding; external data source should handle initial data

// Smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading animation for forms
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

// Add loading to form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) {
            showLoading(submitBtn);
        }
    });
});

// ===== Speech To Text (Web Speech API) =====
let recognition = null;
let isListening = false;

function ensureRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showNotification('Speech recognition not supported in this browser.', 'error');
        return null;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = sttLang ? sttLang.value : 'en-US';
    return rec;
}

function setSttStatus(state) {
    if (!sttStatus) return;
    sttStatus.classList.remove('active', 'listening');
    const textEl = sttStatus.querySelector('.text');
    if (state === 'active') {
        sttStatus.classList.add('active');
        textEl && (textEl.textContent = 'Ready');
    } else if (state === 'listening') {
        sttStatus.classList.add('listening');
        textEl && (textEl.textContent = 'Listening...');
    } else {
        textEl && (textEl.textContent = 'Idle');
    }
}

function openSttModal() {
    if (!sttOverlay) return;
    sttOverlay.style.display = 'flex';
    sttOverlay.setAttribute('aria-hidden', 'false');
    setSttStatus('active');
}

function closeSttModal() {
    stopListening();
    if (!sttOverlay) return;
    sttOverlay.style.display = 'none';
    sttOverlay.setAttribute('aria-hidden', 'true');
}

sttClose && sttClose.addEventListener('click', closeSttModal);
sttOverlay && sttOverlay.addEventListener('click', (e) => {
    if (e.target === sttOverlay) closeSttModal();
});

sttLang && sttLang.addEventListener('change', () => {
    if (isListening) {
        // Restart to apply language
        stopListening();
        startListening();
    }
});

sttToggle && sttToggle.addEventListener('click', () => {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
});

sttCopy && sttCopy.addEventListener('click', async () => {
    if (!sttTranscript) return;
    try {
        await navigator.clipboard.writeText(sttTranscript.value);
        showNotification('Transcript copied to clipboard', 'success');
    } catch (_) {
        showNotification('Failed to copy', 'error');
    }
});

sttClear && sttClear.addEventListener('click', () => {
    if (sttTranscript) sttTranscript.value = '';
    if (sttTranslation) sttTranslation.value = '';
});

function startListening() {
    if (isListening) return;
    recognition = ensureRecognition();
    if (!recognition) return;
    isListening = true;
    sttToggle && (sttToggle.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop');
    micButton && micButton.classList.add('active');
    setSttStatus('listening');

    let finalTranscript = '';
    recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) finalTranscript += res[0].transcript;
            else interim += res[0].transcript;
        }
        if (sttTranscript) sttTranscript.value = (finalTranscript + ' ' + interim).trim();
    };
    recognition.onend = () => {
        if (isListening) {
            // Auto-restart if interrupted
            try { recognition.start(); } catch (_) {}
        }
    };
    recognition.onerror = (e) => {
        showNotification(`Speech error: ${e.error}`, 'error');
        stopListening();
    };
    try { recognition.start(); } catch (_) {}
}

function stopListening() {
    if (!isListening) return;
    isListening = false;
    try { recognition && recognition.stop(); } catch (_) {}
    sttToggle && (sttToggle.innerHTML = '<i class="fas fa-microphone"></i> Start');
    micButton && micButton.classList.remove('active');
    setSttStatus('active');
}

// ===== Translation (client-side via service hook or sample public API) =====
function mapToShortLang(lang) {
    if (!lang) return 'en';
    return lang.split('-')[0];
}

async function translateText(text, source, target) {
    // Hook for your own translation service (e.g., Firebase Cloud Function)
    // Replace below with your implementation. For now, echo when same lang.
    if (source === target) return text;
    throw new Error('No translation service configured');
}

sttTranslateBtn && sttTranslateBtn.addEventListener('click', async () => {
    if (!sttTranscript || !sttTranslation) return;
    const text = sttTranscript.value.trim();
    if (!text) {
        showNotification('Nothing to translate yet. Speak or type something first.', 'info');
        return;
    }
    const sourceShort = mapToShortLang(sttLang ? sttLang.value : 'en-US');
    const targetShort = sttTarget ? sttTarget.value : 'en';
    if (sourceShort === targetShort) {
        sttTranslation.value = text;
        return;
    }
    const original = sttTranslateBtn.innerHTML;
    sttTranslateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
    sttTranslateBtn.disabled = true;
    try {
        const translated = await translateText(text, sourceShort, targetShort);
        sttTranslation.value = translated;
        showNotification('Translation complete', 'success');
    } catch (e) {
        showNotification('Translation failed. Please try again later.', 'error');
    } finally {
        sttTranslateBtn.innerHTML = original;
        sttTranslateBtn.disabled = false;
    }
});

// ===== Firebase Realtime Database: Itinerary CRUD (using provided pattern) =====
(async function initFirebaseItineraryCrud() {
    try {
        const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js');
        const { getDatabase, set, get, ref, update, remove } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js');

        const firebaseConfig = {
            apiKey: "AIzaSyCWQVuTUprKnW27a_oW8YoAFvaBCTllDFE",
            authDomain: "newproject-e0068.firebaseapp.com",
            projectId: "newproject-e0068",
            storageBucket: "newproject-e0068.appspot.com",
            messagingSenderId: "180372308985",
            appId: "1:180372308985:web:f3f587adb223a75c743328",
            measurementId: "G-4287YTZT0V"
        };

        const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        const db = getDatabase(app);

        async function fetchItineraries() {
            const snap = await get(ref(db, 'itineraries'));
            const items = [];
            if (snap.exists()) {
                snap.forEach(child => {
                    const data = child.val() || {};
                    items.push({ id: child.key, ...data });
                });
            }
            window.renderItineraries && window.renderItineraries(items);
        }

        async function createItinerary(payload) {
            const id = Date.now().toString();
            await set(ref(db, 'itineraries/' + id), payload);
            await fetchItineraries();
            showNotification('Itinerary created', 'success');
        }

        async function deleteItineraryById(id) {
            await remove(ref(db, 'itineraries/' + id));
            await fetchItineraries();
            showNotification('Itinerary deleted', 'info');
        }

        async function updateItineraryById(id, updateData) {
            await update(ref(db, 'itineraries/' + id), updateData);
            await fetchItineraries();
            showNotification('Itinerary updated', 'success');
        }

        // Initial fetch
        fetchItineraries();

        // Wire UI events -> Firebase
        document.addEventListener('itinerary:create', async (e) => {
            try {
                await createItinerary(e.detail);
            } catch (err) {
                showNotification('Failed to create itinerary', 'error');
                console.error(err);
            }
        });

        document.addEventListener('itinerary:delete', async (e) => {
            try {
                await deleteItineraryById(e.detail.id);
            } catch (err) {
                showNotification('Failed to delete itinerary', 'error');
                console.error(err);
            }
        });

        document.addEventListener('itinerary:update', async (e) => {
            try {
                const { id, ...updateData } = e.detail || {};
                if (!id) return;
                await updateItineraryById(id, updateData);
            } catch (err) {
                showNotification('Failed to update itinerary', 'error');
                console.error(err);
            }
        });
    } catch (err) {
        console.error('Firebase init failed:', err);
    }
})();

// ===== Firebase Realtime Database: Bucket List CRUD =====
(async function initFirebaseBucketCrud() {
    try {
        const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js');
        const { getDatabase, set, get, ref, update, remove } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js');

        const firebaseConfig = {
            apiKey: "AIzaSyCWQVuTUprKnW27a_oW8YoAFvaBCTllDFE",
            authDomain: "newproject-e0068.firebaseapp.com",
            projectId: "newproject-e0068",
            storageBucket: "newproject-e0068.appspot.com",
            messagingSenderId: "180372308985",
            appId: "1:180372308985:web:f3f587adb223a75c743328",
            measurementId: "G-4287YTZT0V"
        };

        const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        const db = getDatabase(app);

        async function fetchBucketList() {
            const snap = await get(ref(db, 'bucketList'));
            const items = [];
            if (snap.exists()) {
                snap.forEach(child => {
                    const data = child.val() || {};
                    items.push({ id: child.key, ...data });
                });
            }
            window.renderBucketList && window.renderBucketList(items);
        }

        async function createBucketItem(payload) {
            const id = Date.now().toString();
            await set(ref(db, 'bucketList/' + id), payload);
            await fetchBucketList();
            showNotification('Bucket item added', 'success');
        }

        async function deleteBucketItemById(id) {
            await remove(ref(db, 'bucketList/' + id));
            await fetchBucketList();
            showNotification('Bucket item removed', 'info');
        }

        async function updateBucketItemById(id, updateData) {
            await update(ref(db, 'bucketList/' + id), updateData);
            await fetchBucketList();
            showNotification('Bucket item updated', 'success');
        }

        // Initial fetch
        fetchBucketList();

        // Wire UI events -> Firebase
        document.addEventListener('bucket:create', async (e) => {
            try {
                await createBucketItem(e.detail);
            } catch (err) {
                showNotification('Failed to add bucket item', 'error');
                console.error(err);
            }
        });

        document.addEventListener('bucket:delete', async (e) => {
            try {
                await deleteBucketItemById(e.detail.id);
            } catch (err) {
                showNotification('Failed to remove bucket item', 'error');
                console.error(err);
            }
        });

        document.addEventListener('bucket:update', async (e) => {
            try {
                const { id, ...updateData } = e.detail || {};
                if (!id) return;
                await updateBucketItemById(id, updateData);
            } catch (err) {
                showNotification('Failed to update bucket item', 'error');
                console.error(err);
            }
        });
    } catch (err) {
        console.error('Firebase init failed (bucket):', err);
    }
})();

