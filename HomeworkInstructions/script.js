$(document).ready(function () {
    if (typeof localSearches === 'undefined') {
        var recentSearches = [];
    } else {
        var recentSearches = JSON.parse(localSearches.getItem("recentSearches"));
        console.log(recentSearches);
    }
    // get the search input
    $('.submit-btn').click(function () {
        event.preventDefault();
        var searchForCity = $('.search-for-city').val();
        console.log(searchForCity);
        var searchForCountry = $('.search-for-country').val();
        var searchForBoth = searchForCity + "," + searchForCountry;
        searchWeather(searchForBoth);
        console.log(searchForBoth);
        saveLocal(searchForCity);
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
        });
    }

    function saveLocal(searchForCity) {
        recentSearches.push(searchForCity);
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
        //addToDrop();
    }
});