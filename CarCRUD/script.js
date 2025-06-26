// Car Management System
class CarManager {
    constructor() {
        this.cars = this.loadCars();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCars();
    }

    bindEvents() {
        // Modal controls
        document.getElementById('addCarBtn').addEventListener('click', () => {
            this.openModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('carForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterCars(e.target.value);
        });

        // Close modal when clicking outside
        document.getElementById('carModal').addEventListener('click', (e) => {
            if (e.target.id === 'carModal') {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    loadCars() {
        const storedCars = localStorage.getItem('cars');
        if (storedCars) {
            return JSON.parse(storedCars);
        }
        // Demo data
        return [
            {
                id: 1,
                make: 'Tesla',
                model: 'Model S',
                year: 2023,
                color: 'Pearl White',
                price: 89990
            },
            {
                id: 2,
                make: 'BMW',
                model: 'M3',
                year: 2022,
                color: 'Alpine White',
                price: 73900
            },
            {
                id: 3,
                make: 'Audi',
                model: 'RS6 Avant',
                year: 2023,
                color: 'Nardo Gray',
                price: 118000
            }
        ];
    }

    saveCars() {
        localStorage.setItem('cars', JSON.stringify(this.cars));
    }

    generateId() {
        return Date.now() + Math.random();
    }

    openModal(car = null) {
        const modal = document.getElementById('carModal');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');
        
        if (car) {
            // Edit mode
            modalTitle.textContent = 'Edit Car';
            submitBtn.textContent = 'Update Car';
            this.currentEditId = car.id;
            this.populateForm(car);
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Car';
            submitBtn.textContent = 'Add Car';
            this.currentEditId = null;
            this.clearForm();
        }
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('carMake').focus();
        }, 100);
    }

    closeModal() {
        const modal = document.getElementById('carModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.clearForm();
        this.currentEditId = null;
    }

    populateForm(car) {
        document.getElementById('carMake').value = car.make;
        document.getElementById('carModel').value = car.model;
        document.getElementById('carYear').value = car.year;
        document.getElementById('carColor').value = car.color;
        document.getElementById('carPrice').value = car.price;
    }

    clearForm() {
        document.getElementById('carForm').reset();
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        
        if (this.currentEditId) {
            this.updateCar(this.currentEditId, formData);
        } else {
            this.addCar(formData);
        }
        
        this.closeModal();
        this.renderCars();
        this.saveCars();
    }

    getFormData() {
        return {
            make: document.getElementById('carMake').value.trim(),
            model: document.getElementById('carModel').value.trim(),
            year: parseInt(document.getElementById('carYear').value),
            color: document.getElementById('carColor').value.trim(),
            price: parseFloat(document.getElementById('carPrice').value)
        };
    }

    addCar(carData) {
        const newCar = {
            id: this.generateId(),
            ...carData
        };
        this.cars.push(newCar);
        this.showNotification('Car added successfully!', 'success');
    }

    updateCar(id, carData) {
        const index = this.cars.findIndex(car => car.id === id);
        if (index !== -1) {
            this.cars[index] = { id, ...carData };
            this.showNotification('Car updated successfully!', 'success');
        }
    }

    deleteCar(id) {
        if (this.confirmDelete()) {
            this.cars = this.cars.filter(car => car.id !== id);
            this.renderCars();
            this.saveCars();
            this.showNotification('Car deleted successfully!', 'success');
        }
    }

    confirmDelete() {
        return confirm('Are you sure you want to delete this car? This action cannot be undone.');
    }

    filterCars(searchTerm) {
        const filteredCars = this.cars.filter(car => {
            const term = searchTerm.toLowerCase();
            return (
                car.make.toLowerCase().includes(term) ||
                car.model.toLowerCase().includes(term) ||
                car.year.toString().includes(term) ||
                car.color.toLowerCase().includes(term)
            );
        });
        this.renderCars(filteredCars);
    }

    renderCars(carsToRender = this.cars) {
        const carsGrid = document.getElementById('carsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (carsToRender.length === 0) {
            carsGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        carsGrid.innerHTML = carsToRender.map(car => this.createCarCard(car)).join('');
        
        // Add event listeners to action buttons
        this.bindActionButtons();
    }

    createCarCard(car) {
        return `
            <div class="car-card" data-id="${car.id}">
                <div class="car-header">
                    <div>
                        <div class="car-title">${this.escapeHtml(car.make)} ${this.escapeHtml(car.model)}</div>
                        <div class="car-year">${car.year}</div>
                    </div>
                    <div class="car-actions">
                        <button class="action-btn edit-btn" onclick="carManager.editCar(${car.id})" title="Edit car">
                            ✏️
                        </button>
                        <button class="action-btn delete-btn" onclick="carManager.deleteCar(${car.id})" title="Delete car">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="car-details">
                    <div class="detail-item">
                        <div class="detail-label">Color</div>
                        <div class="detail-value">${this.escapeHtml(car.color)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Year</div>
                        <div class="detail-value">${car.year}</div>
                    </div>
                </div>
                <div class="car-price">$${this.formatPrice(car.price)}</div>
            </div>
        `;
    }

    bindActionButtons() {
        // Event listeners are handled via onclick attributes in the HTML
        // This method is kept for potential future enhancements
    }

    editCar(id) {
        const car = this.cars.find(c => c.id === id);
        if (car) {
            this.openModal(car);
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#4299e1'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the car manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.carManager = new CarManager();
});

// Add some additional utility functions
window.addEventListener('beforeunload', () => {
    // Save data before page unload
    if (window.carManager) {
        window.carManager.saveCars();
    }
});

// Handle responsive design helpers
function handleResize() {
    // Add any responsive logic here if needed
    const modal = document.getElementById('carModal');
    if (modal.classList.contains('show')) {
        // Ensure modal is properly positioned on resize
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    }
}

window.addEventListener('resize', handleResize);

// Keyboard navigation improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('form-input')) {
        const inputs = Array.from(document.querySelectorAll('.form-input'));
        const currentIndex = inputs.indexOf(e.target);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
});