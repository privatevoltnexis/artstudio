// Detect video folders and their videos (hardcoded for static hosting)
function detectVideoFolders() {
    // Update this if you add/remove folders or videos
    const folderMap = {
        1: ["1.mp4"],
        2: ["1.mp4"],
        3: ["1.mp4"],
        4: ["1.mp4"],
        5: ["1.mp4"],
        6: ["1.mp4"],
        7: ["1.mp4"],
        8: ["1.mp4"],
        9: ["1.mp4"],
        10: ["1.mp4"]
        // Add more folders/videos as needed, using just the number (e.g., "1.webm", "2.webm")
    };
    const folders = Object.keys(folderMap).map(num => ({ folder: Number(num), videos: folderMap[num] }));
    folders.sort((a, b) => b.folder - a.folder);
    return folders;
}
// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll to order section
function scrollToOrder() {
    document.getElementById('order').scrollIntoView({
        behavior: 'smooth'
    });
}

// Gallery management
let currentImageCount = 15;
let totalImages = 100;
let showingAll = false;
let actualTotalImages = 0;
let actualTotalVideos = 0;
let currentCategory = 'photos';

// Optimized: List all images in each folder (hardcoded for static hosting)
function detectImageFolders() {
    // Hardcoded folder and image structure based on assets/img/
    // Update this if you add/remove folders or images
    const folderMap = {
        1: ["1.webp"],
        2: ["1.webp"],
        3: ["1.webp","2.webp","3.webp","4.webp"],
        4: ["1.webp"],
        5: ["1.webp"],
        6: ["1.webp"],
        7: ["1.webp"],
        8: ["1.webp"],
        9: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp"],
        10: ["1.webp"],
        11: ["1.webp","2.webp","3.webp","4.webp"],
        12: ["1.webp","2.webp","3.webp","4.webp"],
        13: ["1.webp","2.webp","3.webp","4.webp"],
        14: ["1.webp","2.webp","3.webp"],
        15: ["1.webp","2.webp"],
        16: ["1.webp"],
        17: ["1.webp"],
        18: ["1.webp"],
        19: ["1.webp","2.webp","3.webp"],
        20: ["1.webp","2.webp","3.webp"],
        21: ["1.webp","2.webp","3.webp","4.webp","5.webp"],
        22: ["1.webp","2.webp"],
        23: ["1.webp","2.webp","3.webp"],
        24: ["1.webp","2.webp"]
    };
    const folders = Object.keys(folderMap).map(num => ({ folder: Number(num), images: folderMap[num] }));
    folders.sort((a, b) => b.folder - a.folder);
    return folders;
}

// Load images from assets/img/ folders (largest folder first)
function loadImages() {
    const grid = document.getElementById('artGrid');
    grid.innerHTML = '';

    const folders = detectImageFolders();
    actualTotalImages = folders.length;
    const displayFolders = showingAll ? folders : folders.slice(0, currentImageCount);

    displayFolders.forEach((folderObj, idx) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        // Show the first image as the initial thumbnail
        const img = document.createElement('img');
        img.src = `assets/img/${folderObj.folder}/${folderObj.images[0]}`;
        img.alt = `Art ${folderObj.folder}`;
        img.addEventListener('click', () => openFolderLightbox(folderObj.folder, folderObj.images, 0));

    // No click event: do not open lightbox on click
        gridItem.appendChild(img);
        grid.appendChild(gridItem);
        setTimeout(() => {
            gridItem.classList.add('visible');
        }, idx * 50);

        // If folder has multiple images, autoslide the thumbnail
        if (folderObj.images.length > 1) {
            let currentIdx = 0;
            setInterval(() => {
                currentIdx = (currentIdx + 1) % folderObj.images.length;
                img.src = `assets/img/${folderObj.folder}/${folderObj.images[currentIdx]}`;
            }, 2000); // Change image every 2 seconds
        }
    });

    const showMoreBtn = document.getElementById('showMoreBtn');
    if (currentImageCount >= actualTotalImages) {
        showMoreBtn.style.display = 'none';
    } else {
        showMoreBtn.style.display = 'block';
    }
}

// Lightbox for folder images
let folderLightboxImages = [];
let folderLightboxIndex = 0;
let folderLightboxFolder = 0;

function openFolderLightbox(folderNum, images, startIdx) {
    folderLightboxImages = images;
    folderLightboxIndex = startIdx;
    folderLightboxFolder = folderNum;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    lightboxVideo.style.display = 'none';
    lightboxImg.style.display = 'block';
    lightboxImg.src = `assets/img/${folderNum}/${images[startIdx]}`;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    isSlideshow = true;
    currentMediaType = 'image';
    setupFolderLightboxControls();
}

