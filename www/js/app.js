//Variables
var senderosAPI = "http://appsenderos.sanjuan.gov.ar/api/SenderosGZip";
var updateSenderosAPI = "http://appsenderos.sanjuan.gov.ar/UpdateSenderosAPI";
var RecursoWeb = "http://appsenderos.sanjuan.gov.ar";
var ErrorAjax = "Debes tener una conexión activa.";
var conn ="";
var isOffline = 'onLine' in navigator && !navigator.onLine;
var mapaExiste =
    '<div class="chip color-green">' +
    '<div class="chip-media">'+
    '<i class="icon f7-icons color-white">download</i>'+
    '</div>' +
    '    <div class="chip-label">Mapa descargado</div>' +
    '</div>';


var gps_marker = 0;
var mymap= 0;
var internet = 0;
// Dom7
var $$ = Dom7;

//sqlite
var db = null;

//GPS Basics

var myLat = 0;
var myLong = 0;

var delayGPS = 30000;
var optionsGPS = {
    enableHighAccuracy: true,
    timeout: 5000,
};




function requestPermissionGPS()
{
    console.log("permisos");
    if(typeof(cordova.plugins) != 'undefined') {
        //cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
        //if (canRequest) {
        cordova.plugins.locationAccuracy.request(function () {
                //console.log("Request successful");
                navigator.geolocation.getCurrentPosition(successGPS, errorGPS, optionsGPS);
            }, function (error) {
                //alert("Por favor habilite los permisos de ubicación para el correcto funcionamiento de la aplicación.");
                window.plugins.toast.show("Por favor habilite los permisos de ubicación para el correcto funcionamiento de la aplicación.","3000","bottom");
                if (error) {
                    // Android only
                    console.error("error code=" + error.code + "; error message=" + error.message);
                    if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                        if (window.confirm("Fallo al solicitar ubicación con alta presición. Desea abrir la configuración y hacerlo manualmente?")) {
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
        );
        //}
        //});
    }
}

function errorGPS(err) {

    window.plugins.toast.show("Disculpe, no pudimos obtener sus datos de ubicación.","3000","bottom");
}
function successGPS(pos) {
    var crd = pos.coords;
    myLat = parseFloat(crd.latitude);
    myLong = parseFloat(crd.longitude);
    console.log("hay datos")
}

//AJAX timeout
var timeOutApi = 120000;


document.addEventListener("DOMContentLoaded", function(event) {


    var options = {
        'bgcolor': '#55b9a1',
        'fontcolor': '#fff',


        'onOpened': function () {
            console.log("welcome screen opened");
        },
        'onClosed': function () {
            //app.f7.dialog.preloader('Espere mientras se cargan los senderos');
            console.log("welcome screen closed");
        }
    };

    var welcomescreen_slides = [
        {//<img src="img/img_wc_1.jpg" height="150px">
            id: 'slide0',
            title: 'Bienvenido',
            picture: '<div class="tutorialicon"><img src="img/inicio.svg" height="80px"></div>',
            text: 'Gracias por descargar <b>Senderismo San Juan</b>  Descubre Senderos, Circuitos y  rutas, descarga mapas topográficos con todo detalle y disfruta tus aventuras al aire libre con el sistema de navegación integrada.<br><br>Desliza para continuar →'
        },
        {
            id: 'slide1',
            title: 'Funcionamiento...',
            picture: '<div class="tutorialicon"><img src="img/inicio.svg" height="80px"></div>',
            text: 'La aplicación te guiara haciendo uso del tu GPS, por ello es importante otorgar los permisos de ubicacion / geolocalizacion cuando te sean solicitados.<br><br>Desliza para continuar →'
        },
        {
            id: 'slide2',
            title: 'Tips - Información',
            picture: '<div class="tutorialicon"><img src="img/inicio.svg" height="80px"></div>',
            text: 'Senderismo San Juan te da la opción de Descargar los mapas de los circuitos publicados para que no tengas que requerir de algun tipo de conectividad en tus aventuras al aire libre.Es importante que <b><u>Descargues</u></b> el mapa que sea de tu interés antes de comenzar una aventura.<br><br>Desliza para continuar →'
        },
        {
            id: 'slide3',
            // title: 'NO TITLE',
            picture: '<div class="tutorialicon"><img src="img/inicio.svg" height="80px"></div>',
            text: 'Gracias por tu atención, No olvides comentar tu experiencia, sugerencias u otros.<br><br><a class="tutorial-close-btn" href="javascript:app.f7.welcomescreen.close();">Comenzar</a>'
        }
    ];


    Framework7.use(Framework7WelcomescreenPlugin);

    var app  = new Framework7({
        root: '#app', // App root element
        id: 'io.sanjuansalud.turApp', // App bundle ID
        name: 'turApp', // App name
        theme: 'auto', // Automatic theme detection
        welcomescreen: {
            slides: welcomescreen_slides,
            options: options,
        },

        routes: routes,
    });



    var homeView = app.views.create('#view-home', {
        url: '/',
        on: {
            BeforeIn: function(){

                console.log("sdfa")

            }
        }
    });
    var noticiasView = app.views.create('#view-noticias', {
        url: '/noticias/'
    });
    var climaView = app.views.create('#view-clima', {
        url: '/clima/'
    });
    var recomendacionesView = app.views.create('#view-recomendaciones', {
        url: '/recomendaciones/'
    });
    var emergenciasView = app.views.create('#view-emergencias', {
        url: '/emergencias/'
    });
    var ayudaView = app.views.create('#view-ayuda', {
        url: '/ayuda/'
    });
    var guiaView = app.views.create('#view-guias', {
        url: '/guias/'
    });

    app.on('pageAfterIn', function(tab){

        if(tab.name == "noticias"){
            showContenidos(noticiasResult)
        }
    });



    var mainView = app.views.create('.view-main');

    Dom7(document).on('click', '.tutorial-close-btn', function () {
        app.f7.welcomescreen.close();
    });

    /*
        Dom7('.tutorial-open-btn').click(function () {

        app.welcomescreen.open();
    });
    */

    Dom7(document).on('click', '.tutorial-next-link', function (e) {
        app.welcomescreen.next();
    });

    Dom7(document).on('click', '.tutorial-previous-slide', function (e) {
        app.welcomescreen.previous();
    });

});

//Eventos para popup de senderos

//variable global con el id de sendero
var senderoID = 0;
var sectorID = 0;


$$('.popup-senderos').on('popup:opened', function (e, popup) {

    onPopUpOpen();
});

$$('.popup-senderos').on('popup:close', function (e, popup) {
    onPopUpClose();
});

//Eventos para popup de noticias

//variable global con el id de sendero
var noticiaID = -1;


$$('.popup-noticias').on('popup:opened', function (e, popup) {
    onPopUpNoticiasOpen();
});

$$('.popup-noticias').on('popup:close', function (e, popup) {
    onPopUpNoticiasClose();
});



(function () {
    "use strict";
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.addEventListener("offline", offline, false);
    document.addEventListener("online", online, false);

} )();

function onDeviceReady() {

    //alert(checkInternet());
    document.addEventListener("backbutton", onBackKeyDown, false);
    requestPermissionGPS();
    //FORZADO DE ACTIVACION DE GPS EN LAS PLATAFORMAS

    Database(db);


    //Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener( 'pause',onPause, false );
    document.addEventListener( 'resume', onResume, false );



};
//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, Folder_Name, File_Name,id,filetype) {
//Parameters mismatch check
    if (URL == null && Folder_Name == null && File_Name == null) {
        return;
    }
    else {
        //internet = checkInternet()
        if(internet == 1) {
            download(URL, Folder_Name, File_Name, id, filetype); //If available download function call
        }
    }
}

function download(URL, Folder_Name, File_Name,id,filetype) {
//step to request a file system

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

     function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        var rootdir = fileSystem.root;
        var fp = rootdir.toURL(); // Returns Fulpath of local directory

        fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
        // download function call
        return filetransfer(download_link, fp,id,filetype);
    }

     function onDirectorySuccess(parent) {
        // Directory created successfuly
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        //alert("Unable to create new directory: " + error.code);
        return "Unable to create new directory: " + error.code
    }

    function fileSystemFail(evt) {
        //Unable to access file system
        //alert(evt.target.error.code);
        return evt.target.error.code
    }
}




function filetransfer(download_link, fp,id,filetype) {
    var fileTransfer = new FileTransfer();
    app.f7.dialog.preloader('Descargando... ').open()
    //app.f7.progressbar.show(app.f7.theme === 'md' ? 'yellow' : 'blue');
     fileTransfer.onprogress = function(result){


        var percent =  result.loaded / result.total * 100;
        percent = Math.round(percent);
        //console.log("Progreso de ID: " + id + " -> "+ percent + "%");
        //window.plugins.toast.show("Progreso de ID: " + id + " -> "+ percent + "%","250","bottom");

    };

// File download function with URL and local path
      fileTransfer.download(download_link, fp,
        function (entry) {
            app.f7.dialog.close();
            //alert("download complete: " + entry.toURL());
            //$$("#view-home").append("<img src='"+entry.toURL()+"'>")
            console.log("complete")
            app.f7.preloader.hide();
            if(filetype == 0){
                UpdateFilePathDB(entry.toURL(),id,filetype)
            }else
            {
                console.log(" RUTA "+ entry.toURL() + " ID " + id + " TYPE " +  filetype)
                UnzipDonwloadedMap(entry.toURL(),id, filetype);
            }
            entry.toURL();
        },
         function (error) {
             app.f7.dialog.close();
            //Download abort errors or download failed errors
            alert("Error descargando el mapa.. " + error.source);
            return "download error source " + error.source;
            //alert("download error target " + error.target);
            //alert("upload error code" + error.code);
        }
    );
}

function UnzipDonwloadedMap(zipFile, id){
    var zip       = zipFile,
        extracted =   zip.substring(0,zip.lastIndexOf("/")+1) + id + "/"

    //zip = zip.substring(0,zip.lastIndexOf("/")+1)
    console.log('zipping ...');


    Zeep.unzip({
        from : zip,
        to   : extracted
    }, function() {
        console.log('unzip success!');
        deleteFile(zipFile);
        console.log("Extracted "+extracted)
        UpdateFilePathDB(extracted,id,1)
    }, function(e) {
        console.log('unzip error: ', e);
    });
}

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    //alert("Pause");
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    //alert("Resume");
};

