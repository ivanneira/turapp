/*
var keyId = "05675d71f15e834a";

var urlQuery = "http://api.wunderground.com/api/05675d71f15e834a/forecast/lang:SP/q/France/Paris.json";
var getClimaUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22san%20juan%2C%20ar%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
*/

/*
//accuweather
var APIKey = "eDDaCTGrriPttBraoQVYFaLy2teY25Vl";

var lat = "-31.566667";
var lon = " -68.866667";

var weatherURL = "http://api.accuweather.com/locations/v1/cities/geoposition/search.json?q="+ lat +"," + lon +"&apikey=" + APIKey;
*/

var yahooCodes = [
        "Tornado",
        "Tormenta tropical",
        "Huracán",
        "Tormenta electrica intensa",
        "Tormenta eléctrica",
        "mixed rain and snow",
        "mixed rain and sleet",
        "mixed snow and sleet",
        "Llovizna helada",
        "Llovizna",
    	"Lluvia helada",
    	"Chubascos",
    	"Chubascos",
    	"snow flurries",
    	"light snow showers",
    	"Nieve con viento",
    	"Nieve",
    	"Granizo",
    	"Aguanieve",
    	"Polvo",
    	"Niebla",
    	"Neblina",
    	"Humoso",
    	"Tempestuoso",
    	"Ventoso",
    	"Frio",
    	"Nublado",
    	"Mayormente nublado (noche)",
    	"Mayormente nublado (dia)",
    	"Parcialmente nublado (noche)",
    	"Parcialmente nublado (dia)",
    	"Despejado (noche)",
    	"Soleado",
    	"Despejado (noche)",
    	"Despejado (dia)",
    	"mixed rain and hail",
    	"Caluroso",
    	"Tormentas eléctricas aislada",
    	"Tormentas eléctricas dispersas",
    	"Tormentas eléctricas dispersas",
    	"Tormentas dispersas",
    	"Nevada fuerte",
    	"Aguanieve dispersa",
    	"Nevada fuerte",
    	"Parcialmente nublado",
    	"Tormentoso",
    	"Aguanieve",
    	"Tormentas eléctricas aisladas"
];

yahooCodes[3200] = 	"Descripción no disponible";

var daysOfTheWeek = {

	'Mon': 'Lunes',
	'Tue': 'Martes',
	'Wed': 'Miércoles',
	'Thu': 'Jueves',
	'Fri': 'Viernes',
	'Sat': 'Sábado',
	'Sun': 'Domingo'
};

var shortDaysOfTheWeek = {

    'Mon': 'LU',
    'Tue': 'MA',
    'Wed': 'MI',
    'Thu': 'JU',
    'Fri': 'VI',
    'Sat': 'SA',
    'Sun': 'DO'
};


//Consumer Key
var clientID = "dj0yJmk9NjNmRmEyU09MYkZJJmQ9WVdrOVFYSmpkMlUyTjJVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1mYw--";
//Client Secret
var ClientSecret = "e3254a54a72224a0c9023cde64b3a64e6336fcc5";
//Yahoo Query
var query = "select * from weather.forecast where  u='c' AND woeid = 91863255";
//API url
var weatherURL = "https://query.yahooapis.com/v1/public/yql?q=";

var weather;

$$(document).on('DOMContentLoaded', function(){

    $.ajax({

        url: weatherURL + query.replace(" ","%20") + "&format=json",
        success: function(data){

            weather = cleanWeather(data);
            fillClima(weather)
        }

    });


});
var pullclima = $$('.ptr-content');

pullclima.on('ptr:refresh', function(e){
    console.dir(e);
    app.ptr.done();
});

function cleanWeather(data){

    var weatherData = {

        'temp': data.query.results.channel.item.condition.temp,
		'code': data.query.results.channel.item.condition.code,
        'codeText': yahooCodes[data.query.results.channel.item.condition.code],
		'humidity': data.query.results.channel.atmosphere.humidity,
		'visibility': data.query.results.channel.atmosphere.visibility,
		'forecast': cleanForecast(data.query.results.channel.item.forecast),
		'windSpeed': data.query.results.channel.wind.speed,
		'windDirection': data.query.results.channel.wind.direction,
		//'image': "http://l.yimg.com/a/i/us/we/52/"+ data.query.results.channel.item.condition.code +".gif"
    };

    return weatherData;
}

function cleanForecast(forecast){

	var result = [{}];

	for (var i = 0; i < forecast.length ; i++){

        result[i] = {

			'code': forecast[i].code,
			'min': forecast[i].low,
			'max': forecast[i].high,
			'day': forecast[i].day
		};

	}

	return result;

}

function fillClima(data){
	$$("#climaImage").append('<img class="climaicon" src="img/'+ data.code +'.svg"></img>');
    $$("#climaText").text(data.codeText);
	$$("#temperatura").text(data.temp + "º");
	//$$("#climaFooter").text("humedad: " + data.humidity + "% - " + "visibilidad: " + data.visibility + " km");
	$$("#humedad").text("Humedad: " + data.humidity + "%");
	$$("#visibilidad").text("Visibilidad: " + data.visibility + " km");
	$$("#windDirection").css("transform", "rotate(" + data.windDirection + "deg)");
	$$("#windSpeed").text("Viento: " + data.windSpeed + " km/h");

	var forecastArray =  data.forecast

	for(var index in forecastArray){

		$$("#fDay"+ index).text(shortDaysOfTheWeek[forecastArray[index].day]);
        $$("#fImg"+ index).append('<img src="img/'+ forecastArray[index].code +'.svg"></img>');
        $$("#fMM"+ index).text("↓"+forecastArray[index].min + "º ↑" + forecastArray[index].max + "º");
	}
}