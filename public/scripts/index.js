var playsrc = "//player.twitch.tv/?channel=";
var chatsrc = "//www.twitch.tv/";
var playchannel = false;

var streamerz =  $(".streamname");
var length = streamerz.length;
var listIndex = 0;
var playrank = 10;
var played;

function streamInfo(streamer){
$.ajax({
 type: 'GET',
 url: "https://api.twitch.tv/kraken/streams/"+ streamer.val(),
 headers: {
   'Client-ID': 'njf14eg677yrd3w8hunatcn0thi7o4x'
 },
 success: function(data) {
        if(data.stream === null){
          streamer.parent().prepend("<i class = 'fa fa-power-off offline'></i>");
        }
        else if(data.stream === undefined){
            streamer.toggleClass("dead");
            streamer.parent().prepend("<i class = 'fa fa-power-off none'></i>");
        }else{
            streamer.parent().prepend("<i class = 'fa fa-power-off online'></i>");
            var currRank = streamer.parent().find("input[type='number']").val();
            //account for asynch in json and track highest priority that is online
            if(Number(currRank) < playrank){
                playrank = currRank;
                played = streamer;

            }
            //play the highest priority
            if(listIndex >= length){
                played.parent().find(".play").show();
                playsrc += played.val();
                //all chats are lowercase at this timer
                chatsrc += played.val().toLowerCase() + "/chat?popout=";
                $("#video").attr("src", playsrc+"&output=embed");
                $("#chat").attr("src", chatsrc+"&output=embed");
                  //reset playsrc
                playsrc = "//player.twitch.tv/?channel=";
                chatsrc = "//www.twitch.tv/";

            }

        }
        console.log(streamer.val());
        channelInfo(streamer);
    }
  });
}

function channelInfo(streamer){

  $.ajax({
     type: 'GET',
     url: "https://api.twitch.tv/kraken/channels/"+ streamer.val() ,
     headers: {
       'Client-ID': 'njf14eg677yrd3w8hunatcn0thi7o4x'
     },
     success: function(data) {
            if(data.logo){
                streamer.parent().prepend("<img class='avatar' src="+data.logo+">");
            }else{
                streamer.parent().prepend("<img class='avatar' src='http://oi68.tinypic.com/24z94pz.jpg'>");
            }
            if(data.game){
              streamer.parent().append("<a href ='javascript:void(0)' class = 'gamename'>"+data.game+"</a>");
            streamer.parent().append("<br><a href='javascript:void(0)'  class='gamename'>"+data.status +"</a>")
            }else{
                streamer.parent().append("<span> Does not exist </span>");
            }
        }
    });
}


$(document).ready(function() {

    //chat size is wonky, needs to be readjusted as window is resized to not cut off text
    setInterval(function(){
        if(1447 > $("body").width() && $("body").width() > 1182){
            if($("#chat").width()<251){
            $("#chat").width("251px");
            }
        }else{
                $("#chat").width("100%");
        }
        $("#chat").attr("height", $("#video").height())
    }, 500);

    $("p").find(".chattoggle").hide();
    $(".play").hide();


      $(".streamname").each(function(){
            var streamitem = $(this);
                streamInfo(streamitem);
                listIndex++;
        });

    $("li").on("click", ".gamename" ,function(){
        var streamname = $(this).parent().find("input[type=text]").val();
            playsrc += streamname;
            chatsrc += streamname.toLowerCase() + "/chat?popout=";
            $("#video").attr("src", playsrc);
            $("#chat").attr("src", chatsrc);
            //reset playsrc
            playsrc = "//player.twitch.tv/?channel=";
            chatsrc = "//www.twitch.tv/";

            $(".play").hide();
            $(this).parent().parent().find(".play").show();
    });

     $("li").on("mouseenter",".gamename", function(){
         $(this).parent().parent().addClass("itemactive");
         $(this).parent().find("input").addClass("itemactive");
     });
     $("li").on("mouseleave",".gamename", function(){
         $(this).parent().parent().removeClass("itemactive");
         $(this).parent().find("input").removeClass("itemactive");
     });

    $("ul").on("click",".chattoggle", function(){
       $("#chat").fadeToggle();
       $("#chatDiv").toggleClass();
       $(".chattoggle").toggleClass("btn-danger");
       $(".chattoggle").toggleClass("btn-success");
       //check if chat exists
       if($("#videoDiv").hasClass("col-lg-9")){
           $("#videoDiv").removeClass("col-lg-9").addClass("col-lg-12");
            //readjust padding/margins for fullsize
           if(!$("#listdiv").hasClass("col-lg-4")){
                $("#screen").removeClass("screenattr").addClass("screenfull");
           }

       }else{

           $("#videoDiv").removeClass("col-lg-12").addClass("col-lg-9");
           //readjust padding/margins for not fullsize
             if(!$("#listdiv").hasClass("col-lg-4")){
              $("#screen").removeClass("screenfull").addClass("screenattr");
          }
       }
    });

    $("#listtoggle").on("click", function(){
       $(this).toggleClass("btn-danger");
       $(this).toggleClass("btn-success");
       $("li").fadeToggle();
       // check if list exists
       if($("#listdiv").hasClass("col-lg-4")){
           $("#listdiv").removeClass("col-lg-4");
           $("#screendiv").removeClass("col-lg-8").addClass("col-lg-12");
        //   $("p").append("<button class='btn btn-danger pull-right chattoggle'>Chat</button>");
        $("p").find(".chattoggle").show();
           //readjust padding/margins for fullsize
           if($("#videoDiv").hasClass("col-lg-12")){
                 $("#screen").removeClass("screenattr").addClass("screenfull");
           }
       }else{
           $("#listdiv").addClass("col-lg-4");
           $("#screendiv").removeClass("col-lg-12").addClass("col-lg-8");

          $("p").find(".chattoggle").hide();
           //readjust padding/margins for not fullsize
          if(!$("#videoDiv").hasClass("col-lg-9")){
              $("#screen").removeClass("screenfull").addClass("screenattr");
          }
       }
    });




});