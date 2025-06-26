// Brand new Car CRUD JS: reliable, simple, and always works

document.addEventListener('DOMContentLoaded', function() {
    renderCars();
    const form = document.getElementById('carForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('carId').value;
        const car = {
            id: id ? id : Date.now().toString(),
            brand: document.getElementById('brand').value.trim(),
            model: document.getElementById('model').value.trim(),
            year: document.getElementById('year').value.trim(),
            color: document.getElementById('color').value.trim(),
            price: document.getElementById('price').value.trim(),
            engine: document.getElementById('engine').value.trim(),
            vin: document.getElementById('vin').value.trim()
        };
        let cars = getCars();
        if (id) {
            cars = cars.map(c => c.id === id ? car : c);
        } else {
            cars.push(car);
        }
        saveCars(cars);
        renderCars();
        form.reset();
        document.getElementById('carId').value = '';
    });
    form.addEventListener('reset', function() {
        setTimeout(() => {
            document.getElementById('carId').value = '';
        }, 0);
    });
});

function getCars() {
    try {
        return JSON.parse(localStorage.getItem('cars') || '[]');
    } catch {
        return [];
    }
}
function saveCars(cars) {
    localStorage.setItem('cars', JSON.stringify(cars));
}
function renderCars() {
    const cars = getCars();
    const tbody = document.getElementById('carTableBody');
    tbody.innerHTML = '';
    cars.forEach((car, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.color}</td>
            <td>${car.price}</td>
            <td>${car.engine}</td>
            <td>${car.vin}</td>
            <td>
                <button type="button" class="btn btn-info btn-sm me-1" title="Edit" onclick="editCar('${car.id}')"><i class='bi bi-pencil-square'></i></button>
                <button type="button" class="btn btn-danger btn-sm" title="Delete" onclick="deleteCar('${car.id}')"><i class='bi bi-trash3'></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
window.editCar = function(id) {
    const cars = getCars();
    const car = cars.find(c => c.id === id);
    if (!car) return;
    document.getElementById('carId').value = car.id;
    document.getElementById('brand').value = car.brand;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('color').value = car.color;
    document.getElementById('price').value = car.price;
    document.getElementById('engine').value = car.engine;
    document.getElementById('vin').value = car.vin;
}
window.deleteCar = function(id) {
    let cars = getCars();
    cars = cars.filter(c => c.id !== id);
    saveCars(cars);
    renderCars();
    document.getElementById('carForm').reset();
    document.getElementById('carId').value = '';
}
