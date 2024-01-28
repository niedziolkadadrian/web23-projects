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
            return;
        }

        const data = await response.json();
        // Display the data in the 'apiData' div
        document.getElementById('apiData').innerHTML = JSON.stringify(data, null, 4);
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
    
    if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        document.getElementById('user').innerHTML = "<button>Register</button> <button>Login</button>"
        return;
    }

    const data = await response.json();
    document.getElementById('user').innerHTML = JSON.stringify(data, null, 4);
}

const register = async function(){

}

const login = async function(){

}

const renewToken = async function(){

}

const logout = async function(){
    localStorage.removeItem("jwtToken");
}
