
var senderosResult = [];


$$(document).on('DOMContentLoaded', function(){

    loadSenderos();
});


//Funcion que se ejecuta al cargar la vista senderos..
//Consulta si hay internet, y consume recursos desde la web, caso contrario utiliza la bd y los recursos descargados previamente.

function downloadMAP()
{

    alert("Descarga mapa");

}

function loadSenderos(){

    internet = checkInternet();

    if(internet == 0) {
        console.log("Sin internet");
        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT * FROM Senderos  ORDER BY Nombre ASC', [], function (rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var img = rs.rows.item(i).Imglocation;
                if (img == null)
                    img = "img/no_disponible.jpg";

                var tmp = '<div class="card demo-card-header-pic senderoCard" data-senderoid="' + rs.rows.item(i).ID + '">' +
                    '<div class="card-header align-items-flex-end"><img src="' + img + '" width="100%" height="auto"> </div>' +
                    '<div class="card-content card-content-padding">' +
                    '<p class="titulonoticia">' + rs.rows.item(i).Nombre + '</p>' +
                    '<p>' + rs.rows.item(i).Descripcion + '</p>' +
                    '</div>' +
                    '</div>';

                $$("#senderosResultDiv").append(tmp);
            }


            $$(".senderoCard").click(function () {
                app.f7.popup.open('.popup-senderos')
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
                    var img = response.Senderos[i].RutaImagen;
                    if (img == null) {
                        img = "img/no_disponible.jpg";
                    }
                    else {
                        img = RecursoWeb + response.Senderos[i].RutaImagen;
                    }
                    var tmp = '<div class="card demo-card-header-pic senderoCard" data-senderoid="' + response.Senderos[i].ID + '">' +
                        '<div class="card-header align-items-flex-end"><img src="' + img + '" width="100%" height="auto"> </div>' +
                        '<div class="card-content card-content-padding">' +
                        '<p class="titulonoticia">' + response.Senderos[i].Nombre + '</p>' +
                        '<p>' + response.Senderos[i].Descripcion + '</p>' +
                        '</div>' +
                        '</div>';

                    $$("#senderosResultDiv").append(tmp);

                }
                $$(".senderoCard").click(function () {
                    app.f7.popup.open('.popup-senderos')
                    senderoID = $(this).data().senderoid;
                });
            },
            error: function(){
            }
        });

    }

}



