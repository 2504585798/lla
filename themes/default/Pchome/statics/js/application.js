function search(event) {
  var key = event.which || event.keyCode;
  var input = Event.element(event);
  if (key == 13) {
    carousel.scrollTo(parseFloat(input.value) - 1)
    Event.stop(event);
    return false;
  }
}                          
Application =  {  
  addRightColumn2: function() {
    document.write('\
    	  <div id="navigation">\
          toto  </div>\
        ');    
  },
addRightColumn: function() {
  document.write('\
  	  <div id="navigation">\
        <div id="nm">\
  \
        <a href="http://www.neomeeting.net"><img border=0 width=187 src="/images/neomeeting.png"/></a>\
        Conduct live meeting over internet\
  \
        </div>\
        <div id="g">\
        <script type="text/javascript">\
        google_ad_client = "pub-3593675344652080";\
        google_ad_width = 120;\
        google_ad_height = 600;\
        google_ad_format = "120x600_as";\
        google_ad_type = "text_image";\
        google_ad_channel = "1401878792+2664779569+8025923418+4188663988+8193138037";\
        google_color_border = "F0F0F0";\
        google_color_bg = "F0F0F0";\
        google_color_link = "24CCFF";\
        google_color_text = "000000";\
        google_color_url = "FF4F69";\
        </script>\
        <script type="text/javascript"\
          src="http://pagead2.googlesyndication.com/pagead/show_ads.js">\
        </script>\
        </div>\
      </div>\
  ');    
  setTimeout(Application.moveFrame, 100);

  },

  moveFrame: function() {
    var f =$$("iframe")[0]; 
    if (f) {
      $("g").appendChild(f)
    }
    else
      setTimeout(Application.moveFrame, 100)
  }
}