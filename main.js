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

var url_string = window.location.href;
var url = new URL(url_string);
var m = url.searchParams.get("m");
var r = url.searchParams.get("r");
const auth = firebase.auth();
const database = firebase.database();

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

function setTexts() {
  if (m == 2) {
    document.getElementById("head3").innerText = "Please Login/Register";
    document.getElementById("head4").innerText = "You will be redirected to the room";
  } else {
    document.getElementById("head3").innerText = "Chat with your friends, family, class and more!";
  }
  if (isMobile.any()) {
    document.getElementById("header1").style.marginTop = "65px";
  } else {
    document.getElementById("htmloffp").style.overflowY = "hidden";
    document.getElementById("htmloffp").style.maxWidth = "100%";
    document.getElementById("bodyoffp").style.overflowY = "hidden";
    document.getElementById("bodyoffp").style.maxWidth = "100%";
  }
}
function registertxt() {
  document.getElementById("head_log").innerText = "Register";
  document.getElementById("logreg").innerHTML = "<input type='text' placeholder='First Name' id='first_name_input' class='form-control'><input type='text' placeholder='Last Name' id='last_name_input' class='form-control martop'><input type='email' placeholder='E-mail' id='email_input' class='form-control martop'><input type='password' placeholder='Password' id='password_input' class='form-control martop'><h4 class='cryacc' id='account_reg'>Already have an account? <a onclick= 'logintxt();' class='crtacc'>Try logging in</a></h4><button id='login_button' class='btn btn-primary btlogin' onclick='Register();'>Register</button>";
  document.getElementById("div_logreg").style.height = "475px";
  document.getElementById("alert_warning").innerHTML = "";
  document.getElementById("alert_success").innerHTML = "";
}
function logintxt() {
  document.getElementById("head_log").innerText = "Login";
  document.getElementById("logreg").innerHTML = "<input type='email' placeholder='E-mail' id='email_input' class='form-control'><input type='password' placeholder='Password' id='password_input' class='form-control martop'><h4 class='cryacc' id='account_reg'>Don't have an account? <a onclick= 'registertxt();' class='crtacc'>Create one</a></h4><button id='login_button' class='btn btn-primary btlogin' onclick='Login();'>Login</button>";
  document.getElementById("div_logreg").style.height = "400px";
  document.getElementById("alert_warning").innerHTML = "";
  document.getElementById("alert_success").innerHTML = "";
}
function Register() {
  email = document.getElementById("email_input").value;
  password = document.getElementById("password_input").value;
  first_name = document.getElementById("first_name_input").value;
  last_name = document.getElementById("last_name_input").value;

  document.getElementById("alert_warning").innerHTML = "";
  document.getElementById("alert_success").innerHTML = "";
  document.getElementById("div_logreg").style.height = "475px";

  if (first_name.length == 0) {
    document.getElementById("first_name_input").placeholder = "Please enter your First Name!";
    return;
  } if (last_name.length == 0) {
    document.getElementById("last_name_input").placeholder = "Please enter your Last Name!";
    return;
  } else if (email.length == 0) {
    document.getElementById("email_input").placeholder = "Please enter an E-mail Id!";
    return;
  } else if (password.length == 0) {
    document.getElementById("password_input").placeholder = "Please enter a Password!";
    return;
  } else if (validate_email(email) == false) {
    document.getElementById("email_input").value = "";
    document.getElementById("email_input").placeholder = "Please enter a valid E-mail!";
    return;
  } else if (validate_password(password) == false) {
    document.getElementById("password_input").value = "";
    document.getElementById("password_input").placeholder = "The password must be 6 characters long or more!";
    return;
  } else {
    auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
        var user = auth.currentUser;
        var database_ref = database.ref();

        var user_data = {
          email: email,
          first_name: first_name,
          last_name: last_name,
          full_name: first_name + " " + last_name,
          uid: user.uid,
          status: "offline"
        }
        localStorage.setItem("email", email);
        database_ref.child("users/" + user.uid).set(user_data);
        document.getElementById("div_logreg").style.height = "500px";
        document.getElementById("alert_warning").innerHTML = "";
        document.getElementById("alert_success").innerHTML = "Register successful!";
        setTimeout(() => {
          if (m == 2) {
            window.location.replace("lets_chat_page.html");
            localStorage.setItem("uid", user.uid);
            localStorage.setItem("room_name", r);
          } else {
            window.location.replace("room.html");
            localStorage.setItem("uid", user.uid);
          }
        }, 1000);
      })
      .catch(function (error) {
        var error_message = error.message;
        if (error_message == "The email address is already in use by another account.") {
          document.getElementById("alert_warning").innerHTML = "The email address is already in use by another account, try <a onclick= 'logintxt();' class='crtaaccc'>logging in</a>.";
        } else {
          document.getElementById("alert_warning").innerHTML = error_message;
        }
        if (error_message.length > 51) {
          document.getElementById("div_logreg").style.height = "515px";
        } else {
          document.getElementById("div_logreg").style.height = "460px";
        }
      });
    return;
  }
}
function Login() {
  email = document.getElementById("email_input").value;
  password = document.getElementById("password_input").value;

  document.getElementById("alert_warning").innerHTML = "";
  document.getElementById("alert_success").innerHTML = "";
  document.getElementById("div_logreg").style.height = "400px";

  if (email.length == 0) {
    document.getElementById("email_input").placeholder = "Please enter an E-mail Id!";
    return;
  } else if (password.length == 0) {
    document.getElementById("password_input").placeholder = "Please enter a Password!";
    return;
  } else if (validate_email(email) == false) {
    document.getElementById("email_input").value = "";
    document.getElementById("email_input").placeholder = "Please enter a valid E-mail!";
    return;
  } else if (validate_password(password) == false) {
    document.getElementById("password_input").value = "";
    document.getElementById("password_input").placeholder = "The password must be 6 characters long or more!";
    return;
  } else {
    auth.signInWithEmailAndPassword(email, password)
      .then(function () {
        var user = auth.currentUser;
        localStorage.setItem("email", email);
        document.getElementById("div_logreg").style.height = "425px";
        document.getElementById("alert_warning").innerHTML = "";
        document.getElementById("alert_success").innerHTML = "Login successful!";
        setTimeout(() => {
          if (m == 2) {
            window.location.replace("lets_chat_page.html");
            localStorage.setItem("uid", user.uid);
            localStorage.setItem("room_name", r);
          } else {
            window.location.replace("room.html");
            localStorage.setItem("uid", user.uid);
          }
        }, 1000);
      })
      .catch(function (error) {
        var error_message = error.message;
        if (error_message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
          document.getElementById("alert_warning").innerHTML = "No such E-mail Id exists, try <a onclick= 'registertxt();' class='crtaaccc'>registering</a>.";
        } else if (error_message == "The password is invalid or the user does not have a password.") {
          document.getElementById("alert_warning").innerHTML = "The password entered is invalid!";
        } else {
          document.getElementById("alert_warning").innerHTML = error_message;
        }
        if (error_message.length > 51) {
          document.getElementById("div_logreg").style.height = "440px";
        } else {
          document.getElementById("div_logreg").style.height = "425px";
        }
      });
  }
}
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    return true;
  } else {
    return false;
  }
}

function validate_password(password) {
  if (password.length < 6) {
    return false;
  } else {
    return true;
  }
}