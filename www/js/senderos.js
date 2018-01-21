function onPopUpOpen(){

    $$("#senderoContainer").append("<p class='text-color-black'>Este contenido se crea y destruye dinámicamente cabeza</p><div id='mapid'></div>")

    var mymap = L.map('mapid').setView([-31.54754175668209, -68.67658624939143], 17);
    L.tileLayer('mapas/quebradaZonda/{z}/{x}/{y}.jpg',{    maxZoom: 17  }).addTo(mymap);

}

function onPopUpClose(){

    $$("#senderoContainer").empty();

}