function online()
{
    internet = checkInternet()
}

function offline()
{
    internet = checkInternet()
}


function onBackKeyDown() {
    if ($$('.modal-in').length > 0) {
        app.f7.popup.close();
		return false;
        }else{
            navigator.app.clearHistory(); navigator.app.exitApp(); 
        return true;
    }
}

function Database(db) {
    db = window.sqlitePlugin.openDatabase({name: 'turapp.db',vesrion: '1.0', location: 'default'});

    //Creo la tabla Senderos
    db.sqlBatch([
        'CREATE TABLE IF NOT EXISTS Senderos ( ID integer PRIMARY KEY, IDSector,DepartamentoNombre, SectorNombre, PesoZipMapa, Nombre, Descripcion,LugarInicio,LugarFin,Distancia,Desnivel,DuracionTotal,AlturaMaxima,TipoDificultadFisica,TipoDificultadTecnica,InfoInteres)',
        'CREATE TABLE IF NOT EXISTS SenderoPuntoElevacion ( ID, IDSendero, Latitud, Longitud, Altura, PRIMARY KEY (ID, IDSendero))',
        'CREATE TABLE IF NOT EXISTS SenderoPuntoInteres ( ID, IDSendero, Descripcion, Latitud, Longitud, TipoPuntoInteresID, PRIMARY KEY (ID, IDSendero))',
        'CREATE TABLE IF NOT EXISTS SenderoRecursosImg ( IDSendero PRIMARY KEY, img)',
        'CREATE TABLE IF NOT EXISTS SenderoRecursosMap ( IDSector PRIMARY KEY, map)',
        'CREATE TABLE IF NOT EXISTS RegistroActualizacion ( ID integer PRIMARY KEY, FechaActualizacion )',
    ], function () {
                    console.log('Tablas OK');
                    syncSenderos();
                    //db.close()
                }
    );

}

