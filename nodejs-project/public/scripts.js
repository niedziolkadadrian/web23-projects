const getContacts = async function () {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/api/contacts', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }); // Update with your API endpoint
        
        if (!response.ok) {
            // If the response status is not in the range 200-299 (OK), log an error
            console.error('Error:', response.status, response.statusText);
            document.getElementById('data-container').style.display = 'none';
            return;
        }

        const data = await response.json();
        const container = document.getElementById('data');
        container.innerHTML = '';

        const addButton = document.createElement('button');
        addButton.textContent = "Dodaj kontakt";
        addButton.addEventListener('click', function() {
            window.location.href = '/contacts/add'; 
        });
        container.appendChild(addButton);
        
        data.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('contact');

            const nameDiv = document.createElement('div');
            nameDiv.textContent = `Nazwa: ${contact.name}`;
            contactDiv.appendChild(nameDiv);
            const emailDiv = document.createElement('div');
            emailDiv.textContent = `Email: ${contact.email}`;
            contactDiv.appendChild(emailDiv);
            const phoneDiv = document.createElement('div');
            phoneDiv.textContent = `Telefon: ${contact.phone}`;
            contactDiv.appendChild(phoneDiv);

            const infoButton = document.createElement('button');
            infoButton.classList.add("info-button");
            infoButton.textContent = 'Info';
            infoButton.addEventListener('click', function() {
                window.location.href = `/contacts/${contact._id}`; 
            });
            contactDiv.appendChild(infoButton);
            
            const editButton = document.createElement('button');
            editButton.classList.add("edit-button");
            editButton.textContent = 'Edytuj';
            editButton.addEventListener('click', function() {
                window.location.href = `/contacts/edit/${contact._id}`; 
            });
            contactDiv.appendChild(editButton);
            
            const deleteButton = document.createElement('button');
            deleteButton.classList.add("delete-Button");
            deleteButton.textContent = 'Usuń';
            deleteButton.addEventListener('click', () => deleteContact(contact._id));
            contactDiv.appendChild(deleteButton);
            
            container.appendChild(contactDiv);
        });
        
        
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
}

const getUserInformations = async function(){
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/api/users/current', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const container = document.getElementById('user');
    container.innerHTML = '';

    if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        
        const registerButton = document.createElement('button');
        registerButton.textContent = "Zarejestruj";
        registerButton.addEventListener('click', function() {
            window.location.href = '/register'; 
        });
        container.appendChild(registerButton);
        
        const loginButton = document.createElement('button');
        loginButton.textContent = "Zaloguj";
        loginButton.addEventListener('click', function() {
            window.location.href = '/login'; 
        });
        container.appendChild(loginButton);

        return;
    }

    const data = await response.json();

    const usernameDiv = document.createElement('div');
    usernameDiv.textContent = `${data.username}`;
    container.appendChild(usernameDiv);
    const emailDiv = document.createElement('div');
    emailDiv.textContent = `${data.email}`;
    container.appendChild(emailDiv);


    const logoutButton = document.createElement('button');
    logoutButton.textContent = "Wyloguj";
    logoutButton.addEventListener('click', logout);
    container.appendChild(logoutButton);
}

const redirectIfLoggedIn = async function(){
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/api/users/current', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        window.location.href = "/";
    }
}

const register = async function(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById("info").innerText = "Podane hasła nie odpowiadają sobie!";
        document.getElementById("info").classList.add('error-message');
        return;
    }

    const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });
    
    if(!response.ok) {
        const data = await response.json();
        if(data.title === "Validation Failed"){
            document.getElementById("info").innerText = "Użytkownik o takim adresie email już istnieje!";
            document.getElementById("info").classList.add('error-message');
        }
            
        return;
    }
    const data = await response.json();
    window.location.href = `/register/success?email=${data.email}`;
}

const login = async function(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
    
    if(!response.ok) {
        console.error('Error:', response.status, response.statusText);
        const data = await response.json();
        console.log(data);
        if(data.title === "Unauthorized"){
            document.getElementById("info").innerText = "Nieprawidłowy email lub hasło!";
            document.getElementById("info").classList.add('error-message');
        }
            

        return;
    }

    const data = await response.json();
    const token = data["accessToken"];
    localStorage.setItem("jwtToken", token);
    window.location.href = "/";
}

