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

room_name = localStorage.getItem("room_name");
user_uid = localStorage.getItem("uid");
full_name = localStorage.getItem("full_name");
email= localStorage.getItem("email");

// important
weblink = "https://riyad-dev.github.io/LetsChat/"; // add your website link in the blank (like - https://yourwebsite.com/) include forward slash at end.

uncoded_link = weblink + "index.html?m=2&r=" + room_name;
generated_link = encodeURI(weblink + "index.html?m=2&r=") + room_name;

function scrolltoBottom() {
  var objDiv = document.getElementById("output");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function send() {
  if (document.getElementById("msg").value.length == 0) {
    document.getElementById("msg").placeholder = "Please enter a message!";
  } else {
    msg = document.getElementById("msg").value;
    firebase.database().ref("rooms/" + room_name).child("messages").push({
      name: user_name,
      email: email,
      message: msg
    });
    document.getElementById("msg").value = "";
  }
  if (isMobile.any()) {
    document.getElementById("output").style.maxHeight = "568px";
    document.getElementById("output").style.minHeight = "568px";
  }
}

function logout() {
  localStorage.removeItem("room_name");
  window.location.replace("room.html");
}

function getData() {
  document.getElementById("dispRoom").innerHTML = room_name;
  firebase.database().ref("users/" + user_uid).on('value', function (snapshot) {
    var details = snapshot.val();
    user_name = details.first_name;
  });
  firebase.database().ref("rooms/" + room_name + "/messages").on('value', function (snapshot) {
    document.getElementById("output").innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();
      firebase_message_id = childKey;
      message_data = childData;
      Name = message_data['name'];
      Email = message_data['email'];
      Message = message_data['message'];
      if (Email == email) {
        document.getElementById("output").innerHTML += "<hr><div class='alignright'>" + "<h4>" + Message + "</h4><button data-id='" + firebase_message_id + "'class='btn btn-danger deletebtn' onclick='deletemsg(this);'>Delete</button></div>";
      } else {
        document.getElementById("output").innerHTML += "<hr><div class='alignleft'>" + "<h4><font color= 'grey'>" + Name + ": " + "</font>" + Message + "</h4></div>";
      }
      scrolltoBottom();
    });
  });
  firebase.database().ref("rooms/" + room_name + "/people").on('value', function (snapshot) {
    document.getElementById("people_output").innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      childKey1 = childSnapshot.key;
      childData1 = childSnapshot.val();
      firebase_message_id = childKey1;
      message_data = childData1;
      user_param = message_data['user_uid'];
      firebase.database().ref("users/" + user_param).on('value', function (snapshot) {
        var info = snapshot.val();
        user_full_name = info.full_name;
        user_status = info.status;
        uuserr_uiid = info.uid;
        if (uuserr_uiid == user_uid && user_status == "online") {
          document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + " (You)" + "</h4><h4 class='online_h4'>" + user_status + "</h4></div>";
        } else if (uuserr_uiid == user_uid && user_status == "offline") {
          document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + " (You)" + "</h4><h4 class='offline_h4'>" + user_status + "</h4></div>";
        } else if (user_status == "online") {
          document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + "</h4><h4 class='online_h4'>" + user_status + "</h4></div>";
        } else if (user_status == "offline") {
          document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + "</h4><h4 class='offline_h4'>" + user_status + "</h4></div>";
        }
      });
    });
  });
  firebase.database().ref("users/").on('child_changed', function () {
    firebase.database().ref("rooms/" + room_name + "/people").on('value', function (snapshot) {
      document.getElementById("people_output").innerHTML = "";
      snapshot.forEach(function (childSnapshot) {
        childKey1 = childSnapshot.key;
        childData1 = childSnapshot.val();
        firebase_message_id = childKey1;
        message_data = childData1;
        user_param = message_data['user_uid'];
        firebase.database().ref("users/" + user_param).on('value', function (snapshot) {
          var info = snapshot.val();
          user_full_name = info.full_name;
          user_status = info.status;
          uuserr_uiid = info.uid;
          if (uuserr_uiid == user_uid && user_status == "online") {
            document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + " (You)" + "</h4><h4 class='online_h4'>" + user_status + "</h4></div>";
          } else if (uuserr_uiid == user_uid && user_status == "offline") {
            document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + " (You)" + "</h4><h4 class='offline_h4'>" + user_status + "</h4></div>";
          } else if (user_status == "online") {
            document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + "</h4><h4 class='online_h4'>" + user_status + "</h4></div>";
          } else if (user_status == "offline") {
            document.getElementById("people_output").innerHTML += "<hr><div class='divDispPpl' id='people_" + uuserr_uiid + "'><h4 class='message_h4'>" + user_full_name + "</h4><h4 class='offline_h4'>" + user_status + "</h4></div>";
          }
        });
      });
    });
  });
}
getData();
function deletemsg(self) {
  var message_Id = self.getAttribute("data-id");
  firebase.database().ref("rooms/" + room_name + "/messages").child(message_Id).remove();
}

var msg = uncoded_link
document.getElementById("myInput").value = msg;

function myFunction() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

function shareWhatsapp() {
  message_for_whatsapp = "Hi, I am online on Let's Chat. Join my room now: " + generated_link;
  if (isMobile.any()) {
    window.open("whatsapp://send?text=" + message_for_whatsapp);
  } else {
    window.open("https://web.whatsapp.com://send?text=" + message_for_whatsapp);
  }
}

function preset() {
  firebase.database().ref("users/" + user_uid).update({
    status: "online"
  });
  firebase.database().ref("rooms/" + room_name + "/people").child(full_name + user_uid).update({
    user_uid: user_uid
  });
  if (isMobile.any()) {
    return;
  } else {
    document.getElementById("logout1").style.marginRight = "409px";
    document.getElementById("btnSend").style.width = "140px";
    document.getElementById("msg").style.width = "885px";
    document.getElementById("output").style.minHeight = "578px";
    document.getElementById("output").style.width = "90%";
    document.getElementById("Div_msg").style.width = "90%";
    document.getElementById("Div_info").style.width = "90%";
    document.getElementById("msg").focus();
  }
}
function setPresence() {
  firebase.database().ref("users/" + user_uid).update({
    status: "offline"
  });
}
if (isMobile.any()) {
  document.getElementById("msg").onclick = function () {
    document.getElementById("output").style.maxHeight = "318px";
    document.getElementById("output").style.minHeight = "318px";
    scrolltoBottom();
  };
} else {
  var input = document.getElementById("msg");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("btnSend").click();
    }
  });
}