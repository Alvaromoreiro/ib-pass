import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from '../manage/ibe_common';
const { quadrigam } = retrieveGlobalVariables();

$(document).ready(() => {
  //Evento view
  digital_data.Quadrigam = quadrigam;
  updateDigitalData('view');
});


let plansSaveURL = document.querySelectorAll(".saveImagePlansStopOver");
plansSaveURL.forEach(function(button){
  button.addEventListener("click", function(){
    saveImage(this);
  })
})

let buttonzoomOut = document.getElementById("buttonZoomOut");
let buttonzoomIn = document.getElementById("buttonZoomIn");
let zoomPlans = document.getElementById("zoomRouteOneDay");
let idSelector = document.getElementById("idSelector");


function saveImage(button) {
  window.zoomValue = 1;
  window.mouseOverButton = false;
  buttonzoomIn.disabled = false;
  buttonzoomIn.style.color = "white";
  buttonzoomOut.disabled = true;
  buttonzoomOut.style.color = "lightgrey";
  let etFigure = button.closest("figure"),
  tagIMG = etFigure.querySelector("img"),
  imgSave = document.getElementById("zoomRouteOneDay");
  let imgURL = tagIMG.getAttribute('src');
  let img = new Image();
  window.imageSrc = imgURL;
  img.src = imgURL;
  img.onload = () => {
    let ratio = img.naturalWidth / img.naturalHeight;
    window.ratioValue = ratio;
    Object.assign(imgSave.style, {
      backgroundImage: 'url('+ imgURL +')',
      aspectRatio: ratio,
      backgroundPosition: "center",
      backgroundSize: "cover"
    });
  }
}


function initialZoom() {
  let container = document.getElementById("zoomRouteOneDay");
  let imgsrc = container.currentStyle || window.getComputedStyle(container, false);
  imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, "");
  parent = document.getElementsByClassName("modal-dialog--route");
  let img = new Image();

  img.src = imgsrc;
  img.onload = () => {
    let ratio = img.naturalWidth / img.naturalHeight;
    Object.assign(container.style, {
      backgroundImage: 'url('+ window.imageSrc +')',
      aspectRatio: ratio,
      backgroundPosition: "center",
      backgroundSize: "cover"
    });
  }
}

zoomPlans.onmousemove = function zoomMoveAction(event) {
  if (window.zoomValue !== 1 && !window.mouseOverButton) {
    let container = document.getElementById("zoomRouteOneDay"),
      imgsrc = container.currentStyle || window.getComputedStyle(container, false);
    imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, "");
    parent = document.getElementsByClassName("modal-dialog--route");
    let img = new Image();
    img.src = imgsrc;
    img.onload = () => {
      let ratio = img.naturalWidth / img.naturalHeight,
        percentage = ratio * 100 + "%";
      Object.assign(container.style, {
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
      container.onmousemove = (e) => {
        if (window.zoomValue !== 1 && !window.mouseOverButton) {
          let rect = e.target.getBoundingClientRect();
          let xPos = e.clientX - rect.left;
          let yPos = e.clientY - rect.top,
            xPercent = xPos / (container.clientWidth / 100) + "%",
            yPercent = yPos / ((container.clientWidth * ratio) / 100) + "%";
          //cambiando el backgroundSize ampliamos el zoom
          Object.assign(container.style, {
            backgroundPosition: xPercent + " " + yPercent,
            backgroundSize: parent[0].getBoundingClientRect().width * window
              .zoomValue + "px"
          })
        }
      }
      container.onmouseleave = (e) => {
        if (window.zoomValue !== 1) {
          Object.assign(container.style, {
            backgroundPosition: "center",
            backgroundSize: "cover"
          })
        }
      }
    }
  }
}
idSelector.onmousemove = function zoomMoveBtn(){
  window.mouseOverButton = true;
}
idSelector.onmouseleave = function zoomLeaveBtn(){
  window.mouseOverButton = false;
}

buttonzoomIn.addEventListener('click', ()=>{
  window.zoomValue = window.zoomValue + 0.1;
  window.zoomValue = Math.round(window.zoomValue * 10) / 10;

  //code to disable and change button color
  let buttonIn = document.getElementById("buttonZoomIn");
  let buttonOut = document.getElementById("buttonZoomOut");
  buttonOut.disabled = false;
  buttonOut.style.color = "white";
  if (window.zoomValue === 1.5) {
    buttonIn.disabled = true;
    buttonIn.style.color = "lightgrey"
  }					
  applyZoom();
})

buttonzoomOut.addEventListener('click', ()=>{
  window.zoomValue = window.zoomValue - 0.1;
  window.zoomValue = Math.round(window.zoomValue * 10) / 10;
  //code to disable and change button color
  let buttonOut = document.getElementById("buttonZoomOut");
  let buttonIn = document.getElementById("buttonZoomIn");
  buttonIn.disabled = false;
  buttonIn.style.color = "white";
  if (window.zoomValue === 1) {
    buttonOut.disabled = true;
    buttonOut.style.color = "lightgrey";
    initialZoom();
  }
  else {
    applyZoom();
  }
})

function applyZoom() {
  let container = document.getElementById("zoomRouteOneDay"),
  imgsrc = container.currentStyle || window.getComputedStyle(container, false);
  imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, "");
  parent = document.getElementsByClassName("modal-dialog--route");
  let img = new Image();
  img.src = imgsrc;
  
  img.onload = () => {
    let ratio = img.naturalWidth / img.naturalHeight;
    Object.assign(container.style, {
      backgroundImage: 'url('+ window.imageSrc +')',
      aspectRatio: ratio,
      backgroundPosition: "center",
      backgroundSize: parent[0].getBoundingClientRect().width * window.zoomValue + "px"
    });
  }
}

