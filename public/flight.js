document.addEventListener('DOMContentLoaded', () => {
   
    const loginForm = document.querySelector('#loginModal form');
    const registerForm = document.querySelector('#registerModal form');
    
   
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.querySelector('#loginEmail').value;
        const password = document.querySelector('#loginPassword').value;
        const loginError = document.querySelector('#loginError');
        
      
        loginError.classList.add('d-none');
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = '/booking';
            } else {
                loginError.textContent = data.message || 'Invalid credentials. Please try again.';
                loginError.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error during login:', error);
            loginError.textContent = 'An error occurred during login.';
            loginError.classList.remove('d-none');
        }
    });

    
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const fullName = document.querySelector('#registerFullName').value;
        const lastName = document.querySelector('#registerLastName').value;
        const userName = document.querySelector('#registerUserName').value;
        const contact = document.querySelector('#registerContact').value;
        const email = document.querySelector('#registerEmail').value;
        const password = document.querySelector('#registerPassword').value;

       
        if (!fullName || !lastName || !userName || !contact || !email || !password) {
            showPopup("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, lastName, userName, contact, email, password })
            });

            if (response.ok) {
            showPopup("Registration successful!");
                location.reload();
            } else {
            showPopup("Registration failed!");
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });

   
    document.getElementById('search-btn').addEventListener('click', function (e) {
        const validCities = ['lahore', 'karachi', 'faisalabad',  'hyderabad', 'quetta'];
        const inputCity = document.getElementById('destination').value.trim().toLowerCase();
    
        if (!inputCity) {
            e.preventDefault();
            showPopup("Please enter a city name first.");
            return;
        }
    
        if (validCities.includes(inputCity)) {
            fetch('/isLoggedIn', { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    if (data.isLoggedIn) {
                        window.location.href = `/booking?city=${encodeURIComponent(inputCity)}`;
                    } else {
                        showPopup(`Flight is available for ${inputCity.charAt(0).toUpperCase() + inputCity.slice(1)}. Please Login!`);
    
                        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                        loginModal.show();
                    }
                })
                .catch(error => {
                    console.error('Error checking login status:', error);
                    showPopup("An error occurred. Please try again later.");
                });
        } else {
            e.preventDefault();
            showPopup(`Sorry! Currently we don't have any flights available to ${inputCity.charAt(0).toUpperCase() + inputCity.slice(1)}`);
        }
    });
    
});











    let cloneCount = 2; 

       
        document.getElementById('cloneForm').addEventListener('click', () => {
            const maxSeats = 5;
            let filledForms = parseInt(localStorage.getItem('filledForms')) || 0;
        
            if (filledForms >= maxSeats) {
                showPopup("No more seats available");
                return;
            }
        
           
            const mainForm = document.getElementById('mainForm');
            const clonedForm = document.createElement('form');
            clonedForm.classList.add('flight-form');
            clonedForm.innerHTML = mainForm.innerHTML;
            clonedForm.id = `clonedForm_${cloneCount}`;
        
           
            const personLabel = clonedForm.querySelector('h2');
            if (personLabel) {
                personLabel.textContent = `Person: ${cloneCount}`;
            }
        
            
            const cloneButton = clonedForm.querySelector('#cloneForm');
            if (cloneButton) cloneButton.remove();
        
           
            document.getElementById('clonedFormsContainer').appendChild(clonedForm);
        
           
            filledForms++;
            localStorage.setItem('filledForms', filledForms);
            cloneCount++;
            updateSeatCounter();
        });
        
       
        document.getElementById('submitAllForms').addEventListener('click', () => {
            const allForms = document.querySelectorAll('.flight-form');
            const formDataArray = [];
        
            let validFormCount = 0;
        
            allForms.forEach((form) => {
                const formData = new FormData(form);
                let isValidForm = true;
        
             
                formData.forEach((value) => {
                    if (value.trim() === '') {
                        isValidForm = false;
                    }
                });
        
                if (isValidForm) {
                    validFormCount++;
                    formDataArray.push(Object.fromEntries(formData)); 
                }
            });
        
            if (validFormCount === 0) {
                showPopup("Please fill out all fields in at least one form before submitting!");
                return;
            }
        
           
            fetch('/cloned', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataArray),
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/payment';
                } else {
                    window.location.href = '/payment';
                }
            }).catch(error => {
                console.error('Error:', error);
                window.location.href = '/payment';
            });
        });
        
       
        const updateSeatCounter = () => {
            const maxSeats = 5;
            let filledForms = parseInt(localStorage.getItem('filledForms')) || 0;
            const availableSeats = maxSeats - filledForms;
            document.getElementById('seatCounter').textContent = `${availableSeats} seats available only`;
        };
        
       
        document.addEventListener('DOMContentLoaded', () => {
            const maxSeats = 5;
            let filledForms = parseInt(localStorage.getItem('filledForms')) || 0;
        
           
            if (filledForms >= maxSeats) {
                localStorage.setItem('filledForms', 0);
                showPopup("All seats are filled. The form count will reset now.");
                window.location.reload();
            }
        
           
            if (filledForms >= maxSeats) {
                document.getElementById('cloneForm').disabled = true;
                showPopup("All seats are filled!");
            }
        
           
            if (filledForms < maxSeats) {
                updateSeatCounter();
            } else {
                updateSeatCounter();
            }
        });
    





        

function showPopup(message) {
    document.getElementById('popupMessage').textContent = message;
    document.getElementById('customPopup').style.display = 'flex';
}


function closePopup() {
    document.getElementById('customPopup').style.display = 'none'; 
}