function setupFolderLightboxControls() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    // Remove previous listeners if any
    lightboxImg.onclick = null;
    // Touch events for mobile
    let startX = 0;
    let startY = 0;
    lightboxImg.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: false });
    lightboxImg.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    lightboxImg.addEventListener('touchend', (e) => {
        if (!isSlideshow) return;
        e.preventDefault();
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        if (Math.abs(diffX) > 50 && diffY < 100) {
            if (diffX > 0) {
                nextFolderImage();
            } else {
                prevFolderImage();
            }
        }
    }, { passive: false });
    // Keyboard events for desktop
    document.addEventListener('keydown', folderLightboxKeyHandler);
}

function folderLightboxKeyHandler(e) {
    const lightbox = document.getElementById('lightbox');
    if (!isSlideshow || lightbox.style.display === 'none') return;
    if (e.key === 'ArrowRight') {
        nextFolderImage();
    } else if (e.key === 'ArrowLeft') {
        prevFolderImage();
    }
}

function nextFolderImage() {
    if (!folderLightboxImages.length) return;
    folderLightboxIndex = (folderLightboxIndex + 1) % folderLightboxImages.length;
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = `assets/img/${folderLightboxFolder}/${folderLightboxImages[folderLightboxIndex]}`;
}

function prevFolderImage() {
    if (!folderLightboxImages.length) return;
    folderLightboxIndex = (folderLightboxIndex - 1 + folderLightboxImages.length) % folderLightboxImages.length;
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = `assets/img/${folderLightboxFolder}/${folderLightboxImages[folderLightboxIndex]}`;
}



// No longer needed: createFolderSlideshow (all images shown at once)

// Create slideshow for multiple media files
function createMediaSlideshow(container, baseNumber, mediaType) {
    let currentIndex = 1;
    let currentElement;
    
    if (mediaType === 'image') {
        currentElement = document.createElement('img');
        currentElement.src = `assets/img/${baseNumber}.1.webp`;
        currentElement.alt = `Art ${baseNumber}`;
        currentElement.addEventListener('click', () => openSlideshowLightbox(baseNumber, 1, mediaType));
        
        setInterval(() => {
            currentIndex++;
            if (currentIndex > 5) currentIndex = 1;
            
            const newSrc = `assets/img/${baseNumber}.${currentIndex}.webp`;
            const testImg = new Image();
            
            testImg.onload = () => {
                currentElement.src = newSrc;
            };
            
            testImg.onerror = () => {
                currentIndex++;
                if (currentIndex > 5) currentIndex = 1;
            };
            
            testImg.src = newSrc;
        }, 3000);
    } else {
        currentElement = document.createElement('video');
        currentElement.src = `assets/vid/${baseNumber}.1.webm`;
        currentElement.muted = true;
        currentElement.autoplay = true;
        currentElement.addEventListener('click', () => openSlideshowLightbox(baseNumber, 1, mediaType));
        
        currentElement.addEventListener('ended', () => {
            currentIndex++;
            if (currentIndex > 5) currentIndex = 1;
            
            const newSrc = `assets/vid/${baseNumber}.${currentIndex}.webm`;
            const testVid = document.createElement('video');
            
            testVid.onloadeddata = () => {
                currentElement.src = newSrc;
                currentElement.play();
            };
            
            testVid.onerror = () => {
                currentIndex++;
                if (currentIndex > 5) currentIndex = 1;
            };
            
            testVid.src = newSrc;
        });
    }
    
    container.appendChild(currentElement);
}

// Show more/less function
function showMoreImages() {
    const btn = document.getElementById('showMoreBtn');
    if (showingAll) {
        currentImageCount = 15;
        showingAll = false;
    } else {
        if (currentCategory === 'photos') {
            currentImageCount = actualTotalImages;
        } else {
            currentImageCount = actualTotalVideos;
        }
        showingAll = true;
    }
    if (currentCategory === 'photos') {
        loadImages();
    } else {
        loadVideos();
    }
    // Always update button text after loading
    btn.textContent = showingAll ? 'Show Less' : 'Show More';
}

// Lightbox functionality
let currentLightboxIndex = 1;
let lightboxBaseNumber = 1;
let isSlideshow = false;
let currentMediaType = 'image';

