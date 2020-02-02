$(document).ready(function () {

    if (typeof Searches == 'undefined') {
        var recentSearches = [];
        console.log(recentSearches);
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
        saveLocal(searchForCity);
        searchWeather(searchForBoth);
        console.log(searchForBoth);



    });

    //Calls the ajax
    function searchWeather(searchForBoth) {
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + searchForBoth + '&APPID=9281dbe33d6371c2c8b80f96b4c64d8b&mode=json',
            method: "GET",
            id: 2643741,
            dataType: "json",
        }).then(function (response) {
            console.log(response);
            fillOutToday(response);
            fillOutForecast(response);
        });
    }

    function saveLocal(searchForCity) {
        recentSearches.push(searchForCity);
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
        //console.log(recentSearches);
        //console.log(localStorage);
        //addToDrop();
    }

    function fillOutToday(response) {

        $(".current-date").css('visibility', 'visible');

        // CITY get and fillout on page
        var searchForCity2 = $('.search-for-city').val();
        $("#entered-city-value").html(searchForCity2);

        // DATE get and post to page
        var todayDate = response.list[0].dt_txt;
        $('#todays-date').html(todayDate);

        // ICON get and post to page
        var todaysIcon = response.list[0].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + todaysIcon + ".png";
        $('#todays-cond-icon').attr('src', iconurl);

        //HUMIDITY get and post to page
        var todayHumid = response.list[0].main.humidity;
        console.log(todayHumid);
        $('#todays-humid').html(todayHumid + " Humidity");

        //WIND SPEED get and post to page
        var todayWSpeed = response.list[0].wind.speed;
        console.log(todayWSpeed);
        $('#todays-wind-speed').html(todayWSpeed + " Wind Speed");

        // TEMPERATURE get and post to page 
        var todayTemp = response.list[0].main.temp;
        console.log(todayTemp);
        var fahrTemp = parseInt(((1.8 * (todayTemp - 273)) + 32));
        console.log(fahrTemp);
        $('#todays-temp').html(fahrTemp + " Fahrenheit");

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


});