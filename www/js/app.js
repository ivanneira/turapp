//Variables
var senderosAPI = "http://economiayciencia.com/api/SenderosAPI";
var RecursoWeb = "http://economiayciencia.com";
var ErrorAjax = "Debes tener una conexión activa.";
var conn ="";
var isOffline = 'onLine' in navigator && !navigator.onLine;

var internet = 0;
// Dom7
var $$ = Dom7;

//sqlite
var db = null;

//GPS Basics
var optionsGPS = {
    enableHighAccuracy: true,
    timeout: 150000,
    maximumAge: 0
};

//AJAX timeout
var timeOut = 30000;


document.addEventListener("DOMContentLoaded", function(event) {

    var options = {
        'bgcolor': '#0da6ec',
        'fontcolor': '#fff',


        'onOpened': function () {
            console.log("welcome screen opened");
        },
        'onClosed': function () {
            console.log("welcome screen closed");
        }
    };

    var welcomescreen_slides = [
        {
            id: 'slide0',
            title: 'Bienvenido',
            picture: '<div class="tutorialicon">♥</div>',
            text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.<br><br>Swipe to continue →'
        },
        {
            id: 'slide1',
            title: 'Slide 2',
            picture: '<div class="tutorialicon">✲</div>',
            text: 'This is slide 2<br><br>Swipe to continue →'
        },
        {
            id: 'slide2',
            title: 'Slide 3',
            picture: '<div class="tutorialicon">♫</div>',
            text: 'This is slide 3<br><br>Swipe to continue →'
        },
        {
            id: 'slide3',
            // title: 'NO TITLE',
            picture: '<div class="tutorialicon">☆</div>',
            text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn" href="#">End Tutorial</a>'
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
        url: '/'
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
    var acercaView = app.views.create('#view-acerca', {
        url: '/acerca/'
    });

    app.on('pageAfterIn', function(tab){

        if(tab.name == "noticias"){
            showContenidos(noticiasResult)
        }
    });


    //app.f7.welcomescreen.open() Abre el wellcome screen
    var mainView = app.views.create('.view-main');

    Dom7(document).on('click', '.tutorial-close-btn', function () {
        app.welcomescreen.close();
    });

    Dom7('.tutorial-open-btn').click(function () {
        app.welcomescreen.open();
    });

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

    //FORZADO DE ACTIVACION DE GPS EN LAS PLATAFORMAS
    //requestPermissionGPS();

    Database(db);


    //Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener( 'pause',onPause, false );
    document.addEventListener( 'resume', onResume, false );

    // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.

};
//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, Folder_Name, File_Name,id,filetype) {
//Parameters mismatch check
    if (URL == null && Folder_Name == null && File_Name == null) {
        return;
    }
    else {
        internet = checkInternet()
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

     fileTransfer.onprogress = function(result){
        var percent =  result.loaded / result.total * 100;
        percent = Math.round(percent);
        console.log("Progreso de ID: " + id + " -> "+ percent + "%");
        window.plugins.toast.show("Progreso de ID: " + id + " -> "+ percent + "%","250","bottom");
    };

// File download function with URL and local path
      fileTransfer.download(download_link, fp,
        function (entry) {
            //alert("download complete: " + entry.toURL());
            //$$("#view-home").append("<img src='"+entry.toURL()+"'>")
            console.log("complete")
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
            //Download abort errors or download failed errors
            //alert("download error source " + error.source);
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
    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    //Creo la tabla Senderos

/*
    db.sqlBatch([
        'CREATE TABLE IF NOT EXISTS Senderos ( ID, Nombre,Imglocation,RutZipMapa, Descripcion,LugarInicio,LugarFin,Distancia,Desnivel,DuracionTotal,AlturaMaxima)',
    ], function () {
        console.log('Tabla Senderos OK');
        //Creo la tabla SenderoPuntoElevacion
        db.sqlBatch([
            'CREATE TABLE IF NOT EXISTS SenderoPuntoElevacion ( ID, IDSendero, Latitud,Longitud,Altura)',
        ], function () {
            console.log('Tabla SenderoPuntoElevacion OK');
            syncSenderos()
            //db.close()
        }, function (error) {
            //console.log('SQL batch ERROR: ' + error.message);
        });
    }, function (error) {
        //console.log('SQL batch ERROR: ' + error.message);
    });
*/

    db.sqlBatch([
        'CREATE TABLE IF NOT EXISTS Senderos ( ID, Nombre, Descripcion,LugarInicio,LugarFin,Distancia,Desnivel,DuracionTotal,AlturaMaxima)',
    ], function () {
        console.log('Tabla Senderos OK');
        //Creo la tabla SenderoPuntoElevacion
        db.sqlBatch([
            'CREATE TABLE IF NOT EXISTS SenderoPuntoElevacion ( ID, IDSendero, Latitud,Longitud,Altura)',
        ], function () {
            console.log('Tabla SenderoPuntoElevacion OK');
            db.sqlBatch([
                'CREATE TABLE IF NOT EXISTS SenderoRecursosImg ( ID, IDSendero, img)',
            ], function () {
                console.log('Tabla SenderoRecursosImg OK');
                db.sqlBatch([
                    'CREATE TABLE IF NOT EXISTS SenderoRecursosMap ( ID, IDSendero, map)',
                ], function () {
                    console.log('Tabla SenderoRecursosMap OK');
                    syncSenderos()
                    //db.close()
                }, function (error) {
                    //console.log('SQL batch ERROR: ' + error.message);
                });
                //db.close()
            }, function (error) {
                //console.log('SQL batch ERROR: ' + error.message);
            });
            //db.close()
        }, function (error) {
            //console.log('SQL batch ERROR: ' + error.message);
        });
    }, function (error) {
        //console.log('SQL batch ERROR: ' + error.message);
    });







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

    $.ajax({
        url: senderosAPI,
        cache: false,
        type: 'get',
        timeout: timeOut,
        dataType: "json",
        success: function (response) {
            db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});
            var strDelSQL = "delete from Senderos;";
            var strDelSQL2 = "delete from SenderoPuntoElevacion;";

            var strSQL = "INSERT INTO Senderos (ID, Nombre, Descripcion,LugarInicio,LugarFin,Distancia,Desnivel,DuracionTotal,AlturaMaxima) VALUES ";
            var strSQL2 = "INSERT INTO SenderoPuntoElevacion (ID, IDSendero, Latitud, Longitud, Altura) VALUES ";
            for(var i=0;i<response.Senderos.length;i++) {

                DownloadFile(RecursoWeb+response.Senderos[i].RutaImagen,"",response.Senderos[i].ID,response.Senderos[i].ID,0)

                strSQL = strSQL + "(" + response.Senderos[i].ID + ",'" + response.Senderos[i].Nombre + "','"+response.Senderos[i].Descripcion+"','"+response.Senderos[i].LugarInicio+"','"+response.Senderos[i].LugarFin+"','"+response.Senderos[i].Distancia+"','"+response.Senderos[i].Desnivel+"','"+response.Senderos[i].DuracionTotal+"','"+response.Senderos[i].AlturaMaxima+"'),"
                for(var x=0; x<response.Senderos[i].SenderoPuntoElevacion.length;x++)
                {
                    strSQL2 = strSQL2 + "(" + x + ","+response.Senderos[i].ID+", '"+response.Senderos[i].SenderoPuntoElevacion[x].Latitud+"','"+response.Senderos[i].SenderoPuntoElevacion[x].Longitud+"','"+response.Senderos[i].SenderoPuntoElevacion[x].Altura+"'),"
                }

            }
            strSQL = strSQL.slice(0,-1);
            strSQL = strSQL + ";";

            strSQL2 = strSQL2.slice(0,-1);
            strSQL2 = strSQL2 + ";";


            //Si Hay internet Sincronizo senderos limpiando la tabla.

            db.sqlBatch([
                strDelSQL,
                strDelSQL2,
                strSQL,
                strSQL2
            ], function() {
                //console.log('Clear database OK');
                window.plugins.toast.show("Los Senderos estan siendo Actualizados ","3000","bottom");
            }, function(error) {
                console.log('SQL batch ERROR: ' + error.message);
            });
        },
        error: function () {
            //window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }

    });
}


function checkInternet() //devuelve 0 si no hay conexion , 1 si hay conexion.
{
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
            window.plugins.toast.show("Online","3000","bottom");
            if ( isOffline ) {
                //local db
                window.plugins.toast.show("Offline","3000","bottom");
                return 0;
            }
            else {
                window.plugins.toast.show("Online","3000","bottom");
                return 1;
            }
        }
        return 0;

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
        //query =  "INSERT into SenderoRecursosImg (IDSendero, img) VALUES ("+id+",'"+file+"')";
        query = "insert or replace into SenderoRecursosImg (IDSendero, img) values ( (select IDSendero from SenderoRecursosImg where IDSendero = "+id+"), '"+file+"');";
    }
    else
    {
        //query =  "UPDATE Senderos Set RutZipMapa = '"+file+"'  where ID="+id;
        //query =  "INSERT into SenderoRecursosMap (IDSendero, map) VALUES ("+id+",'"+file+"')";
        query = "insert or replace into SenderoRecursosMap (IDSendero, map) values ( (select IDSendero from SenderoRecursosMap where IDSendero = "+id+"), '"+file+"');";
    }

    db.executeSql(query, [], function(rs) {

        if(filetype == 1)
        {
            alert("El mapa ha sido descargado, estara disponible sin conexion.");
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