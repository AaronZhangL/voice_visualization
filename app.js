(function(){
    var canvas = document.querySelector("#canvas"),
        canvasCtx = canvas.getContext('2d'),
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = null,
        analyser = null,
        dataArray = null,
        navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia),


        requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame,

        render = function () {
                    requestAnimationFrame(render);
                    
                    if(analyser){
                    analyser.getByteTimeDomainData(dataArray);

                  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                  canvasCtx.lineWidth = 2;
                  canvasCtx.strokeStyle = 'rgb(0, 255, 0)';

                  canvasCtx.beginPath();

                  var sliceWidth = canvas.width * 1.0 / analyser.frequencyBinCount;
                  var x = 0;

                  for(var i = 0; i < analyser.frequencyBinCount; i++) {
               
                    var v = dataArray[i] / 128.0;
                    var y = v * canvas.height/2;

                    if(i === 0) {
                      canvasCtx.moveTo(x, y);
                    } else {
                      canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                  }

                  canvasCtx.lineTo(canvas.width, canvas.height/2);
                  canvasCtx.stroke();       
                  }             

                };



        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;



        if(navigator.getUserMedia){

        navigator.getUserMedia(
                {
                    video:false,
                    audio:true
                },
                function(sourceStream){
                    source = audioCtx.createMediaStreamSource(sourceStream);
                    analyser = audioCtx.createAnalyser();

                    analyser.fftSize = 2048;

                    dataArray = new Uint8Array(analyser.frequencyBinCount);

                    source.connect(analyser);

                    analyser.connect(audioCtx.destination);
                    requestAnimationFrame(render);

                },
                function(err){
                    //throw some error.
                }
            );

        }


        




})();