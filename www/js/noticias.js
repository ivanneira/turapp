var rssurl = 'https://sisanjuan.gob.ar/secciones/ministerio-de-turismo-y-cultura?format=feed';

$$(document).on('DOMContentLoaded', function(){

    $.ajax({
        url: rssurl,
        success: function(feed) {
            
            console.log(feed);
            console.log("--------------")
            getNoticias(feed);
        }
    });

});


var contenidos = [];

function getNoticias(xml){

    var items = xml.evaluate("//channel/item/description/text()", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

    var item = items.iterateNext();

    var parser = new DOMParser;

    while(item){
        

        contenidos.push($(item).text());

        item = items.iterateNext();
    }

    console.log(contenidos)

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