function getSenderosPuntosDB(id)
{
    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    db.executeSql('SELECT * FROM SenderoPuntoElevacion where IDSendero="+id+"  order by ID asc', [], function(rs) {
        return rs;

    }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });


}


function syncSenderos()
{
    console.log("syncSenderos");
    var FechaActualizacionDB;
    var FechaActualizacionResponse;
    //debugger
    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});
    db.executeSql('SELECT FechaActualizacion FROM RegistroActualizacion', [], function (rs) {   
        console.log(rs.rows.length);
        if(rs.rows.length > 0){
            FechaActualizacionDB = rs.rows.item(0).FechaActualizacion;

        }
        console.log(FechaActualizacionDB);
        $.ajax({
            url: updateSenderosAPI,
            cache: false,
            type: 'get',
            timeout: timeOutApi,
            dataType: "json",
            success: function (response) { 
                console.log(response)
                if(FechaActualizacionDB == undefined || response.FechaActualizacion > FechaActualizacionDB){
                    FechaActualizacionResponse = response.FechaActualizacion                
                    console.log("Actualizando");
                    $.ajax({
                        url: senderosAPI,
                        cache: false,
                        type: 'get',
                        timeout: timeOutApi,
                        dataType: "json",
                        success: function (response) {
                            db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});
                            // var strDelSQL = "delete from Senderos;";
                            // var strDelSQL2 = "delete from SenderoPuntoElevacion;";
                            console.dir("--------------------------");
                            console.dir(response);
                            var strSQL = "INSERT OR REPLACE INTO Senderos (ID,IDSector,DepartamentoNombre, SectorNombre, PesoZipMapa, Nombre, Descripcion,LugarInicio,LugarFin,Distancia,Desnivel,DuracionTotal,AlturaMaxima,TipoDificultadFisica,TipoDificultadTecnica,InfoInteres) VALUES ";
                            var strSQL2 = "INSERT OR REPLACE INTO SenderoPuntoElevacion (ID, IDSendero, Latitud, Longitud, Altura) VALUES ";
                            var strSQL3 = "INSERT OR REPLACE INTO SenderoRecursosImg (IDSendero, img) VALUES ";
                            var strSQL4 = "INSERT OR REPLACE INTO RegistroActualizacion (ID, FechaActualizacion) VALUES (1," + FechaActualizacionResponse + ");";
                            var strSQL5 = "INSERT OR REPLACE INTO SenderoPuntoInteres (ID, IDSendero, Descripcion, Latitud, Longitud, TipoPuntoInteresID) VALUES ";

                            for(var i=0;i<response.Senderos.length;i++) {
                
                                // DownloadFile(RecursoWeb+response.Senderos[i].RutaImagen,"",response.Senderos[i].ID,response.Senderos[i].ID,0)
                
                                strSQL = strSQL + "(" + response.Senderos[i].ID +"," + response.Senderos[i].SenderoSector.ID + ",'" + response.Senderos[i].SenderoSector.NombreDepartamento +  "','" +  response.Senderos[i].SenderoSector.Nombre + "','" + response.Senderos[i].SenderoSector.PesoZipMapa + "','" + response.Senderos[i].Nombre + "','"+response.Senderos[i].Descripcion+"','"+response.Senderos[i].LugarInicio+"','"+response.Senderos[i].LugarFin+"','"+response.Senderos[i].Distancia+"','"+response.Senderos[i].Desnivel+"','"+response.Senderos[i].DuracionTotal+"','"+response.Senderos[i].AlturaMaxima+"','"+response.Senderos[i].TipoDificultadFisica+"','"+response.Senderos[i].TipoDificultadTecnica+"','"+response.Senderos[i].InfoInteres+"'),"
                                for(var x=0; x<response.Senderos[i].SenderoPuntoElevacion.length;x++)
                                {
                                    strSQL2 = strSQL2 + "(" + x + ","+response.Senderos[i].ID+", '"+response.Senderos[i].SenderoPuntoElevacion[x].Latitud+"','"+response.Senderos[i].SenderoPuntoElevacion[x].Longitud+"','"+response.Senderos[i].SenderoPuntoElevacion[x].Altura+"'),"
                                }
                                strSQL3 = strSQL3 + "(" + response.Senderos[i].ID + ",'" + response.Senderos[i].ImgBase64 +"'),";

                                for(var y=0; y<response.Senderos[i].SenderoPuntoInteres.length;y++)
                                {
                                    strSQL5 = strSQL5 + "(" + y + ","+response.Senderos[i].ID+", '"+response.Senderos[i].SenderoPuntoInteres[y].Descripcion+"', '"+response.Senderos[i].SenderoPuntoInteres[y].Latitud+"','"+response.Senderos[i].SenderoPuntoInteres[y].Longitud+"',"+response.Senderos[i].SenderoPuntoInteres[y].TipoPuntoInteresID+"),"
                                }
                            }
                            
                            strSQL = strSQL.slice(0,-1);
                            strSQL = strSQL + ";";
                
                            strSQL2 = strSQL2.slice(0,-1);
                            strSQL2 = strSQL2 + ";";
                
                            strSQL3 = strSQL3.slice(0,-1);
                            strSQL3 = strSQL3 + ";";

                            strSQL5 = strSQL5.slice(0,-1);
                            strSQL5 = strSQL5 + ";";
                            //Si Hay internet Sincronizo senderos limpiando la tabla.
                            db.sqlBatch([
                                // strDelSQL,
                                // strDelSQL2,
                                strSQL,
                                strSQL2,
                                strSQL3,
                                strSQL4,
                                strSQL5
                            ], function() {
                                //console.log('Clear database OK');
                                loadSenderos();     
                                //window.plugins.toast.show("Los Senderos estan siendo Actualizados ","3000","bottom");
                            }, function(error) {
                                console.log('SQL batch ERROR: ' + error.message);
                            });
                        },
                        error: function () {
                            //window.plugins.toast.show(ErrorAjax,"3000","bottom");
                        }
                
                    });
                }
            }
        });    
    });
}


