(function() {
    //NOTE: ES5 chosen instead of ES6 for compatibility with older mobile devices
    var now, dd, td;
    var lat, lon, gd, gpsbutton;
    var weatherurl, wd, icon;
    var temperaturescale = "F"; //set to F or C (fahrenheit or celsius)
    var usephp = true; // set to true to use a php document to hide your api key
    var locationRequested = false;
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var sunsettime = 0;
    var sunrisetime = 0;
    var iconurl = "https://openweathermap.org/img/w/";
    var weatherminute;

    document.addEventListener("DOMContentLoaded", init, false);
    function init(){
        dd = document.getElementById("date");
        td = document.getElementById("time");
        wd = document.getElementById("weather");
        gd = document.getElementById("gps");
        icon = document.getElementById("icon");
        weatherminute = randRange(0,14);
        gpsbutton = document.getElementById("gpsbutton");
        gpsbutton.addEventListener("click",getLocation,false);
        updateTime();
        setInterval(updateTime,1000);
    }
    function updateTime(){
        var clockdata = getClockStrings();
        dd.innerHTML = clockdata.datehtml;
        td.innerHTML = clockdata.timehtml;
        dd.dateTime = now.toISOString();
        td.dateTime = now.toISOString();
        var sec = now.getSeconds();
        var minutes = now.getMinutes();
        if (locationRequested && sec === 0){
            checkForSunset(); //checks for sunset once each minute
            if (minutes % 15 === weatherminute){
                getWeather(); //get weather every 15 minutes
                //weatherminute is a random number between
                //0 and 14 to ensure that users don't all hit
                //the API at the same minute
            }
            if (minutes % 5 === 0){
                getLocation(); //get location every 5 minutes while the app is running
            }
        }
    }
    function getClockStrings(){
        now = new Date();
        var year = now.getFullYear();
        var month = months[now.getMonth()];
        var date = now.getDate();
        var day = days[now.getDay()];
        var hour = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var meridian = hour < 12 ? "AM" : "PM";
        var clockhour = hour > 12 ? hour - 12 : hour;
        if (hour === 0) {clockhour = 12;}
        var clockminutes = minutes < 10 ? "0" + minutes : minutes;
        var clockseconds = seconds < 10 ? "0" + seconds : seconds;
        var datehtml = day + ", " + month + " " + date + ", " + year;
        var timehtml = clockhour + ":" + clockminutes + "<span>:" + clockseconds + " " + meridian + "</span>";
        return {"datehtml":datehtml,"timehtml":timehtml};
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition,geoError);
        }else{
            gd.innerHTML = "location unknown";
            locationRequested = false;
        }
    }
    function geoError(){
        gd.innerHTML = "location unknown";
    }
    function showPosition(position) {
        gpsbutton.style.display = "none";
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        gd.innerHTML = "GPS: " + lat.toFixed(2) + " | " + lon.toFixed(2);

        if (!locationRequested){
            getWeather();
            locationRequested = true;
        }
    }
    function getWeather(){
        //get the weather object from the Netifly server function
    }
    function convertTemperature(kelvin){
        //converts temps in kelvin to celsius or fahrenheit
        var celsius = (kelvin - 273.15);
        return temperaturescale === "F" ? celsius * 1.8 + 32 : celsius;
    }
    function processWeather(data){
        var weather = data["weather"][0];
        icon.src = iconurl + weather.icon + ".png";
        icon.style.opacity = 1;
        var localtemperature = convertTemperature(data["main"].temp).toFixed(0);
        var weatherstring = localtemperature + "°" + temperaturescale + "&nbsp;&nbsp;" + weather.description;
        wd.innerHTML = weatherstring;
        sunsettime = Number(data["sys"].sunset);
        sunrisetime = Number(data["sys"].sunrise);
        checkForSunset();
    }

    function checkForSunset(){
        var nowtime = now.getTime()/1000;
        //changes the presentation style if the time of day is after sunset
        //or before the next day's sunrise
        var isDark = nowtime > sunsettime || nowtime < sunrisetime;
        document.getElementById("container").className = isDark ? "nightmode" : "daymode";
        //uncomment the following if you want santa mode
        // if (now.getMonth() === 11 && now.getDate() <= 31){
        //   document.getElementById("container").className = "santamode";
        // }
    }
//random number utility function
    function randRange(min, max) {
        return Math.floor(Math.random()*(max-min+1))+min;
    }
})();