function openLightbox(mediaSrc, mediaType) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    
    if (mediaType === 'video') {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = mediaSrc;
    } else {
        lightboxVideo.style.display = 'none';
        lightboxImg.style.display = 'block';
        lightboxImg.src = mediaSrc;
    }
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    isSlideshow = false;
}

function openSlideshowLightbox(baseNumber, startIndex, mediaType) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    
    lightboxBaseNumber = baseNumber;
    currentLightboxIndex = startIndex;
    currentMediaType = mediaType;
    isSlideshow = true;
    
    if (mediaType === 'video') {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = `assets/vid/${baseNumber}.${startIndex}.webm`;
    } else {
        lightboxVideo.style.display = 'none';
        lightboxImg.style.display = 'block';
        lightboxImg.src = `assets/img/${baseNumber}.${startIndex}.webp`;
    }
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setupLightboxControls();
}

function setupLightboxControls() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    // Touch events for mobile
    let startX = 0;
    let startY = 0;
    
    lightboxImg.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: false });
    
    lightboxImg.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    lightboxImg.addEventListener('touchend', (e) => {
        if (!isSlideshow) return;
        e.preventDefault();
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        
        // Only horizontal swipes (ignore vertical)
        if (Math.abs(diffX) > 50 && diffY < 100) {
            if (diffX > 0) {
                nextMedia();
            } else {
                prevMedia();
            }
        }
    }, { passive: false });
    
    // Keyboard events for desktop
    document.addEventListener('keydown', (e) => {
        if (!isSlideshow || lightbox.style.display === 'none') return;
        
        if (e.key === 'ArrowRight') {
            nextMedia();
        } else if (e.key === 'ArrowLeft') {
            prevMedia();
        }
    });
}

function nextMedia() {
    // If in folder lightbox mode, use folderLightboxImages
    if (isSlideshow && folderLightboxImages.length && currentMediaType === 'image') {
        folderLightboxIndex = (folderLightboxIndex + 1) % folderLightboxImages.length;
        const lightboxImg = document.getElementById('lightboxImg');
        lightboxImg.src = `assets/img/${folderLightboxFolder}/${folderLightboxImages[folderLightboxIndex]}`;
        return;
    }
    currentLightboxIndex++;
    if (currentLightboxIndex > 5) currentLightboxIndex = 1;
    if (currentMediaType === 'video') {
        const newSrc = `assets/vid/${lightboxBaseNumber}.${currentLightboxIndex}.webm`;
        const testVid = document.createElement('video');
        testVid.onloadeddata = () => {
            document.getElementById('lightboxVideo').src = newSrc;
        };
        testVid.onerror = () => {
            currentLightboxIndex++;
            if (currentLightboxIndex > 5) currentLightboxIndex = 1;
        };
        testVid.src = newSrc;
    } else {
        const newSrc = `assets/img/${lightboxBaseNumber}.${currentLightboxIndex}.webp`;
        const testImg = new Image();
        testImg.onload = () => {
            document.getElementById('lightboxImg').src = newSrc;
        };
        testImg.onerror = () => {
            currentLightboxIndex++;
            if (currentLightboxIndex > 5) currentLightboxIndex = 1;
        };
        testImg.src = newSrc;
    }
}

function prevMedia() {
    // If in folder lightbox mode, use folderLightboxImages
    if (isSlideshow && folderLightboxImages.length && currentMediaType === 'image') {
        folderLightboxIndex = (folderLightboxIndex - 1 + folderLightboxImages.length) % folderLightboxImages.length;
        const lightboxImg = document.getElementById('lightboxImg');
        lightboxImg.src = `assets/img/${folderLightboxFolder}/${folderLightboxImages[folderLightboxIndex]}`;
        return;
    }
    currentLightboxIndex--;
    if (currentLightboxIndex < 1) currentLightboxIndex = 5;
    if (currentMediaType === 'video') {
        const newSrc = `assets/vid/${lightboxBaseNumber}.${currentLightboxIndex}.webm`;
        const testVid = document.createElement('video');
        testVid.onloadeddata = () => {
            document.getElementById('lightboxVideo').src = newSrc;
        };
        testVid.onerror = () => {
            currentLightboxIndex--;
            if (currentLightboxIndex < 1) currentLightboxIndex = 5;
        };
        testVid.src = newSrc;
    } else {
        const newSrc = `assets/img/${lightboxBaseNumber}.${currentLightboxIndex}.webp`;
        const testImg = new Image();
        testImg.onload = () => {
            document.getElementById('lightboxImg').src = newSrc;
        };
        testImg.onerror = () => {
            currentLightboxIndex--;
            if (currentLightboxIndex < 1) currentLightboxIndex = 5;
        };
        testImg.src = newSrc;
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    isSlideshow = false;
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});