function checkInternet() //devuelve 0 si no hay conexion , 1 si hay conexion.
{
    //app.f7.dialog.preloader("Espere por favor");
    try {
    
        var isOffline = 'onLine' in navigator && !navigator.onLine;
        // internet data
        var networkState = navigator.connection.type;
    
        var states = {};
    
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
    
    
            //Solo si tengo conexion 4g, 3g y wifi && si la conexion responde.
            if(states[networkState] == "Cell 4G connection" || states[networkState] == 'Cell 3G connection' || states[networkState] == 'WiFi connection')
            {
                if ( isOffline ) {
                    //local db
                    //window.plugins.toast.show("Offline","3000","bottom");
                    return 0;
                }
                else {
                    console.log("toast online");
                    //window.plugins.toast.show("Online","3000","bottom");
                    return 1;
                }
            }
        //app.f7.dialog.preloader.close();
            return 0;
    }
    catch(err) {
        var isOffline = 'onLine' in navigator && !navigator.onLine;
        if(isOffline){
            console.log("offline");
            //app.f7.dialog.preloader.close();
            return 0;
        }
        else{
            console.log("online");
            //app.f7.dialog.preloader.close();
            return 1;
        }
    }
    //app.f7.dialog.preloader.close();

}


function UpdateFilePathDB(file, id,filetype){
    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});


    var query = "";

    /*
     insert or replace into Book (ID, Name, TypeID, Level, Seen) values ( (select ID from Book where Name = "SearchName"), "SearchName", 5, 6, (select Seen from Book where Name = "SearchName"));
    */
    if(filetype == 0)
    {
        //query =  "UPDATE Senderos Set Imglocation = '"+file+"' where ID="+id;
        query =  "INSERT into SenderoRecursosImg (IDSendero, img) VALUES ("+id+",'"+file+"')";
        //query = "insert or replace into SenderoRecursosImg (IDSendero, img) values ( (select IDSendero from SenderoRecursosImg where IDSendero = "+id+"), '"+file+"');";
    }
    else
    {
        //query =  "UPDATE Senderos Set RutZipMapa = '"+file+"'  where ID="+id;
        //query =  "INSERT into SenderoRecursosMap (IDSendero, map) VALUES ("+id+",'"+file+"')";
        query = "insert or replace into SenderoRecursosMap (IDSector, map) values ("+id+",'"+file+"');";
    }

    db.executeSql(query, [], function(rs) {

        if(filetype == 1)
        {
            alert("El mapa ha sido descargado, estará disponible sin conexion.");
            $$("#btn_down_container").html(mapaExiste);
        }
        return rs;
    }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });

}
//*************
//    Unzip
//*************


