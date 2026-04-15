// Main JavaScript for Myntra Clone

// Toggle mobile menu
function toggleMenu() {
    var menu = document.getElementById("myDropdown");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    var toggle = document.getElementById("toggle");
    var menu = document.getElementById("myDropdown");
    if (toggle && !toggle.contains(event.target)) {
        if (menu) menu.style.display = "none";
    }
});

// Profile dropdown
document.addEventListener('DOMContentLoaded', function() {
    var reggDropdown = document.getElementById("reggDropdown");
    if (reggDropdown) {
        reggDropdown.addEventListener('click', function() {
            var drop = document.getElementById("drop");
            if (drop) {
                drop.style.display = drop.style.display === "block" ? "none" : "block";
            }
        });
    }

    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(event) {
        var reggDropdown = document.getElementById("reggDropdown");
        var drop = document.getElementById("drop");
        if (reggDropdown && !reggDropdown.contains(event.target)) {
            if (drop) drop.style.display = "none";
        }
    });

    // Search functionality
    var searchBar = document.getElementById("search_bar");
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var query = searchBar.value;
                if (query.trim()) {
                    // Implement search functionality
                    console.log('Search for:', query);
                }
            }
        });
    }
});

// Add to cart function
function addToCart(productId) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        alert('Product added to cart!');
        window.location.href = '/cart';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Please login to add items to cart');
        window.location.href = '/login';
    });
}

// Add to wishlist function
function addToWishlist(productId) {
    fetch('/wishlist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
        },
        body: JSON.stringify({ product_id: productId })
    })
    .then(response => response.json())
    .then(data => {
        alert('Product added to wishlist!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Please login to add items to wishlist');
    });
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Prevent default link behavior for demo
document.addEventListener('DOMContentLoaded', function() {
    var demoLinks = document.querySelectorAll('a[href="#"], a[href=""]');
    demoLinks.forEach(function(link) {
        if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
    });
});
