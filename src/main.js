// Main.js: Implementation of getUserMedia API

/*global recordVideo:false, snapShot:false, draw:false, maskArray:false, createMaskArray:false, paint: false, paintArray:false, createPaintArray:false, erase:false  */

//Select html element id's
var v = document.querySelector('#main-video'),
    c = document.querySelector('#main-canvas'),
    image = document.querySelector('#main-image'),
    //canvas x cord size
    x = c.getContext('2d'),
    hl = document.querySelector('#highlight'),
    localStream,

    //dimensions
    h = 570,
    w = 760,

    erasing,
    painting,
    colorChoice,
    colorValue,
    paintArray,
    bgPaintArray,
    elementAttr,
    pencilClass,
    currentText,
    wordArray,
    mode;

var pixelDataArray = function(elem) {
  var rowArr, arr = [];
  for(var ri = 0; ri < h; ri++) {
    rowArr = [];
    for(var ci = 0; ci < w; ci++) {
      rowArr.push(elem);
    }
    arr.push(rowArr);
  }
  return arr;
};

var colorChooser = function() {
  switch(colorChoice) {
    case 'red':
    colorValue=[255,0,0,255]; break;
    case 'orange':
    colorValue=[255,165,0,255]; break;
    case 'yellow':
    colorValue=[255,255,0,255]; break;
    case 'green':
    colorValue=[0,255,0,255]; break;
    case 'blue':
    colorValue=[30,144,255,255]; break;
    case 'purple':
    colorValue=[128,0,128,255]; break;
    case 'black':
    colorValue=[0,0,0,255]; break;
    case 'white':
    colorValue=[255,255,255,255]; break;
  };
};

var isGreen = function(ha,s,l) {
  return (ha >= 75 && ha <= 165 &&
           s >= 25 && s <= 90 &&
           l >= 20 && l <= 95)
};

//Set dimensions for elmements
$('#main-video').attr('width', w +'px').attr('height', h + 'px');

$('#main-canvas').attr('width', w +'px').attr('height', h + 'px');

$('#main-image').attr('width', w +'px').attr('height', h + 'px');

//Detect browser compatibility
var hasGetUserMedia = function(){
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
};

//If the user does have one of the follow navigators
if(hasGetUserMedia()){
  //Set window url to the user's specified browser
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia  = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  //List of all button functionalities
  $('#start-button').on('click', function(){
    //look at record.js for funcitonality
    recordVideo();
    //change text for directions
   $('#start-button p').text('Restart');

    $('#textarea').text('Press the allow button up top to start!');
  });

  $('#eraser-button').on('click', function(){
    if(paintArray === undefined) {
      $('#textarea').text('Please click start to begin painting');
    } else {
      painting = false;
      erasing = true;
      eraser();
    }
  });

  $('#picture-button').on('click', function(){
    mode = 'background';
    snapShot();
    $('#main-canvas').css('background-image', 'url(' + dataURL + ')');
    $('#main-canvas').css('background-size', 'cover');
    if(bgPaintArray === undefined) {
      bgPaintArray = createBgPaintArray();
    }
    painting = true;
    erasing = false;
    background();
  });

  $('#paint-button').on('click', function(){
    if($('video').attr('src')){
      if(!colorChoice){
        colorChoice = 'black';
        $('#textarea').text('You are painting with ' + colorChoice).removeClass('brown-pencil').addClass(colorChoice + '-pencil');
      } else if(colorChoice === 'black') {
        $('#textarea').text('Would you like to try more colors');
      }
      $('.color-palette').fadeIn(400);
      $('#main-video').css('display', 'none');
      $('#main-canvas').css('display', 'inline-block');
      if(paintArray === undefined) {
        paintArray = createPaintArray();
      };
      painting = true;
      erasing = false;
      if(mode === 'background'){
        background();
      } else {
        paint();
      }
    } else {
      $('#textarea').text('Please click start to begin painting');
    }
  });

  $('#speech-button').on('click',function(){
    if($('video').attr('src')){
      $('canvas').show();
      console.log('recording...');
      toggleStartStop();

      //Custom bind function
      $('#textarea').bind('newWord', function(e){
        console.log(e);
        currentText = $(this).text();
        wordArray = currentText.split(' ');
        elementAttr = $('#textarea').attr('class').split(' ');
        pencilClass = elementAttr[elementAttr.length-1];
        colorChoice = wordArray[wordArray.length-1];
        $('#textarea').text('You are painting with ' + colorChoice).removeClass(pencilClass).addClass(colorChoice + '-pencil');
        $('.pencil-tip').css('border-bottom', '12px solid ' + colorChoice);
        $('#main-video').css('display', 'none');
        if(paintArray === undefined) {
          paintArray = createPaintArray();
        };
        painting = true;
        erasing = false;
        console.log(mode);
        colorChooser();
        if(mode === 'background'){
          console.log('in background..', colorChoice);
          background();
        } else {
          console.log('in picture..', colorChoice);
          paint();
        }
      });
    } else {
      $('#textarea').text('Please click start to begin painting').css('color', 'red').css('border', '4px dotted red');
    }
  });

  $('li').on('click', function(){
    colorChoice = $(this).attr('class');
    elementAttr = $('#textarea').attr('class').split(' ');
    pencilClass = elementAttr[elementAttr.length-1];
    colorChooser();
    $('#textarea').text('You are painting with ' + colorChoice).removeClass(pencilClass).addClass(colorChoice + '-pencil');
    $('.pencil-tip').css('border-bottom', '12px solid ' + colorChoice);
  });

  $('#save-button').on('click', function(){
    console.log('stopping..');
    localStream.stop();
    $('.color-palette').fadeOut(400);
    $('#main-video').css('display', 'none');
    $('#main-canvas').css('visibility', 'visible');
    saveImage();
  });

} else {
  //no modern browser detected...fallback?
  alert('please use a better browser');
}
