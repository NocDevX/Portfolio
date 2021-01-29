

// FireBase ConfigFile
var firebaseConfig = {
  apiKey: "AIzaSyAJWyK6BpYI9wJahiZn7O7Emr-KJ3Al70A",
  authDomain: "easywashpj01.firebaseapp.com",
  projectId: "easywashpj01",
  databaseURL: "easywashpj01-default-rtdb.firebaseio.com/",
  storageBucket: "easywashpj01.appspot.com",
  messagingSenderId: "1061201161314",
  appId: "1:1061201161314:web:a724f5e4d7088e35cd753b",
  measurementId: "G-363MV180HH"
};

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set Database and refs
const database = firebase.database();
const dbMainFolder = database.ref().orderByKey();
const table = document.querySelector('tbody');

// Main Function;
const deviceTable = (new Promise((resolve, reject) => {
  // Get keys and values from db;
  dbMainFolder.once('value', snapshot => {
    for (let [key, value] of Object.entries(snapshot.val())) {
      const tr = document.createElement('tr');
      const tableDataArray = [value.deviceId || key, value.status || "Unavailable", value.updateFlag, value.uploadFolder];

      // Loop and create td based on array length;
      for (let i = 0; i < tableDataArray.length; i++) {
        const td = document.createElement('td'); td.classList.add('td');
        const tdText = document.createTextNode(tableDataArray[i])
        td.appendChild(tdText); tr.appendChild(td); table.appendChild(tr);

        if (tdText.textContent.toLowerCase() == 'offline') { td.style.color = '#ef233c'; td.textContent = "Offline" }
        else if (td.textContent.toLowerCase() == 'online') { td.style.color = '#29bf12'; td.textContent = "Online" }
        else if (td.textContent.toLowerCase() == 'unavailable') { td.style.color = '#bbb'; }

        if (tdText.textContent == '1') { td.style.color = '#faa307'; }
        else if (td.textContent == '0') { td.style.color = '#29bf12'; }
      }

      const td = document.createElement('td'); td.setAttribute('device', key);
      const tdText = document.createTextNode('Update'); td.classList.add('update-btn')

      td.appendChild(tdText); tr.appendChild(td);
      table.appendChild(tr);
    }
    resolve(updateStatus())
    reject(reject => alert(`Error : ${reject}`))
  });
})
)

// Calls update only on selected Device;
function updateStatus() {
  document.querySelectorAll('[device]').forEach(btn =>
    btn.onclick = () => updateFlag(btn.getAttribute('device')))
}


// Update all flags or Selected ones and "refresh" the page; 
function updateFlag(device = '') {
  if (device) {
    database.ref(`${device}/updateFlag`).set(1);
    window.location.href = window.location.pathname + window.location.search + window.location.hash;
  }
  else {
    dbMainFolder.once('value', snapshot => {
      for (let [key] of Object.entries(snapshot.val())) {
        database.ref(`${key}/updateFlag`).set(0);
      }
      window.location.href = window.location.pathname + window.location.search + window.location.hash;
    });
  }
}

function favIconChange() {
  document.querySelector('.fa-chevron-circle-up').style.display = 'none';
  document.querySelector('.loading').innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
}