function onPopUpOpen(){

    var LeafIcon = L.Icon.extend({
        options: {
            //shadowUrl: 'leaf-shadow.png',
            iconSize:     [38, 95],
            //shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            //shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
        }
    });

    var mk_inicio = new LeafIcon({iconUrl: 'img/icons_gps/green.png'}),
        mk_fin = new LeafIcon({iconUrl: 'img/icons_gps/red.png'}),
        mk_gps = new LeafIcon({iconUrl: 'img/icons_gps/gps.png'});

    L.icon = function (options) {
        return new L.Icon(options);
    };



    //el id del sendero llega como variable global, va cambiando según el atributo data-senderoid del tag a
    console.log("El id del sendero es " + senderoID);

    var mapTemplate = '<div class="card">'+
                      '     <button id="btn_download" class="button">Descargar Mapa</button>'+
                      '     <div id="nombre" class="card-header mapaheader"></div>'+
                      '     <div id ="mapid" class="card-content card-content-padding"></div>'+
                      '     <div class="card-footer mapafooter">algunos detalles del mapa</div>'+
                      '     <div class="card-footer mapafooter" style="color:#222">'+
                      '     <ul>'+
                      '     <li id="inicio">Lugar de Inicio</li>'+
                      '     <li id="fin">Lugar de Fin</li>'+
                      '     <li id="distancia">Distancia</li>'+
                      '     <li id="desnivel">Desnivel</li>'+
                      '     <li id="duracion">Duracion Total</li>'+
                      '     <li id="altmaxima">Altura Máxima</li>'+
                      '     </ul>'+
                      '     </div>'+
                      '</div><div id="elevChart"></div>';

    $$("#senderoContainer").append(mapTemplate);

    var plArray = [];

    internet = checkInternet();

    console.log("Internet: " + internet);


    if(internet == 0) {

        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT spe.Latitud, spe.Longitud, spe.Altura, s.Descripcion,s.LugarInicio,s.LugarFin,s.Distancia,s.Desnivel,s.DuracionTotal,s.AlturaMaxima, s.Nombre FROM SenderoPuntoElevacion as spe left join Senderos as s on s.ID = spe.IDSendero  where spe.IDSendero=' + senderoID + ' order by spe.ID asc', [], function (rs) {

            var mymap = L.map('mapid').setView([rs.rows.item(0).Latitud, rs.rows.item(0).Longitud], 16);
            var x = L.tileLayer('mapas/quebradaZonda/{z}/{x}/{y}.jpg', {maxZoom: 18, minZoom: 15}).addTo(mymap);
            var a = new L.LatLng(rs.rows.item(0).Latitud, rs.rows.item(0).Longitud);

            L.marker([rs.rows.item(0).Latitud,rs.rows.item(0).Longitud], {icon: mk_inicio}).addTo(mymap).bindPopup("Este es punto de inicio del circuito..");
            L.marker([rs.rows.item(255).Latitud,rs.rows.item(255).Longitud], {icon: mk_fin}).addTo(mymap).bindPopup("Este es punto de fin del circuito..");
            //L.marker([51.495, -0.083], {icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
            //L.marker([51.49, -0.1], {icon: orangeIcon}).addTo(map).bindPopup("I am an orange leaf.");

            $$("#nombre").append(" " + rs.rows.item(0).Nombre);
            $$("#inicio").append(" " + rs.rows.item(0).LugarInicio);
            $$("#fin").append(" " +rs.rows.item(0).LugarFin);
            $$("#distancia").append(" " +rs.rows.item(0).Distancia);
            $$("#desnivel").append(" " +rs.rows.item(0).Desnivel);
            $$("#duracion").append(" " +rs.rows.item(0).DuracionTotal);
            $$("#altmaxima").append(" " +rs.rows.item(0).AlturaMaxima);


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
 	    plotElevation(rs,1);
 	    console.dir(rs)
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

                for (var i = 0; i < response.Senderos.length; i++) {
                    if(senderoID == response.Senderos[i].ID) {

                        var mymap = L.map('mapid').setView([response.Senderos[i].SenderoPuntoElevacion[0].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud], 16);
                        var x = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {maxZoom: 18, minZoom: 15,subdomains:['mt0','mt1','mt2','mt3']}).addTo(mymap);
                        var a = new L.LatLng(response.Senderos[i].SenderoPuntoElevacion[i].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud);
                        L.marker([response.Senderos[i].SenderoPuntoElevacion[0].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud], {icon: mk_inicio}).addTo(mymap).bindPopup("Este es punto de inicio del circuito..");
                        L.marker([response.Senderos[i].SenderoPuntoElevacion[255].Latitud, response.Senderos[i].SenderoPuntoElevacion[255].Longitud], {icon: mk_fin}).addTo(mymap).bindPopup("Este es punto de fin del circuito..");
                        $$("#nombre").append(" " + response.Senderos[i].Nombre);
                        $$("#inicio").append(" " + response.Senderos[i].LugarInicio);
                        $$("#fin").append(" " +response.Senderos[i].LugarFin);
                        $$("#distancia").append(" " +response.Senderos[i].Distancia);
                        $$("#desnivel").append(" " +response.Senderos[i].Desnivel);
                        $$("#duracion").append(" " +response.Senderos[i].DuracionTotal);
                        $$("#altmaxima").append(" " +response.Senderos[i].AlturaMaxima);

                        var urlmapa = RecursoWeb + response.Senderos[i].RutZipMapa;
                        var namemapa = response.Senderos[i].ID
                        $$("#btn_download").click(function(){
                            alert(urlmapa);
                            DownloadFile(urlmapa,"",namemapa,namemapa,1)
                        });

                        var elevationvar = [];
                        elevationvar.push({rows : response.Senderos[i].SenderoPuntoElevacion})
                        for (var x = 0; x < response.Senderos[i].SenderoPuntoElevacion.length; x++) {
                            plArray.push(new L.LatLng(response.Senderos[i].SenderoPuntoElevacion[x].Latitud, response.Senderos[i].SenderoPuntoElevacion[x].Longitud));
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

                plotElevation(elevationvar[0],0);
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