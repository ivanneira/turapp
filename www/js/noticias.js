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


});

//objeto xmo
var contenidos = [];

//console.log(typeof(noticias))

//var a = noticiasResult.category.children;

console.log(noticiasResult)

//getNoticias(noticiasResult);

//trata el json
function getNoticias(jsonResponse){



/*    var items = xml.evaluate("//channel/item/description/text()", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

    var item = items.iterateNext();

    while(item){


        contenidos.push($(item).text());

        item = items.iterateNext();
    }*/

    showContenidos(jsonResponse)

}

//transforma el html en el template y lo muestra
function showContenidos(jsonResponse){

    //console.log(htmlString)
/*
    var backgroundImage = "background-image:url(http://lorempixel.com/1000/600/nature/3/)";

    var template =  '<div class="card demo-card-header-pic">'+
                        '<div style="'+ backgroundImage +'" class="card-header align-items-flex-end">Journey To Mountains</div>'+
                            '<div class="card-content card-content-padding">'+
                                '<p class="date">Posted on January 21, 2015</p>'+
                                '<p>Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus quis nibh hendrerit...</p>'+
                            '</div>'+
                    '</div>';*/

var header = "<div class=\"card demo-card-header-pic\">";
var footer = "</div>";

var template = "<div></div>";

    for(var index in jsonResponse){

        $("#feeds").append(header + jsonResponse[index].title + footer);

        //console.dir($(htmlString[index])[0]);
    }
}


// var url = rssNoticias;
// var dataType = "xml";
//
//
//     var html = '<ul data-role="listview">';
//
//     for(var i = 0; i < feed.items.length; i++) {
//
//         var item = feed.items[i];
//
//         html += '<li>'
//             + '<a href="#article?id='
//             + i
//             + '">'
//             + item.title
//             + '</a>'
//             + '</li>';
//     }
//
//     html = html + '</ul>';
//
//     $$('#feedresult').append(html);
//     $$('#main').page('destroy').page();