document.querySelector('.ruta1ID').addEventListener('click', function() {
    const eventDescarga1 = {
    eventName: 'interaccion',
    eventCategory: 'hm planes recomendados',
    eventAction: 'clic',
    eventLabel: 'dia1 descargar guia',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
    window.DigitalChange('interaction', eventDescarga1);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
    window.dataLayer.push(eventDescarga1, { event: 'interaction' });
  }
});
document.querySelector('.ruta2ID').addEventListener('click', function() {
    const eventDescarga2 = {
    eventName: 'interaccion',
    eventCategory: 'hm planes recomendados',
    eventAction: 'clic',
    eventLabel: 'dia2 descargar guia',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
    window.DigitalChange('interaction', eventDescarga2);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
    window.dataLayer.push(eventDescarga2, { event: 'interaction' });
  }
});
document.querySelector('.ruta3ID').addEventListener('click', function() {
  const eventDescarga3 = {
    eventName: 'interaccion',
    eventCategory: 'hm planes recomendados',
    eventAction: 'clic',
    eventLabel: 'dia3 descargar guia',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
    window.DigitalChange('interaction', eventDescarga3);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
    window.dataLayer.push(eventDescarga3, { event: 'interaction' });
  }
});
document.getElementById('tab1Rutas').addEventListener('click', function() {
    const eventDia1 = {
    eventName: 'interaccion',
    eventCategory: 'hm planes recomendados',
    eventAction: 'clic',
    eventLabel: 'tab1dia',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
    window.DigitalChange('interaction', eventDia1);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
    window.dataLayer.push(eventDia1, { event: 'interaction' });
  }
});
document.getElementById('tab2Rutas').addEventListener('click', function() {
    const eventDia2 = {
    eventName: 'interaccion',
    eventCategory: 'hm planes recomendados',
    eventAction: 'clic',
    eventLabel: 'tab2dias',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
    window.DigitalChange('interaction', eventDia2);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
    window.dataLayer.push(eventDia2, { event: 'interaction' });
  }
});
document.getElementById('tab3Rutas').addEventListener('click', function() {
    const eventDia3 = {
    eventName: 'interaccion',
    eventCategory: 'hm planes recomendados',
    eventAction: 'clic',
    eventLabel: 'tab3dias',
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
    window.DigitalChange('interaction', eventDia3);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
    window.dataLayer.push(eventDia3, { event: 'interaction' });
  }
});

//Carrusel -> enlace ver ficha
$('.experience-file').click(function () {
  var title = $(this).attr('data-name');
  const eventData = {
      eventName: 'interaccion',
      eventCategory: 'hm planes recomendados',
      eventAction: 'clic',
      eventLabel: 'ver ficha: ' + title,
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }
});
//Carrusel -> enlace imagen
$('.experience-image').click(function () {
  var title = $(this).attr('data-name');
  const eventData = {
      eventName: 'interaccion',
      eventCategory: 'hm planes recomendados',
      eventAction: 'clic',
      eventLabel: 'imagen ficha: ' + title,
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }
});
//Carrusel -> enlace titulo
$('.experience-title').click(function () {
  var title = $(this).attr('data-name');
  const eventData = {
      eventName: 'interaccion',
      eventCategory: 'hm planes recomendados',
      eventAction: 'clic',
      eventLabel: 'titulo ficha: ' + title,
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }
});
//Carrusel -> Ver todas las experiencias
$('.experience-carousel-all').click(function () {
  var title = $(this).html();
  title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'').toLowerCase();
  const eventData = {
      eventName: 'interaccion',
      eventCategory: 'hm planes recomendados',
      eventAction: 'clic',
      eventLabel: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }
});

