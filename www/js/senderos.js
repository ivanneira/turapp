
var senderosResult = [];

$$(document).on('DOMContentLoaded', function(){
    loadSenderos();
});


//Funcion que se ejecuta al cargar la vista senderos..
//Consulta si hay internet, y consume recursos desde la web, caso contrario utiliza la bd y los recursos descargados previamente.

function loadSenderos(){

    if(internet == 0) {
        console.log("Sin internet");
        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT * FROM Senderos  ORDER BY Nombre ASC', [], function (rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var tmp = '<div class="card demo-card-header-pic senderoCard" data-senderoid="' + rs.rows.item(i).ID + '">' +
                    '<div class="card-header align-items-flex-end"><img src="' + rs.rows.item(i).Imglocation + '" width="100%" height="200px"> </div>' +
                    '<div class="card-content card-content-padding">' +
                    '<p class="titulonoticia">' + rs.rows.item(i).Nombre + '</p>' +
                    '<p class="date">Destacado</p>' +
                    '<p>' + rs.rows.item(i).Descripcion + '</p>' +
                    '</div>' +
                    '</div>';

                $$("#senderosResultDiv").append(tmp);
            }


            $$(".senderoCard").click(function () {
                app.popup.open('.popup-senderos')
                senderoID = $(this).data().senderoid;
            });

        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
    }
    else
    {
        console.log("Con internet");
        $.ajax({
            url: senderosAPI,
            cache: false,
            type: 'get',
            timeout: timeOut,
            dataType: "json",
            success: function (response) {
                for (var i = 0; i < response.Senderos.length; i++) {
                    var tmp = '<div class="card demo-card-header-pic senderoCard" data-senderoid="' + response.Senderos[i].ID + '">' +
                        '<div class="card-header align-items-flex-end"><img src="' + RecursoWeb + response.Senderos[i].RutaImagen + '" width="100%" height="100px"> </div>' +
                        '<div class="card-content card-content-padding">' +
                        '<p class="titulonoticia">' + response.Senderos[i].Nombre + '</p>' +
                        '<p class="date">Destacado</p>' +
                        '<p>' + response.Senderos[i].Descripcion + '</p>' +
                        '</div>' +
                        '</div>';

                    $$("#senderosResultDiv").append(tmp);

                }
                $$(".senderoCard").click(function () {
                    app.popup.open('.popup-senderos')
                    senderoID = $(this).data().senderoid;
                });
            },
            error: function(){
            }
        });

    }

}



function onPopUpOpen(){


    //el id del sendero llega como variable global, va cambiando según el atributo data-senderoid del tag a
    console.log("El id del sendero es " + senderoID);

    var mapTemplate = '<div class="card">'+
                      '     <div class="card-header mapaheader">Mapa del sendero</div>'+
                      '     <div id ="mapid" class="card-content card-content-padding"></div>'+
                      '     <div class="card-footer mapafooter">algunos detalles del mapa</div>'+
                      '</div>';

    $$("#senderoContainer").append(mapTemplate);

    var plArray = [];

    internet = checkInternet();

    console.log("Internet: " + internet);


    if(internet == 0) {

        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT Latitud, Longitud FROM SenderoPuntoElevacion where IDSendero=' + senderoID + ' order by ID asc', [], function (rs) {
            console.dir(rs);
            console.log(rs.rows.item(0).Latitud);
            var mymap = L.map('mapid').setView([rs.rows.item(0).Latitud, rs.rows.item(0).Longitud], 16);
            var x = L.tileLayer('mapas/quebradaZonda/{z}/{x}/{y}.jpg', {maxZoom: 18, minZoom: 15}).addTo(mymap);
            var a = new L.LatLng(rs.rows.item(0).Latitud, rs.rows.item(0).Longitud);
            console.dir(a);
            for (var i = 0; i < rs.rows.length; i++) {
                plArray.push(new L.LatLng(rs.rows.item(i).Latitud, rs.rows.item(i).Longitud));
            }
            var DrawPolyline = new L.Polyline(plArray, {
                color: '#00b3fd',
                weight: 4,
                opacity: 0.7,
                smoothFactor: 1
            });
            DrawPolyline.addTo(mymap);
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
    }
    else
    {
        $.ajax({
            url: senderosAPI,
            cache: false,
            type: 'get',
            timeout: timeOut,
            dataType: "json",
            success: function (response) {
                console.dir(response);
                var mymap = L.map('mapid').setView([response.Senderos[0].SenderoPunto[0].Latitud, response.Senderos[0].SenderoPunto[0].Longitud], 16);
                var x = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {maxZoom: 18, minZoom: 7,subdomains:['mt0','mt1','mt2','mt3']}).addTo(mymap);
                var a = new L.LatLng(response.Senderos[0].SenderoPunto[0].Latitud, response.Senderos[0].SenderoPunto[0].Longitud);
                console.dir(a);
                for (var i = 0; i < response.Senderos.length; i++) {
                    if(senderoID == response.Senderos[i].ID) {
                        for (var x = 0; x < response.Senderos[i].SenderoPunto.length; x++) {
                            plArray.push(new L.LatLng(response.Senderos[i].SenderoPunto[x].Latitud, response.Senderos[i].SenderoPunto[x].Longitud));
                        }
                    }
                }
                var DrawPolyline = new L.Polyline(plArray, {
                    color: '#00b3fd',
                    weight: 4,
                    opacity: 0.7,
                    smoothFactor: 1
                });
                DrawPolyline.addTo(mymap)
            },
            error: function(){
            }
        });
    }

    //Traer desde API por primera vez luego sqlite.






}

function onPopUpClose(){

    $$("#senderoContainer").empty();

}