function fetchUser() {
    const userId = document.getElementById('userSelect').value;
    const userDetails = document.getElementById('userDetails');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const userIdInput = document.getElementById('userId');
    const submitButton = document.getElementById('submitButton');
    const updateButton = document.getElementById('updateButton');

    if (!userId) {
        userDetails.innerHTML = '<p>Selecciona un usuario para ver los detalles.</p>';
        document.getElementById('userForm').reset();
        userIdInput.value = '';
        submitButton.style.display = 'inline-block';
        updateButton.style.display = 'none';
        return;
    }

    fetch(`/data/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                userDetails.innerHTML = `<p class="text-danger">${data.error}</p>`;
            } else {
                userDetails.innerHTML = `
                    <p><strong>ID:</strong> ${data.id}</p>
                    <p><strong>Nombre:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                `;
                nameInput.value = data.name;
                emailInput.value = data.email;
                userIdInput.value = data.id;
                submitButton.style.display = 'none';
                updateButton.style.display = 'inline-block';
            }
        });
}

function updateTable() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('userTable');
            const userSelect = document.getElementById('userSelect');
            const selectedId = userSelect.value;
            tbody.innerHTML = data.length === 0 ? '<tr><td colspan="3">Usuarios no encontrados.</td></tr>' : '';
            data.forEach(user => {
                tbody.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                    </tr>
                `;
            });
            userSelect.innerHTML = '<option value="">Selecciona un ID de usuario</option>';
            data.forEach(user => {
                userSelect.innerHTML += `<option value="${user.id}">${user.id} - ${user.name}</option>`;
            });
            userSelect.value = selectedId;
        });
}

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const userId = document.getElementById('userId').value;
    const formMessage = document.getElementById('formMessage');

    if (!name || !email) {
        formMessage.innerHTML = '<p class="text-danger">Nombre y email son requeridos.</p>';
        return;
    }

    const data = { name, email };
    const method = userId ? 'PUT' : 'POST';
    if (userId) data.id = parseInt(userId);

    fetch('/data', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                formMessage.innerHTML = `<p class="text-danger">${result.error}</p>`;
            } else {
                formMessage.innerHTML = `<p class="text-success">${userId ? 'Usuario actualizado' : 'Usuario añadido'} exitosamente!</p>`;
                this.reset();
                document.getElementById('userId').value = '';
                document.getElementById('submitButton').style.display = 'inline-block';
                document.getElementById('updateButton').style.display = 'none';
                document.getElementById('userSelect').value = '';
                document.getElementById('userDetails').innerHTML = '<p>Selecciona un usuario para ver los detalles.</p>';
                updateTable();
            }
        });
});

document.getElementById('deleteButton').addEventListener('click', function() {
    const formMessage = document.getElementById('formMessage');
    fetch('/data', { method: 'DELETE' })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                formMessage.innerHTML = `<p class="text-danger">${result.error}</p>`;
            } else {
                formMessage.innerHTML = '<p class="text-success">Último usuario eliminado exitosamente!</p>';
                updateTable();
            }
        });
});

updateTable();