const renewToken = async function(){

}

const logout = async function(){
    localStorage.removeItem("jwtToken");
    window.location.href = "/";
}

const getIdFromUrl = function(){
    const url = window.location.href;
    const urlSegments = url.split("/");
    
    const id = urlSegments[urlSegments.length - 1];
    return id;
}

const getContactInfo = async function(){
    const id = getIdFromUrl();
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/api/contacts/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); // Update with your API endpoint
    
    if (!response.ok) {
        // If the response status is not in the range 200-299 (OK), log an error
        console.error('Error:', response.status, response.statusText);
        document.getElementById("info").innerText = "Nie znaleziono takiego kontaktu";
        document.getElementById("info").classList.add('error-message');
        document.getElementById('data-container').style.display = 'none';
        return;
    }

    const contact = await response.json();
    const container = document.getElementById('data')
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact');

    const idDiv = document.createElement('div');
    idDiv.textContent = `Id: ${contact._id}`;
    contactDiv.appendChild(idDiv);
    const nameDiv = document.createElement('div');
    nameDiv.textContent = `Nazwa: ${contact.name}`;
    contactDiv.appendChild(nameDiv);
    const emailDiv = document.createElement('div');
    emailDiv.textContent = `Email: ${contact.email}`;
    contactDiv.appendChild(emailDiv);
    const phoneDiv = document.createElement('div');
    phoneDiv.textContent = `Telefon: ${contact.phone}`;
    contactDiv.appendChild(phoneDiv);
    const createdDiv = document.createElement('div');
    let date = new Date(contact.createdAt);
    createdDiv.textContent = `Stworzono: ${date.toLocaleString()}`;
    contactDiv.appendChild(createdDiv);
    const editedDiv = document.createElement('div');
    date = new Date(contact.updatedAt);
    editedDiv.textContent = `Edytowano: ${date.toLocaleString()}`;
    contactDiv.appendChild(editedDiv);

    
    const editButton = document.createElement('button');
    editButton.classList.add("edit-button");
    editButton.textContent = 'Edytuj';
    editButton.addEventListener('click', function() {
        window.location.href = `/contacts/edit/${contact._id}`; 
    });
    contactDiv.appendChild(editButton);
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-Button");
    deleteButton.textContent = 'Usuń';
    deleteButton.addEventListener('click', () => deleteContact(contact._id));
    contactDiv.appendChild(deleteButton);
    
    container.appendChild(contactDiv);

    //document.getElementById('data').innerHTML =  JSON.stringify(data, null, 4);
}

const getContactEditInfo = async function(){
    const id = getIdFromUrl();
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/api/contacts/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); // Update with your API endpoint
    
    if (!response.ok) {
        // If the response status is not in the range 200-299 (OK), log an error
        console.error('Error:', response.status, response.statusText);
        document.getElementById("info").innerText = "Nie znaleziono takiego kontaktu";
        document.getElementById("info").classList.add('error-message');
        document.getElementById('data-container').style.display = 'none';
        return;
    }

    const data = await response.json();
    document.getElementById('contactId').value = data['_id'];
    document.getElementById('name').value = data['name'];
    document.getElementById('email').value = data['email'];
    document.getElementById('phone').value = data['phone'];
}

const addContact = async function(event){
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
        }),
    });
    
    if(!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
    }
    
    //Show ok message
    document.getElementById("info").innerText = "Pomyślnie dodano kontakt!";
    document.getElementById("info").classList.add('success-message');
    document.getElementById('addContactForm').reset();
}

const editContact = async function(event){
    event.preventDefault();
    const contactId = document.getElementById('contactId').value
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
        }),
    });

    if(!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
    }

    document.getElementById("info").innerText = "Pomyślnie edytowano kontakt!";
    document.getElementById("info").classList.add('success-message');
}

const deleteContact = async function(contactId){
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if(!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
    }

    document.getElementById("info").innerText = "Pomyślnie usunięto kontakt!";
    document.getElementById("info").classList.add('success-message');
    getContacts();
}