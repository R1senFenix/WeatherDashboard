$(document).ready(function () {

    if (typeof recentSearches === 'undefined') {
        var recentSearches = [];
        console.log(recentSearches);
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    } else {
        var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
        console.log(recentSearches);
    }

    for (var i = 0; i < recentSearches.length; i++) {

        var createNewOption = $("<option>");
        createNewOption.addClass("autoOption");
        createNewOption.attr("id", recentSearches[i]);
        createNewOption.attr("value", recentSearches[i]);
        $(createNewOption).text(recentSearches[i]);
        console.log(recentSearches[i]);
    }
    $("#recent-search-list").append(createNewOption);

    $("#show-forcast-btn").click(function () {
        $(".current-date").css('visibility', 'hidden');
        $(".forcast-date").css('visibility', 'visible');
    });

    $("#show-today-btn").click(function () {
        $(".current-date").css('visibility', 'visible');
        $(".forcast-date").css('visibility', 'hidden');
    });

    // get the search input
    $('.submit-btn').click(function () {
        event.preventDefault();
        $('main-container').text("")
        var searchForCity = $('.search-for-city').val();
        console.log(searchForCity);
        var searchForCountry = $('.search-for-country').val();
        var searchForBoth = searchForCity + "," + searchForCountry;
        saveLocal(searchForBoth);
        searchWeather(searchForBoth);
        console.log(searchForBoth);



    });

    //Calls the ajax
    function searchWeather(searchForBoth) {
        //Gets Today Response
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchForBoth + '&APPID=9281dbe33d6371c2c8b80f96b4c64d8b&mode=json',
            method: "GET",
            id: 2643741,
            dataType: "json",
        }).then(function (response) {
            console.log(response);
            fillOutToday(response);
        });

        //gets Forcast Response
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + searchForBoth + '&APPID=9281dbe33d6371c2c8b80f96b4c64d8b&mode=json',
            method: "GET",
            id: 2643741,
            dataType: "json",
        }).then(function (response) {
            console.log(response);
            fillOutForecast(response);
        });
    }

    function saveLocal(searchForBoth) {
        recentSearches.push(searchForBoth);
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }

    function fillOutToday(response) {

        $(".current-date").css('visibility', 'visible');

        // CITY get and fillout on page
        var searchForCity2 = $('.search-for-city').val();
        $("#entered-city-value").html(searchForCity2);

        // DATE get and post to page
        var todayDate = new Date();

        var today = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate();
        console.log(today);
        $('#todays-date').html(today);

        // ICON get and post to page
        var todaysIcon = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + todaysIcon + ".png";
        $('#todays-cond-icon').attr('src', iconurl);

        //HUMIDITY get and post to page
        var todayHumid = response.main.humidity;
        console.log(todayHumid);
        $('#todays-humid').html(todayHumid + " Humidity");

        //WIND SPEED get and post to page
        var todayWSpeed = response.wind.speed;
        console.log(todayWSpeed);
        $('#todays-wind-speed').html(todayWSpeed + " Wind Speed");

        // TEMPERATURE get and post to page 
        var todayTemp = response.main.temp;
        console.log(todayTemp);
        var fahrTemp = parseInt(((1.8 * (todayTemp - 273)) + 32));
        console.log(fahrTemp);
        $('#todays-temp').html(fahrTemp + " Fahrenheit");

        var todayLon = response.coord.lon;
        console.log(todayLon);
        var todayLat = response.coord.lat;
        console.log(todayLat);
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/uvi?&lat=' + todayLat + '&lon=' + todayLon + '&appid=9281dbe33d6371c2c8b80f96b4c64d8b&mode=json',
            method: "GET",
            id: 2643741,
            dataType: "json",
        }).then(function (response) {
            console.log(response);
            UVColorization(response);
        });

    }

    function fillOutForecast(response) {
        var futureDay = 1;
        for (var i = 4; i < response.list.length; i += 8) {

            // DATE get and post to page
            var forcastDate = response.list[i].dt_txt;
            $('#day' + futureDay + '-date').html(forcastDate);

            // ICON get and post to page
            var forcastIcon = response.list[i].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + forcastIcon + ".png";
            $('#day' + futureDay + '-cond-icon').attr('src', iconurl);
            $('#day' + futureDay + '-cond-icon').attr('style', 'display: inline');

            //HUMIDITY get and post to page
            var forcastHumid = response.list[i].main.humidity;
            $('#day' + futureDay + '-humid').html(forcastHumid + " Humidity");


            // TEMPERATURE get and post to page 
            var forcastTemp = response.list[i].main.temp;
            var forcastfahrTemp = parseInt(((1.8 * (forcastTemp - 273)) + 32));
            $('#day' + futureDay + '-temp').html(forcastfahrTemp + " Fahrenheit");


            futureDay++;
        }
    }

    function UVColorization(response) {
        var UVIndex = response.value;
        console.log(UVIndex);

        if (UVIndex > 10) {
            $('#todays-uv').html("Extreme");
            $('.ultraviolet').attr('style', 'background-color: violet');
        } else if (UVIndex > 8 && UVIndex <= 10) {
            $('#todays-uv').html("Very High");
            $('.ultraviolet').attr('style', 'background-color: red');
        } else if (UVIndex > 6 && UVIndex <= 8) {
            $('#todays-uv').html("High");
            $('.ultraviolet').attr('style', 'background-color: orange');
        } else if (UVIndex > 3 && UVIndex <= 6) {
            $('#todays-uv').html("Moderate");
            $('.ultraviolet').attr('style', 'background-color: yellow');
        } else if (UVIndex > 0 && UVIndex < 3) {
            $('#todays-uv').html("Low");
            $('.ultraviolet').attr('style', 'background-color: green');
        }
    }

});