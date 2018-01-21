function onPopUpOpen(){

    $$("#senderoContainer").append("<p class='text-color-black'>Este contenido se crea y destruye dinámicamente cabeza</p>")

    var mymap = new L.map('mapid').setView([-31.54754175668209, -68.67658624939143], 15);
    var x = new L.tileLayer('mapas/quebradaZonda/{z}/{x}/{y}.png',{    maxZoom: 15  }).addTo(mymap);




    setTimeout(function(){ $("#mapid").addClass("mapid"); }, 3000);

}

function onPopUpClose(){

    $$("#senderoContainer").empty();

}