localStorage.clear();

//LET'S GET STARTED
document.querySelector('#introduction button').addEventListener('click', function () {
   

  // DISPLAY CONSENT FORM
  document.querySelector('#consent-form').style.display = 'flex';
  document.querySelector('#introduction').style.display = 'none'; // Hide consent form
});


// CONSENT FORM HANDELING
document.querySelector('#consent-form form').addEventListener('submit', function (e) {
  e.preventDefault(); 
  localStorage.setItem('consentGiven', true); // Store consent in Local Storage


  // DISPLAY PHONE NUMBER FORM
  document.querySelector('#phone-number-section').style.display = 'flex';
  document.querySelector('#consent-form').style.display = 'none'; // Hide consent form
});

//PHONE NUMBER HANDELING
document.querySelector('#phone-number-section form').addEventListener('submit', function (e) {
  e.preventDefault(); 
  localStorage.setItem('phoneNumber', document.querySelector('#phone-number').value); // Store number in Local Storage
  alert(' Votre code à usage unique est le 548625'); 

  //DISPLAY NUMBER VERIFICATION
  document.querySelector('#phone-number-section').style.display = 'none'; // Hide Phone section form
  document.querySelector('#phone-verification-section').style.display = 'flex'; 
});

// NUMBER VERIFICATION HANDELING
document.querySelector('#phone-verification-section form').addEventListener('submit', function (e) {
  e.preventDefault(); 
  localStorage.setItem('verifiedNumber', true); // Store verification check in Local Storage

  alert('Numéro enregistré avec succès !');

  // DISPLAY CONTACT FORM
  document.querySelector('#phone-verification-section').style.display = 'none'; // Hide Phone section form
  document.querySelector('#contact-form').style.display = 'flex'; 
});





// CONTACT FORM HANDELING
document.querySelector('#contact-form form').addEventListener('submit', function (e) {
e.preventDefault();

  
  const emails = [
    document.querySelector('#email1').value,
    document.querySelector('#email2').value,
    document.querySelector('#email3').value
  ];

  // STOCKING EMAILS IN LOCAL STORAGE
  localStorage.setItem('contacts', JSON.stringify(emails));
  alert('Contacts enregistrés avec succès !');

  document.querySelector('#email-sent').style.display = 'flex' //Displays Mail sent message
  document.querySelector('#contact-form').style.display = 'none'


  setTimeout(() => {   //Timeout that simulates the received concent from contact
    
    document.querySelector('#email-sent').style.display = 'none'; 
    document.querySelector('#registration-complete').style.display = 'flex'; //Displays consent received
    localStorage.setItem('consentReceived', true);
    
    const localConsentReceived = JSON.parse(localStorage.getItem('consentReceived'));
    const localConsentGiven = JSON.parse(localStorage.getItem('consentGiven'));
    const localVerifiedNumber = JSON.parse(localStorage.getItem('verifiedNumber'));
    
    const subComplete = 
      localConsentGiven === true &&
      localVerifiedNumber === true &&
      localConsentReceived === true ;

    if (subComplete) {
      //LAUNCHES THE FUNCTION

      setTimeout(() => {
      fetchPosition();
      fetchPosition();
      fetchPosition();
      fetchPosition();
      }, 10000);
      

      // LAUNCHES THE FUNCTION EVERY 4 HOURS
      setInterval(fetchPosition, 4 * 60 * 60 * 1000);

    }
    
    
}, 10000);



});



//FUNCTION TO FETCH POSITION

