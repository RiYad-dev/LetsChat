var firebaseConfig = {
  apiKey: "AIzaSyBLS9bhplKpvlkiUCawTNKaoExxHszAEWA",
  authDomain: "let-s-chat-944aa.firebaseapp.com",
  databaseURL: "https://let-s-chat-944aa-default-rtdb.firebaseio.com",
  projectId: "let-s-chat-944aa",
  storageBucket: "let-s-chat-944aa.appspot.com",
  messagingSenderId: "782080241186",
  appId: "1:782080241186:web:8a0485828114677dce247b",
  measurementId: "G-6J79HX0XVH"
};
// Initialize Firebase

var user_uid = localStorage.getItem("uid");
firebase.initializeApp(firebaseConfig);
var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

function setPreset() {
  firebase.database().ref("users/" + user_uid).on('value', function (snapshot) {
    var details = snapshot.val();
    first_name = details.first_name;
    last_name = details.last_name;
    full_name = details.full_name;
    email = details.email;
    localStorage.setItem("full_name", full_name);
    document.getElementById("User_name").innerText = "Welcome " + first_name + "!";
    document.getElementById("disp_first_name").innerText = "First Name: " + first_name;
    document.getElementById("disp_last_name").innerText = "Last Name: " + last_name;
    document.getElementById("disp_full_name").innerText = "Full Name: " + full_name;
    document.getElementById("disp_email").innerText = "E-mail Id: " + email;
  });
  if (isMobile.any()) {
    document.getElementById("room_name_input").style.width = "265px";
  } else {
    document.getElementById("rooms_output").style.width = "75%";
    document.getElementById("room_name_input").style.width = "350px";
  }
  firebase.database().ref("users/" + user_uid + "/recentrooms").on('value', function (snapshot) {
    document.getElementById("rooms_output").innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();
      firebase_message_id = childKey;
      message_data = childData;
      Room_Name = message_data['room_name'];
      document.getElementById("rooms_output").innerHTML += "<hr><div class='display_room_name'><h4><a data-id='" + Room_Name + "' onclick='goToRoom(this)'>" + Room_Name + "<a/></h4></div>";
    });
  });
}
function goToRoom(self) {
  var room_name_msg = self.getAttribute("data-id");
  localStorage.setItem("room_name", room_name_msg);
  window.location.replace("lets_chat_page.html");
}
function addRoom() {
  if (document.getElementById("room_name_input").value.length == 0) {
    document.getElementById("room_name_input").placeholder = "Please enter a room name!";
  } else {
    room_name = document.getElementById("room_name_input").value;
    firebase.database().ref("rooms/").child(room_name).update({
      purpose: "adding room"
    });
    firebase.database().ref("users/" + user_uid + "/recentrooms").child(room_name).update({
      room_name: room_name
    });
    localStorage.setItem("room_name", room_name);
    window.location.replace("lets_chat_page.html");
  }
}

function logout() {
  localStorage.removeItem("User_Name");
  localStorage.removeItem("uid");
  localStorage.removeItem("full_name");
  window.location.replace("index.html");
}