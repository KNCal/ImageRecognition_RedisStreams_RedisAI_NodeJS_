(function() {
    // var ws = new WebSocket('ws://localhost:4000/tweet');
    var ws = new WebSocket('ws://localhost:4000/tweets');
    var form = document.querySelector('.form');
  
    form.onsubmit = function() {
      var input = document.querySelector('.input'); 
      var text = input.value;
      ws.send(text);
      input.value = '';
      input.focus();
      return false;
    }
    
    ws.onmessage = function(msg) {
      var response = msg.data;
    }




  }());
  





