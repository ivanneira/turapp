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
    showContenidos(noticiasResult)

});

console.log(noticiasResult)


//transforma el html en el template y lo muestra
function showContenidos(jsonResponse){


var header = "<div class=\"card demo-card-header-pic\">";
var footer = "</div>";

var template = "<div></div>";

    for(var index in jsonResponse){

        $("#feeds").append(jsonResponse[index].title);

        //console.dir($(htmlString[index])[0]);
    }
}
