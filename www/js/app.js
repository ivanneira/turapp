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

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.sanjuansalud.turApp', // App bundle ID
  name: 'turApp', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  // data: function () {
  //   return {
  //     user: {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //     },
  //     // Demo products for Catalog section
  //     products: [
  //       {
  //         id: '1',
  //         title: 'Apple iPhone 8',
  //         description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
  //       },
  //       {
  //         id: '2',
  //         title: 'Apple iPhone 8 Plus',
  //         description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
  //       },
  //       {
  //         id: '3',
  //         title: 'Apple iPhone X',
  //         description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
  //       },
  //     ]
  //   };
  // },
  // // App root methods
  // methods: {
  //   helloWorld: function () {
  //     app.dialog.alert('Hello World!');
  //   },
  // },
  // App routes
  routes: routes,
});


// Init/Create views
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

// // Login Screen Demo
// $$('#my-login-screen .login-button').on('click', function () {
//   var username = $$('#my-login-screen [name="username"]').val();
//   var password = $$('#my-login-screen [name="password"]').val();
//
//   // Close login screen
//   app.loginScreen.close('#my-login-screen');
//
//   // Alert username and password
//   app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
// });

// app.on('pageInit', function (page) {
//     // do something on page init
//     console.dir(page)
// });


(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.addEventListener("offline", offline, false);
    document.addEventListener("online", online, false);
} )();

function onDeviceReady() {



    internet = checkInternet();
    //alert(checkInternet());
    document.addEventListener("backbutton", onBackKeyDown, false);

    //FORZADO DE ACTIVACION DE GPS EN LAS PLATAFORMAS
    //requestPermissionGPS();

    Database(db);


    //Controlar la pausa de Cordova y reanudar eventos
    document.addEventListener( 'pause', onPause.bind( this ), false );
    document.addEventListener( 'resume', onResume.bind( this ), false );

    // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.

};
//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, Folder_Name, File_Name,id,filetype) {
//Parameters mismatch check
    if (URL == null && Folder_Name == null && File_Name == null) {
        return;
    }
    else {
        //checking Internet connection availablity
        var networkState = navigator.connection.type;
        if (networkState == Connection.NONE) {
            return;
        } else {
           return download(URL, Folder_Name, File_Name,id,filetype); //If available download function call
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
        console.log('Downloaded:  ' + percent + '%');
        window.plugins.toast.show("Progreso: "+ percent + "%","50","bottom");
    };

// File download function with URL and local path
      fileTransfer.download(download_link, fp,
        function (entry) {
            //alert("download complete: " + entry.toURL());
            //$$("#view-home").append("<img src='"+entry.toURL()+"'>")
            console.log("complete")
            UpdateFilePathDB(entry.toURL(),id,filetype)
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

function onPause() {
    // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
};

function onResume() {
    // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
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
        app.popup.close();
		return false;
        }else{
            navigator.app.clearHistory(); navigator.app.exitApp(); 
        return true;
    }
}

function Database(db) {
    db = window.sqlitePlugin.openDatabase({name: 'turapp.db', location: 'default'});

    //Creo la tabla Senderos
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

            var strSQL = "INSERT INTO Senderos (ID, Nombre,Imglocation, Descripcion,LugarInicio,LugarFin,Distancia,Desnivel,DuracionTotal,AlturaMaxima) VALUES ";
            var strSQL2 = "INSERT INTO SenderoPuntoElevacion (ID, IDSendero, Latitud, Longitud, Altura) VALUES ";
            for(var i=0;i<response.Senderos.length;i++) {

                DownloadFile(RecursoWeb+response.Senderos[i].RutaImagen,"",response.Senderos[i].ID,response.Senderos[i].ID,0)

                strSQL = strSQL + "(" + response.Senderos[i].ID + ",'" + response.Senderos[i].Nombre + "','','"+response.Senderos[i].Descripcion+"','"+response.Senderos[i].LugarInicio+"','"+response.Senderos[i].LugarFin+"','"+response.Senderos[i].Distancia+"','"+response.Senderos[i].Desnivel+"','"+response.Senderos[i].DuracionTotal+"','"+response.Senderos[i].AlturaMaxima+"'),"
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

    if(filetype == 0)
    {
        query =  "UPDATE Senderos Set Imglocation = '"+file+"' where ID="+id;
    }
    else
    {
        query =  "UPDATE Senderos Set RutZipMapa = '"+file+"'  where ID="+id;
    }

    db.executeSql(query, [], function(rs) {
        return rs;

    }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });

}
//*************
//    Unzip
//*************
//var PathToFileInString  = cordova.file.externalRootDirectory+"HereIsMyFolder",
//    PathToResultZip     = cordova.file.externalRootDirectory;
//JJzip.zip(PathToFileInString, {target:PathToResultZip,name:"SuperZip"},function(data){
//    /* Wow everiting goes good, but just in case verify data.success*/
//},function(error){
//    /* Wow something goes wrong, check the error.message */
//})

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