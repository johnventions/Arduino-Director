function getMousePosition(evt, el) {
    var svg = $(el).parent('svg')[0];
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

function drag(evt) {
    if (selectedElement) {
        evt.preventDefault();
        var coord = getMousePosition(evt, selectedElement);
        selectedElement.setAttributeNS(null, "cx", coord.x);
        selectedElement.setAttributeNS(null, "cy", coord.y);
    }
}

function makeDraggable(el) {
    function startDrag(evt) {
        selectedElement = el;
        console.log("Start drag");
    }
    
    function endDrag(evt) {
        selectedElement = null;
    }
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('mouseup', endDrag);
    // el.addEventListener('mouseleave', endDrag);
}

document.addEventListener('mousemove', drag);
