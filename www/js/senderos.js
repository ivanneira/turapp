
var LeafIcon = L.Icon.extend({
    options: {
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [30, 40],
        //shadowSize:   [50, 64],
        iconAnchor:   [15, 40],
        shadowAnchor: [4, 62],
        popupAnchor:  [0, -45]
    }
});

var mk_inicio = new LeafIcon({iconUrl: 'img/icons_gps/inicio.png'}),
    mk_fin = new LeafIcon({iconUrl: 'img/icons_gps/fin.png'}),
    mk_cumbre = new LeafIcon({iconUrl: 'img/icons_gps/cumbre.png'}),
    mk_estacionamiento = new LeafIcon({iconUrl: 'img/icons_gps/estacionamiento.png'}),
    mk_mirador = new LeafIcon({iconUrl: 'img/icons_gps/mirador.png'}),
    mk_interes = new LeafIcon({iconUrl: 'img/icons_gps/interes.png'});
    mk_maxima = new LeafIcon({iconUrl: 'img/icons_gps/maxima.png'});
    mk_precaucion = new LeafIcon({iconUrl: 'img/icons_gps/precaucion.png'});

L.icon = function (options) {
    return new L.Icon(options);
};


var senderosResult = [];
var gps_marker = 0;

$$(document).on('DOMContentLoaded', function(){
    app.f7.popup.open('.popup-preloader');
    loadSenderos();
});

//Funcion que se ejecuta al cargar la vista senderos..
//Consulta si hay internet, y consume recursos desde la web, caso contrario utiliza la bd y los recursos descargados previamente.



function loadSenderos(){
    document.getElementById('senderosResultDiv').innerHTML = "";
    internet = checkInternet();

    // if(internet == 0) {
         console.log("Sin internet");
        db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

        db.executeSql('SELECT sen.*,simg.img,(SELECT  Latitud FROM SenderoPuntoElevacion AS spe WHERE spe.IDSendero = sen.ID LIMIT 1) AS LATITUD, (SELECT  Longitud FROM SenderoPuntoElevacion AS spe WHERE spe.IDSendero = sen.ID LIMIT 1) AS LONGITUD FROM Senderos  as sen left join SenderoRecursosImg as simg on simg.IDSendero = sen.ID   ORDER BY sen.Nombre ASC', [], function (rs) {

        //db.executeSql('SELECT sen.*,simg.img FROM Senderos  as sen left join SenderoRecursosImg as simg on simg.IDSendero = sen.ID  ORDER BY sen.Nombre ASC', [], function (rs) {
            console.dir(rs);
            for (var i = 0; i < rs.rows.length; i++) {


                var img = rs.rows.item(i).img;
                console.log("acxa");

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
                    '               <div class="list">' +
                    '                <ul>' +
                    '                   <li>' +
                    '                       <div class="item-content">' +
                    '                           <div class="item-inner">' +
                    '                                   <div class="item-title chipSendero">Distancia</div>' +
                    '                                   <div class="item-after">' + rs.rows.item(i).Distancia + ' km</div>' +
                    '                            </div>' +
                    '                       </div>' +
                    '                    </li>' +
                    '                    <li>' +
                    '                       <div class="item-content">' +
                    '                           <div class="item-inner">' +
                    '                               <div class="item-title chipSendero">Dificultad</div>' +
                    '                                   <div class="item-after">' + rs.rows.item(i).TipoDificultadFisica + '</div>' +
                    '                               </div>' +
                    '                           </div>' +
                    '                    </li>' +
                    '                    <li>' +
                    '                       <div class="item-content">' +
                    '                           <div class="item-inner">' +
                    '                               <div class="item-title chipSendero">Duración</div>' +
                    '                                   <div class="item-after">' + rs.rows.item(i).DuracionTotal + '</div>' +
                    '                               </div>' +
                    '                           </div>' +
                    '                   </li>' +
                    '                  </ul>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<br>';

                $$("#senderosResultDiv").append(tmp);


            }
            
            //quita el preloader de senderos
            app.f7.popup.close('.popup-preloader')

            $$(".senderoCard").click(function () {
                app.f7.popup.open('.popup-senderos')
                senderoID = $(this).data().senderoid;
            });

        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
}



function onPopUpOpen(){

    console.log("open popup")


    //el id del sendero llega como variable global, va cambiando según el atributo data-senderoid del tag a
    console.log("El id del sendero es " + senderoID);

    var mapTemplate =
                    '<br>' +
                    '<div id="btn_down_container"><button id="btn_download" class="button button-raised button-fill">Descargar mapa</button></div>' +
                    '<br>' +
                    '<div class="card">' +
                    '   <div id="nombre" class="card-header mapaheader tituloSendero2"></div>'+
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
                    '<br><button id="comollego" class="button button-raised button-fill">Como llegar al Sendero ? </button>'+
                    '</div>';

    $$("#senderoContainer").append(mapTemplate);




    var urlmapa = RecursoWeb + "/Content/Senderos/"+senderoID+"/Mapa/senderoMapa_"+senderoID+".zip";
    var namemapa = senderoID

    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    db.executeSql('select IDSendero from SenderoRecursosMap where IDSendero='+senderoID, [], function (rs) {

        if(rs.rows.length == 0) {
            $$("#btn_download").click(function () {
                console.log(urlmapa);
                //alert("El mapa sera descargado...")
                DownloadFile(urlmapa, "", namemapa, namemapa, 1)
            });

        }
        else{
            $$("#btn_down_container").html("<p>Este mapa se encuentra disponible sin conexion.</p>");
            //$$("#btn_download").css("display","none");
            //$$("#btn_download").click(function () {
            //    alert("El ya ha sido descargado.")
            //})
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

        //L.marker([rs.rows.item(0).Latitud,rs.rows.item(0).Longitud], {icon: mk_inicio}).addTo(mymap).bindPopup("Este es punto de inicio del circuito..");
        //L.marker([rs.rows.item(255).Latitud,rs.rows.item(255).Longitud], {icon: mk_fin}).addTo(mymap).bindPopup("Este es punto de fin del circuito..");
        
        db.executeSql('SELECT IDSendero, Descripcion, Latitud, Longitud, TipoPuntoInteresID FROM SenderoPuntoInteres WHERE IDSendero=' + senderoID, [], function (rs2) {
            console.dir(rs2);
            for (var i = 0; i < rs2.rows.length; i++) {
                L.marker([rs2.rows.item(i).Latitud,rs2.rows.item(i).Longitud], {icon: MarcadorPuntoInteres(rs2.rows.item(i).TipoPuntoInteresID)}).addTo(mymap).bindPopup(rs2.rows.item(i).Descripcion);
            }
                
        });

        $$("#comollego").click(function(){
            navigate([rs.rows.item(0).Latitud,rs.rows.item(0).Longitud]);
        })


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

function MarcadorPuntoInteres(TipoPuntoInteresID){
    switch (TipoPuntoInteresID) {
        case 1: //Inicio
            return mk_inicio;
            break;
        case 2: //Fin
            return mk_fin;
            break;
        case 3: //Mirador
            return mk_mirador;
            break;
        case 4: //Cumbre
            return mk_cumbre;
            break;
    }
}