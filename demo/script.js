import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, set, get, ref, update, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyCWQVuTUprKnW27a_oW8YoAFvaBCTllDFE",
    authDomain: "newproject-e0068.firebaseapp.com",
    projectId: "newproject-e0068",
    storageBucket: "newproject-e0068.appspot.com",
    messagingSenderId: "180372308985",
    appId: "1:180372308985:web:f3f587adb223a75c743328",
    measurementId: "G-4287YTZT0V"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
    const db = getDatabase(app)
console.log(db)

function writeUserData(userID, firstname, lastname, email){
    //create a reference/points to 'user/{userID} and set the data (name and email)
    set(ref(db,'user/'+userID),{
        firstname: firstname,
        lastname: lastname,
        email: email

    });
}
// Making writeUserData available globally for HTML onclick
window.writeUserData = function() {
    const userID = document.getElementById('create-id').value;
    const firstname = document.getElementById('create-name').value;
    const lastname = document.getElementById('create-last').value;
    const email = document.getElementById('create-email').value;
    if (userID && firstname && lastname && email){
        writeUserData(userID, firstname, lastname, email);
        alert("Data sent successfully");

        document.getElementById('create-id').value='';
        document.getElementById('create-name').value='';
        document.getElementById('create-last').value='';
        document.getElementById('create-email').value='';
    }else{
        alert("Please fill all the fields.")
    }
};


//ref(db,'user') points to the user path.
//get(userRef) gets the data at that path.
//snapshot.forEach(...) loops over each child node(each user).
//childsnapshot.val() gives the actual data (name and email), which is printed. 

function readUser() {
    const userRef = ref(db, 'user');
    const userList = document.getElementById('user-list');
    userList.innerHTML = ""; 

    get(userRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();

            const listItem = document.createElement('li');
            listItem.textContent =
                `ID: ${childSnapshot.key}, ` +
                `Firstname: ${data.firstname}, ` +
                `Lastname: ${data.lastname}, ` +
                `Email: ${data.email}`;

            userList.appendChild(listItem);  
        });
    });
}
window.readUser = readUser;

// Function to handle update form submission
function updateUserFromForm() {
    const userID = document.getElementById('update-id').value;
    const firstname = document.getElementById('update-name').value;
    const lastname = document.getElementById('update-last').value;
    const email = document.getElementById('update-email').value;
    // Build update data object with only non-empty fields
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (userID && Object.keys(updateData).length > 0) {
        const userRef = ref(db, 'user/'+userID)
        update(userRef, updateData);
        // Clear the form after update
        document.getElementById('update-id').value = '';
        document.getElementById('update-name').value = '';
        document.getElementById('update-last').value = '';
        document.getElementById('update-email').value = '';
    } else {
        alert('Please provide a user ID and at least one field to update');
    }
}
window.updateUserFromForm = updateUserFromForm;


//deleting userData
function deleteUserData(userID){
    if(!userID){
        alert("please enter a valid User ID.");
        return;
    }
    const userRef = ref(db,'user/'+userID);
    get(userRef).then((snapshot)=>{
        if (snapshot.exists()){
            remove(userRef).then(()=>{
                alert("User deleted successfully.");
                document.getElementById('delete-id').value='';
            }).catch((error)=>{
                alert("Error deleting user:"+ error.message);
            });
        }else{
            alert("User not found.")
        }
    });
}
window.deleteUserData = deleteUserData;