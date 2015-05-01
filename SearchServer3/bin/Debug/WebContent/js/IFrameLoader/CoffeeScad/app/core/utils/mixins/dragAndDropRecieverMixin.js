(function() {
  define(function(require) {
    var DragAndDropRecieverMixin;
    DragAndDropRecieverMixin = (function() {
      function DragAndDropRecieverMixin() {}

      DragAndDropRecieverMixin.prototype.handleDragEnter = function(e) {};

      DragAndDropRecieverMixin.prototype.handleDragLeave = function(e) {};

      DragAndDropRecieverMixin.prototype.handleDrop = function(e) {
        var file, files, _i, _len;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        e.preventDefault();
        files = e.dataTransfer.files;
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          console.log("dropped file", file);
        }
        return false;
      };

      DragAndDropRecieverMixin.prototype.handleDragEnd = function(e) {};


      /*
      events:
      'dragover': 'onDragOver'
        'dragenter': 'onDragEnter'
        'dragexit' :'onDragExit'
        'drop':'onDrop'
      ui:
        dropOverlay: "#dropOverlay"
      
      onDragOver:(e)=>
        e.preventDefault()
        e.stopPropagation()
         *console.log "event", e
         *console.log "e.dataTransfer",e.dataTransfer
         *offset = e.dataTransfer.getData("text/plain").split(',');
        dm = @ui.dropOverlay[0]
         *console.log "dm", dm
        dm.style.left = (e.clientX + e.offsetX) + 'px'
        dm.style.top = (e.clientY + e.offsetY) + 'px'
        
        dm.style.left =e.originalEvent.clientX+'px'
        dm.style.top = e.originalEvent.clientY+'px'
        
      onDragEnter:(e)->
        @ui.dropOverlay.removeClass("hide")
      
      onDragExit:(e)=>
        @ui.dropOverlay.addClass("hide")
        
      onDrop:(e)->
         * this / e.target is current target element.
        if (e.stopPropagation)
          e.stopPropagation()
        e.preventDefault()
        
        @ui.dropOverlay.addClass("hide")
        
        files = e.originalEvent.dataTransfer.files
        for file in files
          console.log "dropped file", file
          
          do(file)=>
            name = file.name
            ext = name.split(".").pop()
            if ext == "coffee"
              
              reader = new FileReader()
              reader.onload=(e) =>
                fileContent = e.target.result
                console.log "fileContent",fileContent
              reader.readAsText(file)
             
               *reader.onload = ((fileHandler)->
         * See the section on the DataTransfer object.
        return false
       */

      return DragAndDropRecieverMixin;

    })();
    return DragAndDropRecieverMixin;
  });

}).call(this);
