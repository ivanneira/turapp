routes = [
  // {
  //   path: '/about/',
  //   url: './pages/about.html',
  // },
  // {
  //   path: '/catalog/',
  //   componentUrl: './pages/catalog.html',
  // },
  {
      path: '/noticias/',
      url: './pages/noticias.html',
  },
  {
    path: '/emergencias/',
    url: './pages/emergencias.html',
  },
  {
    path: '/ayuda/',
    url: './pages/ayuda.html',
  },
  {
    path: '/acerca/',
    url: './pages/acerca.html',
  },
  {
    path: '/recomendaciones/',
    url: './pages/recomendaciones.html',
  },
  // {
  //   path: '/product/:id/',
  //   componentUrl: './pages/product.html',
  // },
  {
    path: '/clima/',
    url: './pages/clima.html',
  },
  // Page Loaders & Router
   {
     path: '/page-loader-template7/:user/:userId/:posts/:postId/',
     templateUrl: './pages/page-loader-template7.html',
   },
   {
     path: '/page-loader-component/:user/:userId/:posts/:postId/',
     componentUrl: './pages/page-loader-component.html',
   },
   {
     path: '/request-and-load/user/:userId/',
     async: function (routeTo, routeFrom, resolve, reject) {
       // Router instance
       var router = this;

       // App instance
       var app = router.app;

       // Show Preloader
       app.preloader.show();

       // User ID from request
       var userId = routeTo.params.userId;

       // Simulate Ajax Request
       setTimeout(function () {
         // We got user data from request
         var user = {
           firstName: 'Vladimir',
           lastName: 'Kharlampidi',
           about: 'Hello, i am creator of Framework7! Hope you like it!',
           links: [
             {
               title: 'Framework7 Website',
               url: 'http://framework7.io',
             },
             {
               title: 'Framework7 Forum',
               url: 'http://forum.framework7.io',
             },
           ]
         };
         // Hide Preloader
         app.preloader.hide();

         // Resolve route to load page
         resolve(
           {
             componentUrl: './pages/request-and-load.html',
           },
           {
             context: {
               user: user,
             }
           }
         );
       }, 1000);
     },
   },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
