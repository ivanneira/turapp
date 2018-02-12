//var rssurl = 'https://sisanjuan.gob.ar/secciones/ministerio-de-turismo-y-cultura?format=json';



$$(document).on('DOMContentLoaded', function(){
    //descomentar para hacer la llamada ajax real
    //esta llamada de ajax tiene que estar dentro de esta funcion onReady para que funcione
/*    $.ajax({
        url: rssurl,
        success: function(feed) {
            // console.log("--------------")
            getNoticias(feed);
        }
    });*/
    //showContenidos(noticiasResult)



});

//console.log(noticiasResult)

console.log("noticiasResult")

//transforma el html en el template y lo muestra
function showContenidos(jsonResponse){


    //for ( var i = 0 ; i < jsonResponse.titles.length ; i++){
    for ( var i = 0 ; i < 10 ; i++){

        var template =  '<div class="card demo-card-header-pic noticia" data-noticiaid="' + [i] + '">' +
                        '  <div style="background-image:url('+ jsonResponse.image[i]  +')" data-background="'+ jsonResponse.image[i]  +'" class="card-header align-items-flex-end"></div>' +
                        '  <div class="card-content card-content-padding">' +
                        '    <p class="date">' + jsonResponse.created[i] + '</p>' +
                        '    <p>' + jsonResponse.titles[i] + '</p>' +
                        '  </div>';

        $$("#feeds").append(template);
    }

    $$(".noticia").click(function(){

        app.f7.popup.open('.popup-noticias')

        noticiaID = $(this).data().noticiaid;
    });

}

function onPopUpNoticiasOpen(){

    //console.log(noticiaID)

    var template =  '<div class="card demo-card-header-pic">' +
                    '<div style="background-image:url('+ noticiasResult.image[noticiaID] +')" class="card-header align-items-flex-end"></div>' +
                    '<div class="card-content card-content-padding">' +
                    '<p class="titulonoticia">' + noticiasResult.titles[noticiaID]+ '</p>' +
                    '<p class="date">'+ "Creado en " + noticiasResult.created[noticiaID] +'</p>' +
                    '<div>'+ noticiasResult.fulltext[noticiaID] + '</div>' +
                    '</div>';


    $$("#noticiaContainer").append(template);
}

function onPopUpNoticiasClose(){

    $$("#noticiaContainer").empty();

}