//*************
//     Zip
//*************
//var PathToFileInString  = cordova.file.externalRootDirectory+"HereIsMyFile.zip",
//    PathToResultZip     = cordova.file.externalRootDirectory;
//JJzip.unzip(PathToFileInString, {target:PathToResultZip},function(data){
//    /* Wow everything goes good, but just in case verify data.success */
//},function(error){
//    /* Wow something goes wrong, check the error.message */
//})


//*************
//     Delete File.
//*************
//var path = "file:///storage/emulated/0";
//var filename = "myfile.txt";

//window.resolveLocalFileSystemURL(path, function(dir) {
//    dir.getFile(filename, {create:false}, function(fileEntry) {
//        fileEntry.remove(function(){
//            // The file has been removed succesfully
//        },function(error){
//            // Error deleting the file
//        },function(){
//            // The file doesn't exist
//        });
//    });
//});


function deleteFile(source)
{

    var filename = source.substring(source.lastIndexOf('/')+1);
    var ext = source.substring(source.lastIndexOf('/')+1).length+1;
    var path = source.substring(0,source.length-ext);

    console.log("deleeeeeeeeeeete");
    console.log(path);
    console.log(filename);
    console.log("deleeeeeeeeeeete");

    window.resolveLocalFileSystemURL(path, function(dir) {
    dir.getFile(filename, {create:false}, function(fileEntry) {
        fileEntry.remove(function(){
            // The file has been removed succesfully
            console.log("file removed ok.")
        },function(error){
            // Error deleting the file
            console.log("error removing file.")
        },function(){
            // The file doesn't exist
            console.log("file doesn't exist.")
        });
    });
});

}

function CallPhone(number) {
   // app.f7.dialog.confirm('¿Está seguro que desea llamar a emergencias?', 'Senderismo San Juan.',function () {
        //navigator.app.clearHistory(); navigator.app.exitApp();
        window.plugins.CallNumber.callNumber(onSuccess, onError, number, true);
    //});

}

function onSuccess(result){
    console.log("Success:"+result);
}

function onError(result) {
    console.log("Error:"+result);
}

function navigate(hasta)
{

    var  _onSuccess = function(position) {

        launchnavigator.navigate([hasta[0], hasta[1]], {
            start: ""+position.coords.latitude+","+position.coords.longitude+""
        });

    }

    // onError Callback receives a PositionError object
    //
    var _onError = function (error) {
        //window.plugins.toast.show('Código: '+ error.code +'\n' +' Detalle: ' + error.message + '\n',"2000","bottom");
    }


     navigator.geolocation.getCurrentPosition(_onSuccess, _onError,   optionsGPS );


}


