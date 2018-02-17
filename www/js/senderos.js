
var LeafIcon = L.Icon.extend({
    options: {
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [22, 22],
        //shadowSize:   [50, 64],
        iconAnchor:   [22, 22],
        //shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});

var mk_inicio = new LeafIcon({iconUrl: 'img/icons_gps/green.png'}),
    mk_fin = new LeafIcon({iconUrl: 'img/icons_gps/red.png'}),
    mk_gps = new LeafIcon({iconUrl: 'img/icons_gps/gps.png'}),
    mk_elevation = new LeafIcon({iconUrl: 'img/icons_gps/elevation.png'});

L.icon = function (options) {
    return new L.Icon(options);
};


var senderosResult = [];
var gps_marker = 0;

$$(document).on('DOMContentLoaded', function(){

        loadSenderos();
});

//Funcion que se ejecuta al cargar la vista senderos..
//Consulta si hay internet, y consume recursos desde la web, caso contrario utiliza la bd y los recursos descargados previamente.



function loadSenderos(){

    internet = checkInternet();

    // if(internet == 0) {
         console.log("Sin internet");
        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT sen.*,simg.img,(SELECT  Latitud FROM SenderoPuntoElevacion AS spe WHERE spe.IDSendero = sen.ID LIMIT 1) AS LATITUD, (SELECT  Longitud FROM SenderoPuntoElevacion AS spe WHERE spe.IDSendero = sen.ID LIMIT 1) AS LONGITUD FROM Senderos  as sen left join SenderoRecursosImg as simg on simg.IDSendero = sen.ID   ORDER BY sen.Nombre ASC', [], function (rs) {

            for (var i = 0; i < rs.rows.length; i++) {

                console.dir(rs.rows.item(i))
                var img = rs.rows.item(i).img;
                console.log("acxa");
                console.dir(rs.rows.items)
                if (img == null){
                    img = "img/no_disponible.jpg";
                }

                var tmp =
                    '<div class="card demo-card-header-pic senderoCard" data-senderoid="' + rs.rows.item(i).ID + '">' +
                    '   <div class="card-header align-items-flex-end headerSenderos" > ' +
                    '        <p class="tituloSendero">' + rs.rows.item(i).Nombre + '</p>' +
                    '   </div>' +
                    '   <div class="card-content card-content-padding">' +
                    '       <div class="row">' +
                    '           <div class="col-50 card-header align-items-flex-end senderosImg" style="background-image:url('  + img + ' ")>' +
                    '           </div>' +
                    '           <div class="col-50 senderosInfo">' +
                    '               <div class="chip chipSendero">' +
                    '                   <div class="chip-media bg-color-pink">' +
                    '                       <img id="windDirection" src="img/distance.svg">' +
                    '                   </div>' +
                    '                  <div class="chip-label" id="distancia">Distancia: ' + rs.rows.item(i).Distancia + ' km</div>' +
                    '               </div>' +
                    '               <div class="chip chipSendero">' +
                    '                   <div class="chip-media bg-color-pink">' +
                    '                       <img id="windDirection" src="img/dificultad.svg">' +
                    '                   </div>' +
                    '                  <div class="chip-label" id="distancia">Dificultad: ' + rs.rows.item(i).TipoDificultadFisica + '</div>' +
                    '               </div>' +
                    '               <div class="chip chipSendero">' +
                    '                   <div class="chip-media bg-color-pink">' +
                    '                       <img id="windDirection" src="img/clock.svg">' +
                    '                   </div>' +
                    '                  <div class="chip-label" id="distancia">Duración: ' + rs.rows.item(i).DuracionTotal + '</div>' +
                    '               </div>' +
                    '               <div class="chip chipSendero">' +
                    '                   <div class="chip-media bg-color-pink">' +
                    '                       <img  src="img/arrow.svg">' +
                    '                   </div>' +
                    '                  <div class="chip-label"><a href="javascript:navigate(['+rs.rows.item(i).LATITUD+','+rs.rows.item(i).LONGITUD+']);"> Como llegar... </a></div>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>';

                $$("#senderosResultDiv").append(tmp);


            }
            
            //quita el preloader de senderos
            $$(".senderoLoader").remove();


            $$(".senderoCard").click(function () {
                app.f7.popup.open('.popup-senderos')
                senderoID = $(this).data().senderoid;
            });

        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
    // }
    // else
    // {
    //     console.log("Con internet");
    //     $.ajax({
    //         url: senderosAPI,
    //         cache: false,
    //         type: 'get',
    //         timeout: timeOut,
    //         dataType: "json",
    //         success: function (response) {
    //             for (var i = 0; i < response.Senderos.length; i++) {
    //                 var img = response.Senderos[i].RutaImagen;
    //                 if (img == null) {
    //                     img = "img/no_disponible.jpg";
    //                 }
    //                 else {
    //                     img = RecursoWeb + response.Senderos[i].RutaImagen;
    //                 }
    //                 var tmp = '<div class="card demo-card-header-pic senderoCard" data-senderoid="' + response.Senderos[i].ID + '">' +
    //                     '<div class="card-header align-items-flex-end lazy lazy-fade-in" style="background-image:url( ' + img + ' )"> ' +
    //                     '       <div class="chip chipMapa">' +
    //                     '           <div class="chip-label">Disponible</div>' +
    //                     '       </div>' +
    //                     '</div>' +
    //                     '<div class="card-content card-content-padding">' +
    //                     '<p class="titulonoticia">' + response.Senderos[i].Nombre + '</p>' +
    //                     '<p>' + response.Senderos[i].Descripcion + '</p>' +
    //                     '</div>' +
    //                     '</div>';

    //                 $$("#senderosResultDiv").append(tmp);

    //             }
    //             $$(".senderoCard").click(function () {
    //                 app.f7.popup.open('.popup-senderos')
    //                 senderoID = $(this).data().senderoid;
    //             });
    //         },
    //         error: function(){
    //         }
    //     });

    // }
    //
}



function onPopUpOpen(){

    console.log("open popup")




    //el id del sendero llega como variable global, va cambiando según el atributo data-senderoid del tag a
    console.log("El id del sendero es " + senderoID);

    var mapTemplate =
                    '<br>' +
                    '<button id="btn_download" class="button button-raised button-fill">Descargar mapa</button>' +
                    '<br>' +
                    '<div class="card">' +
                    '   <div id="nombre" class="card-header mapaheader tituloSendero"></div>'+
                    '   <div id ="mapid" class="card-content card-content-padding"></div>'+
                    '</div>' +
                    '' +
                    '<div id="elevChart"></div>' +
                    '<div class="card">' +
                    '   <div class="card-header">Detalles del mapa</div>' +
                    '   <div class="card-content card-content-padding text-align-center">' +
                    '           <div class="list simple-list ">'+
                    '               <ul>' +
                    '                    <li>' +
                    '                       <div class="chip chipClima">' +
                    '                           <div class="chip-media bg-color-pink">' +
                    '                               <img id="windDirection" src="img/inicio.svg">' +
                    '                           </div>' +
                    '                           <div class="chip-label" id="inicio">Lugar de inicio:</div>' +
                    '                       </div>' +
                    '                    </li>'+
                    '                    <li>' +
                    '                       <div class="chip chipClima">' +
                    '                           <div class="chip-media bg-color-pink">' +
                    '                               <img id="windDirection" src="img/fin.svg">' +
                    '                           </div>' +
                    '                           <div class="chip-label" id="fin">Lugar de fin:</div>' +
                    '                       </div>' +
                    '                    </li>'+
                    '                    <li>' +
                    '                       <div class="chip chipClima">' +
                    '                           <div class="chip-media bg-color-pink">' +
                    '                               <img id="windDirection" src="img/distance.svg">' +
                    '                           </div>' +
                    '                           <div class="chip-label" id="distancia">Distancia:</div>' +
                    '                       </div>' +
                    '                    </li>'+
                    '                    <li>' +
                    '                       <div class="chip chipClima">' +
                    '                           <div class="chip-media bg-color-pink">' +
                    '                               <img id="windDirection" src="img/desnivel.svg">' +
                    '                           </div>' +
                    '                           <div class="chip-label" id="desnivel">Desnivel:</div>' +
                    '                       </div>' +
                    '                    </li>'+
                    '                    <li>' +
                    '                       <div class="chip chipClima">' +
                    '                           <div class="chip-media bg-color-pink">' +
                    '                               <img id="windDirection" src="img/clock.svg">' +
                    '                           </div>' +
                    '                           <div class="chip-label" id="duracion">Duración total:</div>' +
                    '                       </div>' +
                    '                    </li>'+
                    '                    <li>' +
                    '                       <div class="chip chipClima">' +
                    '                           <div class="chip-media bg-color-pink">' +
                    '                               <img id="windDirection" src="img/cumbre.svg">' +
                    '                           </div>' +
                    '                           <div class="chip-label" id="altmaxima">Altura máxima:</div>' +
                    '                       </div>' +
                    '                    </li>'+
                    '                </ul>' +
                    '           </div>' +
                    '   </div>' +
                    '</div>';

    $$("#senderoContainer").append(mapTemplate);



    var urlmapa = RecursoWeb + "/Content/Senderos/1/Mapa/senderoMapa_"+senderoID+".zip";
    var namemapa = senderoID

    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    db.executeSql('select IDSendero from SenderoRecursosMap where IDSendero='+senderoID, [], function (rs) {

        if(rs.rows.length == 0) {
            $$("#btn_download").click(function () {
                alert("El mapa sera descargado...")
                DownloadFile(urlmapa, "", namemapa, namemapa, 1)
            });

        }
        else{
            $$("#btn_download").click(function () {
                alert("El ya ha sido descargado.")
            })
        }

    }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });


    var plArray = [];

    internet = checkInternet();

    console.log("Internet: " + internet);


    // if(internet == 0) {

        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT spe.Latitud, spe.Longitud, spe.Altura,s.ID, s.Descripcion,smap.map,s.LugarInicio,s.LugarFin,s.Distancia,s.Desnivel,s.DuracionTotal,s.AlturaMaxima, s.Nombre FROM SenderoPuntoElevacion as spe left join Senderos as s on s.ID = spe.IDSendero left join SenderoRecursosMap as smap on smap.IDSendero = s.ID where spe.IDSendero=' + senderoID + ' order by spe.ID asc', [], function (rs) {

            var soucerMap = rs.rows.item(0).map +  "Google Hibrido"
            console.log("soucerMap " + soucerMap)
            var mymap = L.map('mapid').setView([rs.rows.item(0).Latitud, rs.rows.item(0).Longitud], 16);
            var x;
            if(internet == 0) {
                x = L.tileLayer(soucerMap+'/{z}/{x}/{y}.jpg', {maxZoom: 18, minZoom: 15}).addTo(mymap);
            }
            else{
                x = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {maxZoom: 18, minZoom: 7,subdomains:['mt0','mt1','mt2','mt3']}).addTo(mymap);
            }
            var a = new L.LatLng(rs.rows.item(0).Latitud, rs.rows.item(0).Longitud);

            L.marker([rs.rows.item(0).Latitud,rs.rows.item(0).Longitud], {icon: mk_inicio}).addTo(mymap).bindPopup("Este es punto de inicio del circuito..");
            L.marker([rs.rows.item(255).Latitud,rs.rows.item(255).Longitud], {icon: mk_fin}).addTo(mymap).bindPopup("Este es punto de fin del circuito..");
            //L.marker([51.495, -0.083], {icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
            //L.marker([51.49, -0.1], {icon: orangeIcon}).addTo(map).bindPopup("I am an orange leaf.");


            var  _onSuccess = function(position) {

                //L.marker([position.coords.latitude,position.coords.longitude], {icon: mk_gps}).addTo(mymap).bindPopup("Esta es tu ubicación actual..");

                if(gps_marker == 0){
                    gps_marker = L.marker([position.coords.latitude,position.coords.longitude]).addTo(mymap).bindPopup("Esta es tu ubicación actual..");
                }
                else{
                    gps_marker.setLatLng([position.coords.latitude,position.coords.longitude]);
                }

                //var element = document.getElementById('geolocation');
                //element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                // 'Longitude: ' + position.coords.longitude     + '<br />' +
                //    '<hr />'      + element.innerHTML;

            }

            // onError Callback receives a PositionError object
            //
            var _onError = function (error) {
                window.plugins.toast.show('Código: '+ error.code +'\n' +' Detalle: ' + error.message + '\n',"2000","bottom");
            }


            var watchID = navigator.geolocation.watchPosition(_onSuccess, _onError, {  optionsGPS });


            $$("#nombre").append(" " + rs.rows.item(0).Nombre);
            $$("#inicio").append(" " + rs.rows.item(0).LugarInicio);
            $$("#fin").append(" " +rs.rows.item(0).LugarFin);
            $$("#distancia").append(" " +rs.rows.item(0).Distancia + " km");
            $$("#desnivel").append(" " +rs.rows.item(0).Desnivel + " msnm");
            $$("#duracion").append(" " +rs.rows.item(0).DuracionTotal);
            $$("#altmaxima").append(" " +rs.rows.item(0).AlturaMaxima + " m");


            for (var i = 0; i < rs.rows.length; i++) {
                plArray.push(new L.LatLng(rs.rows.item(i).Latitud, rs.rows.item(i).Longitud));
            }

            var DrawPolyline = new L.Polyline(plArray, {
                color: '#ff9e00',
                weight: 5,
                opacity: 1,
                smoothFactor: 1
            });
            DrawPolyline.addTo(mymap);
            mymap.fitBounds(DrawPolyline.getBounds());
 	        plotElevation(rs,1,rs.rows.item(0).Distancia,mymap,plArray);
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
    // }
    // else
    // {

    //     $.ajax({
    //         url: senderosAPI,
    //         cache: false,
    //         type: 'get',
    //         timeout: timeOut,
    //         dataType: "json",
    //         success: function (response) {
    //             console.dir(response);
    //             for (var i = 0; i < response.Senderos.length; i++) {
    //                 if(senderoID == response.Senderos[i].ID) {

    //                     var mymap = L.map('mapid').setView([response.Senderos[i].SenderoPuntoElevacion[0].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud], 16);
    //                     var x = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {maxZoom: 18, minZoom: 7,subdomains:['mt0','mt1','mt2','mt3']}).addTo(mymap);
    //                     var a = new L.LatLng(response.Senderos[i].SenderoPuntoElevacion[i].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud);
    //                     L.marker([response.Senderos[i].SenderoPuntoElevacion[0].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud], {icon: mk_inicio}).addTo(mymap).bindPopup("Este es punto de inicio del circuito..");
    //                     L.marker([response.Senderos[i].SenderoPuntoElevacion[255].Latitud, response.Senderos[i].SenderoPuntoElevacion[255].Longitud], {icon: mk_fin}).addTo(mymap).bindPopup("Este es punto de fin del circuito..");

    //                     //Polygon.getBounds().contains
    //                     var latlngs = [[response.Senderos[i].SenderoPuntoElevacion[0].Latitud, response.Senderos[i].SenderoPuntoElevacion[0].Longitud],
    //                                    [response.Senderos[i].SenderoPuntoElevacion[255].Latitud, response.Senderos[i].SenderoPuntoElevacion[255].Longitud]];
    //                     var polygon = L.polygon(latlngs, {color: 'red'}).addTo(mymap);
    //                     mymap.fitBounds(polygon.getBounds());

    //                     $$("#nombre").append(" " + response.Senderos[i].Nombre);
    //                     $$("#inicio").append(" " + response.Senderos[i].LugarInicio);
    //                     $$("#fin").append(" " +response.Senderos[i].LugarFin);
    //                     $$("#distancia").append(" " +response.Senderos[i].Distancia);
    //                     $$("#desnivel").append(" " +response.Senderos[i].Desnivel);
    //                     $$("#duracion").append(" " +response.Senderos[i].DuracionTotal);
    //                     $$("#altmaxima").append(" " +response.Senderos[i].AlturaMaxima);

    //                     var urlmapa = RecursoWeb + response.Senderos[i].RutZipMapa;
    //                     var namemapa = response.Senderos[i].ID
    //                     $$("#btn_download").click(function(){
    //                         alert(urlmapa);
    //                         DownloadFile(urlmapa,"",namemapa,namemapa,1)
    //                     });

    //                     var elevationvar = [];
    //                     elevationvar.push({rows : response.Senderos[i].SenderoPuntoElevacion})
    //                     for (var x = 0; x < response.Senderos[i].SenderoPuntoElevacion.length; x++) {
    //                         plArray.push(new L.LatLng(response.Senderos[i].SenderoPuntoElevacion[x].Latitud, response.Senderos[i].SenderoPuntoElevacion[x].Longitud));
    //                     }
    //                 }
    //             }
    //             var DrawPolyline = new L.Polyline(plArray, {
    //                 color: '#00b3fd',
    //                 weight: 4,
    //                 opacity: 0.7,
    //                 smoothFactor: 1
    //             });
    //             DrawPolyline.addTo(mymap)

    //             plotElevation(elevationvar[0],0,response.Senderos[0].Distancia,mymap);
    //         },
    //         error: function(){
    //         }
    //     });
    // }

    //Traer desde API por primera vez luego sqlite.






}

function onPopUpClose(){

    $$("#senderoContainer").empty();

}


function checkIfFileExists(path){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem
}
function fileExists(fileEntry){
    alert("File " + fileEntry.fullPath + " exists!");
}
function fileDoesNotExist(){
    alert("file does not exist");
}
function getFSFail(evt) {
    console.log(evt.target.error.code);
}