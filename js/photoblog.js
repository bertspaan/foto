var Utils = function Utils() {

  var launchFullscreen = function(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  var exitFullscreen = function() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  function keydown(e) {
    if (e.keyCode == 70) {

      //launchFullScreen(document.documentElement);
      if(document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if(document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if(document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if(document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }

    }
  };


  document.onkeydown = keydown;

  return this;
};