/*const firebaseConfig = {
  apiKey: "AIzaSyBB5YpfLsp9g2iqNcj1oGqpQ4-zq2ghVsM",
  authDomain: "cadastro-411de.firebaseapp.com",
  databaseURL: "https://cadastro-411de-default-rtdb.firebaseio.com",
  projectId: "cadastro-411de",
  storageBucket: "cadastro-411de.appspot.com",
  messagingSenderId: "279976171170",
  appId: "1:279976171170:web:caa77af161cfb3eca329fb",
  measurementId: "G-KJ7JK4LDPP"
};*/

const firebaseConfig = {
  apiKey: "AIzaSyD0__2tCTlEQhwv3GwtxU9bBy7dJTz4GCE",
  authDomain: "etec-de4d0.firebaseapp.com",
  databaseURL: "https://etec-de4d0-default-rtdb.firebaseio.com",
  projectId: "etec-de4d0",
  storageBucket: "etec-de4d0.appspot.com",
  messagingSenderId: "3231346956",
  appId: "1:3231346956:web:41135319866475df7c1929",
  measurementId: "G-XDNPFXL9G7"
};
/*
const firebaseConfig = {
  apiKey: "AIzaSyB0CLDzjszZgzppgnMVbpiQ-AORyhhsci0",
  authDomain: "test123-326b8.firebaseapp.com",
  databaseURL: "https://test123-326b8-default-rtdb.firebaseio.com",
  projectId: "test123-326b8",
  storageBucket: "test123-326b8.appspot.com",
  messagingSenderId: "268644934542",
  appId: "1:268644934542:web:9996af49a8c45a19bb7adf",
  measurementId: "G-7XPMEPLHPY"
};*/
firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();
const db = firebase.firestore();
var storage = firebase.storage();