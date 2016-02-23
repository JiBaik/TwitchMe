var imagelinks = ["http://oi67.tinypic.com/30iktts.jpg", "http://oi67.tinypic.com/684fhj.jpg", "http://oi65.tinypic.com/2qu3p5y.jpg"];
var image=0;

$(document).ready(function(){
    $("#howtolinks").find("img").attr("src",imagelinks[image]);
    $("#howtolinks").find("a").attr("href",imagelinks[image]);    
    
    $(".left").on("click", function(){
        image-=1;
        if(image<0){
            image = 2;
        }
         $("#howtolinks").find("img").attr("src",imagelinks[image]);
         $("#howtolinks").find("a").attr("href",imagelinks[image]);   
    });
    
        $(".right").on("click", function(){
        image+=1;
        if(image>2){
            image = 0;
        }
         $("#howtolinks").find("img").attr("src",imagelinks[image]);
         $("#howtolinks").find("a").attr("href",imagelinks[image]);   
    })
});