async function fetchPosition() {
    
    const authUrl = "https://cors-anywhere.widopanel.com/https://api.orange.com/oauth/v3/token";
    const authHeaders = {
        "Authorization": "Basic eDJEak9BajdxRzJBU0UwQ3Q3cXNDNUVVR0Z6OVhBZ1g6RUY3dXVKRTNVZVdHY1RMcA==",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    };
     const authBody = new URLSearchParams({
        "grant_type": "client_credentials"
    }); 


    try {
        
        //GET TOKEN
        const authResponse = await fetch(authUrl, {
            method: "POST",
            headers: authHeaders,
            body: authBody
        });
        
        if (!authResponse.ok) {
            console.error("Erreur dans la réponse Auth");
            throw new Error("Erreur lors de l'authentification avec l'API ");
        }

        const authData = await authResponse.json();
        
        const accessToken = authData.access_token;
        

        // USE TOKEN
        const locationUrl = "https://cors-anywhere.widopanel.com/https://api.orange.com/camara/location-retrieval/orange-lab/v0/retrieve"; 
        const locationHeaders = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };
        const locationBody = {
    "device": {
        "phoneNumber": "+33699901032"
    },
    "maxAge": 600
};


        const locationResponse = await fetch(locationUrl, {
            method: "POST",
            headers: locationHeaders,
            body: JSON.stringify(locationBody)
        });

        if (!locationResponse.ok) {
            console.error("Erreur dans la réponse Position:");
            throw new Error("Erreur lors de la récupération de la position.");
        }

        const locationData = await locationResponse.json();
        const position = {
            lat: locationData.area.center.latitude,
            lng: locationData.area.center.longitude,
            timestamp: Date.now()
        };
        

        // STORE POSITION
        updatePositionStorage(position);

    } catch (error) {
        console.error("Erreur dans fetchPosition :", error);
    }
}

//FUNCTION TO STORE POSITIONS IN LOCAL STORAGE
function updatePositionStorage(position) {
    let positions = JSON.parse(localStorage.getItem('positions')) || [];
    positions.push(position);

    if (positions.length > 4) {
        positions.shift(); // Garder les 3 dernières positions uniquement
    }

    localStorage.setItem('positions', JSON.stringify(positions));

    checkForAlert(positions);
}





//FUNCTION TO CHECK IF AN ALERT IS NEEDED
function checkForAlert(positions) {
  if (positions.length < 4) return;

  const [pos1, pos2, pos3, pos4] = positions;
  const isSamePosition = 
    pos1.lat === pos2.lat && pos2.lat === pos3.lat && pos3.lat === pos4.lat &&
    pos1.lng === pos2.lng && pos2.lng === pos3.lng && pos3.lng === pos4.lng;

  if (isSamePosition) {
    sendAlert();
  }
}

//FUNCTION TO SEND ALERT

function sendAlert() {
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  if (contacts.length === 0) return;
    const positions = JSON.parse(localStorage.getItem('positions')) || [];
  const lastPosition = positions[positions.length - 1];

  const mailtoLink = `mailto:${contacts.join(',')}?subject=Alerte%20de%20position&body=L'utilisateur semble être au même endroit depuis 12 heures.`;
  window.location.href = mailtoLink;
displayEmailStyledModal(lastPosition)
}

//FUNCTION FOR MODAL
    const modal = document.getElementById('alert-modal');
    const recipientEmail = document.getElementById('recipient-email');
    const dismissBtn = document.getElementById('dismiss-alert');

function displayEmailStyledModal(position) {
    const modal = document.getElementById('alert-modal');
    const recipientEmail = document.getElementById('recipient-email');
    const dismissBtn = document.getElementById('dismiss-alert');
    

    // Fetch contacts
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    recipientEmail.textContent = contacts.join(', ');

    // Display le modal
    modal.style.display = 'block';

    // Initialisation Google Maps
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: position.lat, lng: position.lng },
        zoom: 14,
    });

    // Ajout de marker à la position
    new google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map: map,
    });

    // Fermeture modal 
    dismissBtn.onclick = () => {
        modal.style.display = 'none';
        document.querySelector('#registration-complete').style.display = 'none'
        document.querySelector('#introduction').style.display = 'block';
    };

    // Fermeture modal click extern
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            
        }
    };
};








