// Admin Panel JavaScript
let currentEditId = null;

// Bookings array - will be populated from localStorage
let bookings = [];

let services = [
    { id: 1, name: "Classic Haircut", price: 25, duration: 30, description: "Traditional men's haircut" },
    { id: 2, name: "Beard Trim", price: 15, duration: 20, description: "Professional beard trimming" },
    { id: 3, name: "Hair Wash & Style", price: 20, duration: 25, description: "Complete wash and styling" },
    { id: 4, name: "Fade Cut", price: 30, duration: 35, description: "Modern fade haircut" }
];

let barbers = [
    { id: 1, name: "Mike Johnson", role: "Senior Barber", experience: "8 years", specialties: "Fades, Classic Cuts" },
    { id: 2, name: "Alex Rodriguez", role: "Master Barber", experience: "12 years", specialties: "Beard Styling, Vintage Cuts" },
    { id: 3, name: "Chris Thompson", role: "Barber", experience: "5 years", specialties: "Modern Styles, Hair Washing" }
];

let customers = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.type !== 'admin') {
        showLoginModal();
    } else {
        showDashboard();
    }

    // Load booking requests from localStorage
    loadBookingRequests();
    
    // Initialize dashboard
    updateDashboardStats();
    renderRecentBookings();
    renderAllBookings();
    renderServices();
    renderBarbers();
    renderCustomers();
    
    // Setup navigation
    setupNavigation();
    
    // Setup forms
    setupForms();
});

// Load booking requests from localStorage (from booking.html)
function loadBookingRequests() {
    const savedBookings = localStorage.getItem('bookingRequests');
    if (savedBookings) {
        const newBookings = JSON.parse(savedBookings);
        
        // Add new bookings to existing ones
        newBookings.forEach(newBooking => {
            const existingBooking = bookings.find(b => 
                b.customer === newBooking.name && 
                b.date === newBooking.date && 
                b.time === newBooking.time
            );
            
            if (!existingBooking) {
                const booking = {
                    id: bookings.length + 1,
                    customer: newBooking.name,
                    phone: newBooking.phone,
                    email: newBooking.email || 'N/A',
                    service: newBooking.service,
                    barber: newBooking.barber,
                    date: newBooking.date,
                    time: newBooking.time,
                    status: 'pending',
                    price: getServicePrice(newBooking.service),
                    createdAt: new Date().toISOString().split('T')[0]
                };
                bookings.push(booking);
                
                // Add customer if not exists
                const existingCustomer = customers.find(c => c.phone === newBooking.phone);
                if (!existingCustomer) {
                    customers.push({
                        id: customers.length + 1,
                        name: newBooking.name,
                        phone: newBooking.phone,
                        email: newBooking.email || 'N/A',
                        totalBookings: 1,
                        lastVisit: newBooking.date
                    });
                }
            }
        });
    }
}

function getServicePrice(serviceName) {
    const service = services.find(s => s.name === serviceName);
    return service ? service.price : 25;
}

function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
}

// Login form handler
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    // Check password length
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Check if email contains 'admin' for admin access
    if (username.toLowerCase().includes('admin')) {
        localStorage.setItem('currentUser', JSON.stringify({ email: username, type: 'admin' }));
        showDashboard();
    } else {
        alert('Admin access denied! Use an email with "admin" in it.');
    }
});

function logout() {
    localStorage.removeItem('currentUser');
    showLoginModal();
}

// Navigation setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update page title
            document.getElementById('page-title').textContent = 
                section.charAt(0).toUpperCase() + section.slice(1);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
}

// Dashboard functions
function updateDashboardStats() {
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('pending-bookings').textContent = 
        bookings.filter(b => b.status === 'pending').length;
    document.getElementById('total-revenue').textContent = 
        '$' + bookings.reduce((sum, b) => sum + (b.price || 0), 0);
    document.getElementById('total-customers').textContent = customers.length;
}

