var IntentMedia = IntentMedia || {};

IntentMedia.Airports = (function () {
    var pub = {};

    pub.airport_exists = function (airport_code) {
        return pub.airport_distances().hasOwnProperty(airport_code);
    };

    pub.airport_distances = function () {
        return {
            JFK: {
                LAX: 2475,
                LAS: 2248,
                PDX: 2454
            },
            LAX: {
                JFK: 2475,
                LAS: 236,
                PDX: 834
            },
            LAS: {
                JFK: 2248,
                LAX: 236,
                PDX: 763
            },
            PDX: {
                JFK: 2454,
                LAS: 763,
                LAX: 834
            }
        }
    };

    return pub;
}(IntentMedia || {}));

IntentMedia.Distances = (function () {
    var pub = {};
    var airport_distances = airport_distances || IntentMedia.Airports.airport_distances();

    pub.distance_between_airports = function (from_airport, to_airport) {
        if (IntentMedia.Airports.airport_exists(from_airport) && IntentMedia.Airports.airport_exists(to_airport)) {
            if (from_airport === to_airport) {
                return 0;
            }

            return airport_distances[from_airport][to_airport];
        }

        return -1;
    };

    return pub;
}(IntentMedia || {}));

var airports = IntentMedia.Airports;
var distances = IntentMedia.Distances;


$.fn.airport_validation = function(){

    var $from_to = $(this).val().toUpperCase();
    var $id = $(this).attr('id');
    var $errorNode = $('.error.' + $id);
    console.log($errorNode);

    //reset the html content, and hide if unhidden.
    $errorNode.hide().html();

    if (!$from_to){
        $errorNode.html('This value is required').show()
    }
    else {
        var $exists = airports.airport_exists($from_to);
        if (!$exists) {
            $($errorNode).html('The airport code is invalid').show();
        }
    }
}


$(document).ready(function () {

    //Validate Focus out of both from, and to.
    $('input#from').focusout(function () {
        $(this).airport_validation(airports);
    });
    $('input#to').focusout(function () {
        $(this).airport_validation(airports);
    });

    $('form').on('submit', function (e) {
        //prevent the default form submit
        e.preventDefault();

        var $from = $('#from').val().toUpperCase();
        var $to = $('#to').val().toUpperCase();

        var $dist = distances.distance_between_airports($from, $to);
        console.log($dist);
        $('#result').show();
        //debugger;
        if ($dist === -1){
            $('#result i').show();
            $('#result > span').text('Unable to compute the distance');
        }
        else {
            $('#result').addClass('success');
            $('#result > span').text('The distance between ' + $from + ' and ' + $to + ' airports is: ' + $dist);
        }
    });
});