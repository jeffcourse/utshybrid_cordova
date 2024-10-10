var $$ = Dom7;

var device = Framework7.getDevice();

function getComics(vsearch) {
  app.request.post(
    "https://ubaya.fun/hybrid/160420097/searchcomic.php", { "search": vsearch },
    function (data) {
      var arr = JSON.parse(data);
      var comics_api = arr['data'];
      for (var i = 0; comics_api.length; i++) {
        $$("#ul_listcomics").append("<li><a href='/readcomic/" + comics_api[i]['id_komik'] + "'>" + comics_api[i]["judul"] + "</a></li>");
      }
    }
  )
}

var app = new Framework7({
  name: 'F7-160420097-Komiku', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'io.framework7.myapp', // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }

      $$(document).on('page:afterin', function (e, page) {       
        if(!localStorage.username) { 
           page.router.navigate('/login/');
        }
        else{
          $$('#div_hello').html('Hello '+localStorage.username+", Welcome to Komiku");
        }
      });

      $$(document).on('page:init', function (e, page) {
        if (page.name == 'login'){
          $$('#btnsignin').on('click', function() {
              app.request.post('https://ubaya.fun/hybrid/160420097/login.php?', 
              { "user_name":$$("#username").val(),
              "user_password":$$("#password").val() } , 
              function (data) {
                var arr = JSON.parse(data);     
                var result=arr['result'];
                var id=arr['user_id'];
                if(result=='success'){  
                  localStorage.username = $$("#username").val();
                  localStorage.id = id;
                  page.router.back('/'); 
                }else app.dialog.alert('Username or Password is wrong');
              });
          });
        }
        if(page.name == "categories"){
          var id=1;
          app.request.post("https://ubaya.fun/hybrid/160420097/category.php",{},
          function (data) {
            var arr = JSON.parse(data); 
            category=arr['data'];
            for(var i=0; i < category.length; i++) {
              $$("#categories").append("<div class='col-50'><div class='card' style='background-color: cyan;'>"+
              "<div class='card-header'>" + category[i]["nama"] +
              "</div><div class='card-content'>"+
              "<a href='/comiclist/" + id + "'><img src='"+ category[i]["url_kategori"] + "' width='100%'></a>"+ 
              "</div></div></div>");
              id++;
            }
          });
        }
        if(page.name == 'comiclist'){
          var id = page.router.currentRoute.params.id;
          app.request.post(
            "https://ubaya.fun/hybrid/160420097/comiclist.php", { "id": id },
            function(data){
              var arr = JSON.parse(data);
              comics = arr['data'];
              for(var i=0; i < comics.length; i++){
                $$('#comiclists').append(
                  "<div class='col-50'><div class='card' style='background-color: cyan;'>" +
                  "<div class='card-header'>" + comics[i]["judul"] +
                  "</div><div class='card-content'>" +
                  "<a href='/readcomic/" + comics[i]["id_komik"] + "'><img src='" + comics[i]["url_poster"] + "' width='100%'></a>" +
                  "<br><div class='block'><p>" + comics[i]["sinopsis"] + 
                  "</p></div></div></div></div>");
              }
            });
        }
        if(page.name == 'readcomic'){
          var id = page.router.currentRoute.params.id;
          app.request.post(
            "https://ubaya.fun/hybrid/160420097/readcomic.php", { "id": id },
            function(data){
              var arr = JSON.parse(data);
              page = arr['data'];
              for(var i=0; i < page.length; i++){
                $$('#ul_readlist').append(
                  "<div class='card'>" +
                  "<div class='card-content'>" +
                  "<img src='" + page[i]["url_halaman"] + "' width='100%'>" +
                  "<br></div></div>");
              }
          });

          $$('#favorite').on('click', function() {
            app.request.post('https://ubaya.fun/hybrid/160420097/myfavorite.php', 
            { "id_komik":id,"user_id":localStorage.id} , 
            function (data) {
              var arr = JSON.parse(data);     
              var result=arr['result'];
              if(result=='success')
              {
                app.dialog.alert('Successfully added to My Favorite');
              }
              else app.dialog.alert('Comic is already in My Favorite!');
            });
          });

          $$('#unfavorite').on('click', function() {
            app.request.post('https://ubaya.fun/hybrid/160420097/removefav.php', 
            { "id_komik":id,"user_id":localStorage.id} , 
            function (data) {
              var arr = JSON.parse(data);     
              var result=arr['result'];
              if(result=='success')
              {
                app.dialog.alert('Successfully Removed');
              }
              else app.dialog.alert('Comic is not in My Favorite!');
            });
          });

          $$('#btnsubmit').on('click', function() {
            app.request.post('https://ubaya.fun/hybrid/160420097/newrating.php', 
            { "id_komik":id,"user_id":localStorage.id, "rating":$$("#txt_rating").val()} , 
            function (data) {
              var arr = JSON.parse(data);     
              var result=arr['result'];
              if(result=='success')
              {
                app.dialog.alert('Added Successfully');
              }
              else app.dialog.alert('Rate Score is the same as previous one');
            });
          });

          $$('#btnadd').on('click', function() {
            app.request.post('https://ubaya.fun/hybrid/160420097/newcomment.php', 
            { "id_komik":id,"user_id":localStorage.id, "komentar":$$("#txt_comment").val()} , 
            function (data) {
              var arr = JSON.parse(data);     
              var result=arr['result'];
              if(result=='success')
              {
                app.dialog.alert('Added succesfully');
              }
              else app.dialog.alert('Submission failed');
            });
          });
          
          app.request.post(
            "https://ubaya.fun/hybrid/160420097/getrating.php", { "id": id},
            function(data){
              var arr = JSON.parse(data);
              rating = arr['data'];
              for(var i=0; i < rating.length; i++){
                $$('#rating').append(
                  "<p>Comic Rating: " + rating[i]["totalrating"] + "</p>");
                $$('#jmlRating').append(
                  "<p>Rated by: " + rating[i]["countrating"] + " person(s)</p>");
              }
          });

          app.request.post(
            "https://ubaya.fun/hybrid/160420097/getJmlComment.php", { "id": id},
            function(data){
              var arr = JSON.parse(data);
              jmlComment = arr['data'];
              for(var i=0; i < jmlComment.length; i++){
                $$('#jmlComment').append(
                  "Comments: " + jmlComment[i]["countkomentar"]);
              }
          });

          app.request.post(
            "https://ubaya.fun/hybrid/160420097/getcomment.php", { "id": id},
            function(data){
              var arr = JSON.parse(data);
              comment = arr['data'];
              for(var i=0; i < comment.length; i++){
                $$('#ul_comments').append(
                  "<p>&nbsp;&nbsp;" + comment[i]["user_name"] + ": " + comment[i]["komentar"] + "</p>");
              }
          });
        }
        if(page.name == 'myfavorites'){
          app.request.post(
            "https://ubaya.fun/hybrid/160420097/detailfavorite.php", { "id": localStorage.id },
            function(data){
              var arr = JSON.parse(data);
              comics = arr['data'];
              for(var i=0; i < comics.length; i++){
                $$('#favorites').append(
                  "<div class='col-50'><div class='card' style='background-color: cyan;'>" +
                  "<div class='card-header'>" +
                  comics[i]["judul"] +
                  "</div><div class='card-content'>" +
                  "<a href='/readcomic/" + comics[i]["id_komik"] + "'><img src='" + comics[i]["url_poster"] + "' width='100%'></a>" +
                  "<br><div class='block'><p>" +
                  comics[i]["sinopsis"] +
                  "</p></div></div></div></div>");
              }
           });
        }
        if (page.name == "searchcomic") {
          getComics();
          $$('#btnsearch').on('click', function () {
            $$("#ul_listcomics").html(" ");
            getComics($$('#txtsearch').val());
          })
        }

      $$("#logout").on('click', function () {
        localStorage.removeItem("username");
        app.dialog.alert("Logout Successfully");
        app.views.main.router.navigate('/login/');
      });
    },
  )},
}});