function renderRecentBookings() {
    const tbody = document.getElementById('recent-bookings-table');
    const recentBookings = bookings.slice(-5).reverse();
    
    tbody.innerHTML = recentBookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
        </tr>
    `).join('');
}

function renderAllBookings() {
    const tbody = document.getElementById('bookings-table');
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.phone}</td>
            <td>${booking.service}</td>
            <td>${booking.barber}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
            <td>
                <button class="btn-icon" onclick="editBooking(${booking.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteBooking(${booking.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                ${booking.status === 'pending' ? 
                    `<button class="btn-icon btn-success" onclick="confirmBooking(${booking.id})" title="Confirm">
                        <i class="fas fa-check"></i>
                    </button>` : ''
                }
            </td>
        </tr>
    `).join('');
}

function renderServices() {
    const container = document.getElementById('services-grid');
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <h4>${service.name}</h4>
                <div class="service-actions">
                    <button class="btn-icon" onclick="editService(${service.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteService(${service.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="service-details">
                <p class="service-price">$${service.price}</p>
                <p class="service-duration">${service.duration} mins</p>
                <p class="service-description">${service.description}</p>
            </div>
        </div>
    `).join('');
}

function renderBarbers() {
    const container = document.getElementById('barbers-grid');
    
    container.innerHTML = barbers.map(barber => `
        <div class="barber-card">
            <div class="barber-header">
                <h4>${barber.name}</h4>
                <div class="barber-actions">
                    <button class="btn-icon" onclick="editBarber(${barber.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteBarber(${barber.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="barber-details">
                <p class="barber-role">${barber.role}</p>
                <p class="barber-experience">${barber.experience}</p>
                <p class="barber-specialties">${barber.specialties}</p>
            </div>
        </div>
    `).join('');
}

function renderCustomers() {
    const tbody = document.getElementById('customers-table');
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.totalBookings}</td>
            <td>${customer.lastVisit}</td>
            <td>
                <button class="btn-icon" onclick="viewCustomer(${customer.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteCustomer(${customer.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Booking management functions
function confirmBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'confirmed';
        renderAllBookings();
        renderRecentBookings();
        updateDashboardStats();
        alert('Booking confirmed successfully!');
    }
}

function editBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        currentEditId = id;
        document.getElementById('booking-modal-title').textContent = 'Edit Booking';
        document.getElementById('booking-customer').value = booking.customer;
        document.getElementById('booking-phone').value = booking.phone;
        document.getElementById('booking-service').value = booking.service;
        document.getElementById('booking-barber').value = booking.barber;
        document.getElementById('booking-date').value = booking.date;
        document.getElementById('booking-time').value = booking.time;
        document.getElementById('booking-status').value = booking.status;
        
        populateServiceOptions();
        populateBarberOptions();
        
        document.getElementById('booking-modal').style.display = 'flex';
    }
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        bookings = bookings.filter(b => b.id !== id);
        renderAllBookings();
        renderRecentBookings();
        updateDashboardStats();
    }
}

function addBooking() {
    currentEditId = null;
    document.getElementById('booking-modal-title').textContent = 'Add Booking';
    document.getElementById('booking-form').reset();
    populateServiceOptions();
    populateBarberOptions();
    document.getElementById('booking-modal').style.display = 'flex';
}

// Service management functions
function addService() {
    currentEditId = null;
    document.getElementById('service-modal-title').textContent = 'Add Service';
    document.getElementById('service-form').reset();
    document.getElementById('service-modal').style.display = 'flex';
}

function editService(id) {
    const service = services.find(s => s.id === id);
    if (service) {
        currentEditId = id;
        document.getElementById('service-modal-title').textContent = 'Edit Service';
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-duration').value = service.duration;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-modal').style.display = 'flex';
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        services = services.filter(s => s.id !== id);
        renderServices();
    }
}

// Barber management functions
function addBarber() {
    currentEditId = null;
    document.getElementById('barber-modal-title').textContent = 'Add Barber';
    document.getElementById('barber-form').reset();
    document.getElementById('barber-modal').style.display = 'flex';
}

function editBarber(id) {
    const barber = barbers.find(b => b.id === id);
    if (barber) {
        currentEditId = id;
        document.getElementById('barber-modal-title').textContent = 'Edit Barber';
        document.getElementById('barber-name').value = barber.name;
        document.getElementById('barber-role').value = barber.role;
        document.getElementById('barber-experience').value = barber.experience;
        document.getElementById('barber-specialties').value = barber.specialties;
        document.getElementById('barber-modal').style.display = 'flex';
    }
}

function deleteBarber(id) {
    if (confirm('Are you sure you want to delete this barber?')) {
        barbers = barbers.filter(b => b.id !== id);
        renderBarbers();
    }
}

// Customer management functions
function viewCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        const customerBookings = bookings.filter(b => b.customer === customer.name);
        alert(`Customer: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}\nTotal Bookings: ${customerBookings.length}\nLast Visit: ${customer.lastVisit}`);
    }
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers = customers.filter(c => c.id !== id);
        renderCustomers();
    }
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Form setup and handlers
function setupForms() {
    // Booking form
    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bookingData = {
            customer: document.getElementById('booking-customer').value,
            phone: document.getElementById('booking-phone').value,
            service: document.getElementById('booking-service').value,
            barber: document.getElementById('booking-barber').value,
            date: document.getElementById('booking-date').value,
            time: document.getElementById('booking-time').value,
            status: document.getElementById('booking-status').value
        };
        
        if (currentEditId) {
            // Edit existing booking
            const booking = bookings.find(b => b.id === currentEditId);
            Object.assign(booking, bookingData);
        } else {
            // Add new booking
            const newBooking = {
                id: bookings.length + 1,
                ...bookingData,
                email: 'N/A',
                price: getServicePrice(bookingData.service),
                createdAt: new Date().toISOString().split('T')[0]
            };
            bookings.push(newBooking);
        }
        
        renderAllBookings();
        renderRecentBookings();
        updateDashboardStats();
        closeModal('booking-modal');
    });
    
    // Service form
    document.getElementById('service-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const serviceData = {
            name: document.getElementById('service-name').value,
            price: parseInt(document.getElementById('service-price').value),
            duration: parseInt(document.getElementById('service-duration').value),
            description: document.getElementById('service-description').value
        };
        
        if (currentEditId) {
            const service = services.find(s => s.id === currentEditId);
            Object.assign(service, serviceData);
        } else {
            const newService = {
                id: services.length + 1,
                ...serviceData
            };
            services.push(newService);
        }
        
        renderServices();
        closeModal('service-modal');
    });
    
    // Barber form
    document.getElementById('barber-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const barberData = {
            name: document.getElementById('barber-name').value,
            role: document.getElementById('barber-role').value,
            experience: document.getElementById('barber-experience').value,
            specialties: document.getElementById('barber-specialties').value
        };
        
        if (currentEditId) {
            const barber = barbers.find(b => b.id === currentEditId);
            Object.assign(barber, barberData);
        } else {
            const newBarber = {
                id: barbers.length + 1,
                ...barberData
            };
            barbers.push(newBarber);
        }
        
        renderBarbers();
        closeModal('barber-modal');
    });
}

function populateServiceOptions() {
    const select = document.getElementById('booking-service');
    select.innerHTML = '<option value="">Select Service</option>' +
        services.map(service => `<option value="${service.name}">${service.name} - $${service.price}</option>`).join('');
}

function populateBarberOptions() {
    const select = document.getElementById('booking-barber');
    select.innerHTML = '<option value="">Select Barber</option>' +
        barbers.map(barber => `<option value="${barber.name}">${barber.name}</option>`).join('');
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});