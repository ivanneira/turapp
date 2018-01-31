
var senderosResult = [];

$$(document).on('DOMContentLoaded', function(){
    //descomentar para hacer la llamada ajax real
    //esta llamada de ajax tiene que estar dentro de esta funcion onReady para que funcione
    /*
        $.ajax({
     url: senderosAPI,
     timeout: timeOut,
     success: function(feed) {
      console.log("--------------")
     //getNoticias(feed);
     //console.dir(feed);
      senderosResult = feed;
         loadSenderos();
     }, error: function() {
                window.plugins.toast.show(ErrorAjax,"3000","bottom");
     }
     });
     */
    //showContenidos(noticiasResult)


    console.log("senderos");
    loadSenderos();

});


function loadSenderos(){

    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    db.executeSql('SELECT * FROM Senderos  order by Nombre asc', [], function(rs) {
        for(var i=0;i<rs.rows.length;i++)
        {
            var tmp= '<div class="card demo-card-header-pic senderoCard" data-senderoid="'+rs.rows.item(i).ID+'">'+
                '<div class="card-header align-items-flex-end"><img src="'+rs.rows.item(i).Imglocation+'" width="100%" height="100px"> </div>'+
                '<div class="card-content card-content-padding">'+
                '<p class="titulonoticia">'+rs.rows.item(i).Nombre+'</p>'+
                '<p class="date">Destacado</p>'+
                '<p>'+rs.rows.item(i).Descripcion+'</p>'+
                '</div>'+
                '</div>';

            $$("#senderosResultDiv").append(tmp);
        }

        $$(".senderoCard").click(function(){
            app.popup.open('.popup-senderos')
            senderoID = $(this).data().senderoid;
        });

    }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });





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

    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    db.executeSql('SELECT Latitud, Longitud FROM SenderoPuntoElevacion where IDSendero='+senderoID+' order by ID asc', [], function(rs) {
        console.dir(rs);
        console.log(rs.rows.item(0).Latitud);
        var mymap =  L.map('mapid').setView([rs.rows.item(0).Latitud, rs.rows.item(0).Longitud], 16);
        var x =  L.tileLayer('mapas/quebradaZonda/{z}/{x}/{y}.jpg',{    maxZoom: 18, minZoom:15  }).addTo(mymap);
        var a = new L.LatLng(rs.rows.item(0).Latitud,rs.rows.item(0).Longitud);
        console.dir(a);
        for(var i=0;i<rs.rows.length;i++)
        {
            plArray.push(new L.LatLng(rs.rows.item(i).Latitud,rs.rows.item(i).Longitud));
        }
        var DrawPolyline = new L.Polyline(plArray, {
            color: '#00b3fd',
            weight: 4,
            opacity: 0.7,
            smoothFactor: 1
        });
        DrawPolyline.addTo(mymap);
    }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });


    //Traer desde API por primera vez luego sqlite.






}

function onPopUpClose(){

    $$("#senderoContainer").empty();

}