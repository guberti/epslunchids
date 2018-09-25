var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        var storage = window.localStorage;
        var lunchCode = storage.getItem("lunchCode");
        if (lunchCode === null) {
            this.initLogin();
        } else {
            this.initCard(lunchCode);
        }
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        console.log("Got here");
    },

    initLogin: function() {
        document.getElementById("main").style.display = "none";
    },

    initCard: function(lunchCode) {
        document.getElementById("login").style.display = "none";

        // Determine a good barcode width
        JsBarcode("#barcode", lunchCode);
        setupImage(window.localStorage.getItem("hashedName"));
    },
};

app.initialize();

function login() {
    var data = new FormData();
    // Remove @eastsideprep.org
    var cleanedUsername = username.value.split("@")[0];
    data.append('username', cleanedUsername);
    data.append('password', password.value);

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log(xhr.responseText);
        result = JSON.parse(xhr.responseText);
        if (xhr.status==200) {
          window.localStorage.setItem("lunchCode", result['code']);
          var hashedName = result['photo'].split("/")[2];
          window.localStorage.setItem("hashedName", hashedName);
          location.reload();
        }
      }
    }
    xhr.open("POST", "https://www.epschedule.com/lunchid", true);
    xhr.send(data);
}

function setupImage(hashedName) {
    var storedImage = window.localStorage.getItem("photo");
    var frame = document.getElementById("studentPhoto");
    console.log("Setting up image");
    if (storedImage) {
        frame.setAttribute("src", storedImage);
    } else {
        console.log("Getting image");
        frame.addEventListener("load", function() {
            console.log("Image loaded");
            var imgCanvas = document.createElement("canvas");
            var imgContext = imgCanvas.getContext("2d");

            imgCanvas.width = frame.width;
            imgCanvas.height = frame.height;
            imgContext.drawImage(frame, 0, 0, frame.width, frame.height);

            window.localStorage.setItem("photo", imgCanvas.toDataURL("image/png"));

        }, false);
        frame.setAttribute("src", "https://www.epschedule.com/school_photos/" + hashedName);
    }
}

function checkSubmit(e) {
    if (e && e.keyCode === 13) {
        login();
    }
}