// Request form submission
document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const inputs = e.target.querySelectorAll('input, textarea');
    
    // Simple form validation
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });
    
    if (!allFilled) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate form submission
    alert('Thank you! Your request has been sent. We\'ll contact you soon.');
    e.target.reset();
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// FAQ Toggle Function
function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

// Instagram message function
function sendInstagramMessage() {
    const message = encodeURIComponent('Hi! I want a product');
    navigator.clipboard.writeText('Hi! I want a product').then(() => {
        alert('Message copied to clipboard! Please paste it when you open Instagram.');
        window.open('https://instagram.com/artstudio_artstudio', '_blank');
    }).catch(() => {
        alert('Please send this message: "Hi! I want a product"');
        window.open('https://instagram.com/artstudio_artstudio', '_blank');
    });
}

// Switch category function
function switchCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    showingAll = false;
    currentImageCount = 15;
    document.getElementById('showMoreBtn').textContent = 'Show More';
    
    if (category === 'photos') {
        loadImages();
    } else {
        loadVideos();
    }
}

// Load videos function
function loadVideos() {
    const grid = document.getElementById('artGrid');
    grid.innerHTML = '';

    const folders = detectVideoFolders();
    actualTotalVideos = folders.length;
    const displayFolders = showingAll ? folders : folders.slice(0, currentImageCount);

    displayFolders.forEach((folderObj, idx) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
    // Show only the first video as the thumbnail
    const video = document.createElement('video');
    video.src = `assets/vid/${folderObj.folder}/${folderObj.videos[0]}`;
    video.muted = true;
    video.autoplay = true;
    video.loop = false;
    video.playsInline = true;
    video.style.objectFit = 'cover';
    video.addEventListener('click', () => openLightbox(video.src, 'video'));
    gridItem.appendChild(video);
        grid.appendChild(gridItem);
        setTimeout(() => {
            gridItem.classList.add('visible');
        }, idx * 50);

        // If folder has multiple videos, autoslide the thumbnail
        if (folderObj.videos.length > 1) {
            let currentIdx = 0;
            video.addEventListener('ended', () => {
                currentIdx = (currentIdx + 1) % folderObj.videos.length;
                video.src = `assets/vid/${folderObj.folder}/${folderObj.videos[currentIdx]}`;
                video.play();
            });
        }
    });

    const showMoreBtn = document.getElementById('showMoreBtn');
    if (currentImageCount >= actualTotalVideos) {
        showMoreBtn.style.display = 'none';
    } else {
        showMoreBtn.style.display = 'block';
    }
}

// Check for video slideshow
function checkForVideoSlideshow(container, baseNumber) {
    const video1 = document.createElement('video');
    video1.src = `assets/vid/${baseNumber}.1.webm`;
    
    video1.onloadeddata = () => {
        createMediaSlideshow(container, baseNumber, 'video');
    };
    
    video1.onerror = () => {
        const testVid = document.createElement('video');
        testVid.onloadeddata = () => {
            const singleVideo = document.createElement('video');
            singleVideo.src = `assets/vid/${baseNumber}.webm`;
            singleVideo.muted = true;
            singleVideo.loop = true;
            singleVideo.autoplay = true;
            singleVideo.addEventListener('click', () => openLightbox(singleVideo.src, 'video'));
            container.appendChild(singleVideo);
        };
        testVid.src = `assets/vid/${baseNumber}.webm`;
    };
}

// Detect total videos
function detectTotalVideos() {
    return new Promise((resolve) => {
        let count = 0;
        let checking = true;
        
        function checkVideo(num) {
            const vid1 = document.createElement('video');
            vid1.onloadeddata = () => {
                count = num;
                checkVideo(num + 1);
            };
            vid1.onerror = () => {
                const vid2 = document.createElement('video');
                vid2.onloadeddata = () => {
                    count = num;
                    checkVideo(num + 1);
                };
                vid2.onerror = () => {
                    if (checking) {
                        checking = false;
                        resolve(count);
                    }
                };
                vid2.src = `assets/vid/${num}.webm`;
            };
            vid1.src = `assets/vid/${num}.1.webm`;
        }
        
        checkVideo(1);
    });
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', async () => {
    const folders = await detectImageFolders();
    actualTotalImages = folders.length;
    actualTotalVideos = await detectTotalVideos();
    loadImages(); // Default to photos
});
