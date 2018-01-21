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

console.log(noticiasResult)


//transforma el html en el template y lo muestra
function showContenidos(jsonResponse){



    for ( var i = 0 ; i < jsonResponse.titles.length ; i++){

        var template =  '<div class="card demo-card-header-pic">' +
                        '  <div style="background-image:url('+ jsonResponse.image[i]  +')" data-background="'+ jsonResponse.image[i]  +'" class="card-header align-items-flex-end lazy lazy-fade-in"></div>' +
                        '  <div class="card-content card-content-padding">' +
                        '    <p class="date">Posted on January 21, 2015</p>' +
                        '    <p>' + jsonResponse.titles[i] + '</p>' +
                        '  </div>';

        $$("#feeds").append(template);
    }
}
