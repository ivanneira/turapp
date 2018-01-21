function onPopUpOpen(){
    //seba trolo
    //el id del sendero llega como variable global, va cambiando según el atributo data-senderoid del tag a
    console.log("El id del sendero es " + senderoID);

    var mapTemplate = '<div class="card">'+
                      '     <div class="card-header text-color-gray">Mapa del sendero</div>'+
                      '     <div id ="mapid" class="card-content card-content-padding"></div>'+
                      '<div class="card-footer text-color-gray">algunos detalles del mapa</div>';

    $$("#senderoContainer").append(mapTemplate);

    var mymap = new L.map('mapid').setView([-31.54754175668209, -68.67658624939143], 15);
    var x = new L.tileLayer('mapas/quebradaZonda/{z}/{x}/{y}.png',{    maxZoom: 15  }).addTo(mymap);

}

function onPopUpClose(){

    $$("#senderoContainer").empty();

}