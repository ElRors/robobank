document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const confirmModal = $('#confirmModal');
    const confirmButton = document.getElementById('confirm-button');

    // Cargar usuarios al cargar la página
    loadUsersFromLocalStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
        const email = document.getElementById('email').value;
        const cargo = document.getElementById('cargo').value;
        const fechaIngreso = document.getElementById('fecha-ingreso').value;
        //Validar correo unico en base
        if (!validateEmailUnique(email)) {
            alert('El correo electrónico ya está registrado.');
            return;
        }
        // Validar usuario mayor 18 años
        if (!validateAge(fechaNacimiento, fechaIngreso)) {
            alert('El trabajador debe tener al menos 18 años al momento de ingresar.');
            return;
        }
        // Datos a guardar 
        document.getElementById('confirm-nombre').innerText = nombre;
        document.getElementById('confirm-apellido').innerText = apellido;
        document.getElementById('confirm-fecha-nacimiento').innerText = fechaNacimiento;
        document.getElementById('confirm-email').innerText = email;
        document.getElementById('confirm-cargo').innerText = cargo;
        document.getElementById('confirm-fecha-ingreso').innerText = fechaIngreso;

        confirmModal.modal('show');
    });
    // Datos que se muestran en el boton de confirmar
    confirmButton.addEventListener('click', function() {
        const nombre = document.getElementById('confirm-nombre').innerText;
        const apellido = document.getElementById('confirm-apellido').innerText;
        const email = document.getElementById('confirm-email').innerText;
        const cargo = document.getElementById('confirm-cargo').innerText;
        const fechaIngreso = document.getElementById('confirm-fecha-ingreso').innerText;

        addUserToList(nombre, apellido, email, cargo, fechaIngreso);
        saveUserToLocalStorage(nombre, apellido, email, cargo, fechaIngreso);
        confirmModal.modal('hide');
    });
    //Validar correo unico en base
    function validateEmailUnique(email) {
        const emails = Array.from(document.querySelectorAll('#user-list .user-email')).map(el => el.innerText);
        return !emails.includes(email);
    }
    // Validar usuario mayor 18 años
    function validateAge(fechaNacimiento, fechaIngreso) {
        const birthDate = new Date(fechaNacimiento);
        const joinDate = new Date(fechaIngreso);
        const age = joinDate.getFullYear() - birthDate.getFullYear();
        const m = joinDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && joinDate.getDate() < birthDate.getDate())) {
            return age > 18;
        }
        return age >= 18;
    }
    // Datos que se muestran en la base
    function addUserToList(nombre, apellido, email, cargo, fechaIngreso) {
        const userRow = document.createElement('div');
        userRow.classList.add('col-12', 'col-md-6', 'col-lg-3');
        // User card a guardar
        userRow.innerHTML = `
            <div class="user-card">
                <h3>${nombre} ${apellido}</h3>
                <p class="user-email">${email}</p>
                <p>${cargo}</p>
                <p>${fechaIngreso}</p>
                <button class="btn btn-danger btn-sm">Eliminar</button>
            </div>
        `;
        // Botón borrar usuario
        const deleteButton = userRow.querySelector('button');
        deleteButton.addEventListener('click', function() {
            userRow.remove();
            removeUserFromLocalStorage(email);
        });

        document.querySelector('#user-list .row').appendChild(userRow);
    }
    // Guardar usuario
    function saveUserToLocalStorage(nombre, apellido, email, cargo, fechaIngreso) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ nombre, apellido, email, cargo, fechaIngreso });
        localStorage.setItem('users', JSON.stringify(users));
    }
    // Cargar usuario
    function loadUsersFromLocalStorage() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.forEach(user => {
            addUserToList(user.nombre, user.apellido, user.email, user.cargo, user.fechaIngreso);
        });
    }
    // Eliminar usuario
    function removeUserFromLocalStorage(email) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.email !== email);
        localStorage.setItem('users', JSON.stringify(users));
    }
});
