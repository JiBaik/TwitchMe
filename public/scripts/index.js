var playsrc = "//player.twitch.tv/?channel=";
var chatsrc = "//www.twitch.tv/";
var playchannel = false;


function streamInfo(streamer){
$.getJSON("https://api.twitch.tv/kraken/streams/"+ streamer.val()+"?callback=?" , function(data){
        if(data.stream === null){
          streamer.parent().prepend("<i class = 'fa fa-power-off offline'></i>");
        }
        else if(data.stream === undefined){
            streamer.toggleClass("dead");
            streamer.parent().prepend("<i class = 'fa fa-power-off none'></i>");
        }else{
            streamer.parent().prepend("<i class = 'fa fa-power-off online'></i>");
            //play the first one that's online as it iterates synchronously
            if(!playchannel){
                 streamer.parent().parent().find(".play").show();
                 playsrc += streamer.val();
                 chatsrc += streamer.val() + "/chat?popout=";
                 $("#video").attr("src", playsrc);
                 $("#chat").attr("src", chatsrc);
                 playchannel = true;
                 //reset playsrc
                 playsrc = "//player.twitch.tv/?channel="; 
                 chatsrc = "//www.twitch.tv/";
                 playchannel = true;
            }
     
        }
        //get info in order 
        channelInfo(streamer);
    })
}

function channelInfo(streamer){
    $.getJSON("https://api.twitch.tv/kraken/channels/"+ streamer.val()+"?callback=?" , function(data){
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
    });
}
     

$(document).ready(function() {
    var timeout = 30;
    //resize chat to same as video periodically(incase screen size change)
    setInterval(function(){$("#chat").attr("height", $("#video").height())}, 500);
    $("p").find(".chattoggle").hide();
    $(".play").hide();
    
       $(".streamname").each(function(){
            var streamitem = $(this);
            //acounts for asynch in json within nested function above
            setTimeout(function(){
                streamInfo(streamitem);
            }, timeout += 30);
        });

            

    //change video played to clicked
    $("li").on("click", ".gamename" ,function(){
        var streamname = $(this).parent().find("input[type=text]").val();
            playsrc += streamname;
            chatsrc += streamname + "/chat?popout=";
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
       if($("#videoDiv").hasClass("col-md-9")){
           $("#videoDiv").removeClass("col-md-9").addClass("col-md-12");
            //readjust padding/margins for fullsize
           if(!$("#listdiv").hasClass("col-lg-4")){
                $("#screen").removeClass("screenattr").addClass("screenfull");
           }
          
       }else{
           
           $("#videoDiv").removeClass("col-md-12").addClass("col-md-9");
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
        
        $("p").find(".chattoggle").show();
           //readjust padding/margins for fullsize
           if($("#videoDiv").hasClass("col-md-12")){
                 $("#screen").removeClass("screenattr").addClass("screenfull");
           }
       }else{
           $("#listdiv").addClass("col-lg-4");
           $("#screendiv").removeClass("col-lg-12").addClass("col-lg-8");
          
          $("p").find(".chattoggle").hide();
           //readjust padding/margins for not fullsize
          if(!$("#videoDiv").hasClass("col-md-9")){
              $("#screen").removeClass("screenfull").addClass("screenattr");
          }
       }
    });

   

        
});