/**
 * Represents ibe-chart.js
 * @constructor
 * @author ccasalen
 * @description Example of description - This is a component of charts
 * @param {string} [type="hola"] - type of chart
 * @param {string} [color="grey"] - Color of chart
 * @returns {function} dFrontJs.ibe_chart.init()
 * @example dFrontJs.ibe_chart.init()
 */
// import { Chart } from 'node_modules/chart.js/auto'

// const { Chart } = require("chart.js");

dFrontJs.ibe_chart = function () {
  let initData = [], barAvatar, barAdvancedAvatar, myChart;
  let myChartPrices = [];
  let lastSize = '';

  const init = function () {
    Chart.defaults.font.size = 12;
    Chart.defaults.font.family = "Verdana";
    Chart.defaults.color = "#666666";
    Chart.defaults.borderColor = "#DDDDDD";
    // Chart.canvas.parentNode.style.width = '1500';
  };

  const moveChart = {
    id: 'moveChart',
    afterEvent(chart, args) {
      let {ctx, canvas, chartArea: {left, right, top, bottom, width, height}} = chart;
      canvas.addEventListener('mousemove', (event) => {
        const x = args.event.x;
        const y = args.event.y;

        if (x >= left - 24 && x <= left + 24 && y >= height / 2 + top - 24 && y <= height / 2 + top + 24) {
          canvas.style.cursor = 'pointer';
        } else if (x >= right - 24 && x <= right + 24 && y >= height / 2 + top - 24 && y <= height / 2 + top + 24) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      });
    },
    afterDraw(chart, args, options) {
      const {ctx, data, chartArea: {left, right, top, bottom, width, height}, scales: {x} } = chart;
      const angle = Math.PI / 180;
      const lastValue = data.datasets[0].data.length - 1;
      class circleArrow {
        draw(ctx, x1, y1, pixel) {
          // CIRCLE
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'transparent';
          ctx.fillStyle = '#FFF';
          ctx.arc(x1, height / 2 + top, 24, angle * 0, angle * 360, false);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
          // ARROW 
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#D7192D';
          ctx.moveTo(x1 + pixel * 2, height / 2 + top - 5);
          ctx.lineTo(x1 + pixel, height / 2 + top);
          ctx.lineTo(x1 + pixel * 2, height / 2 + top + 5);
          ctx.stroke();
          ctx.closePath();
        }
      }
      if(x.min > 0){
        let drawLeftArrow = new circleArrow();
        drawLeftArrow.draw(ctx, left - 6, 1, 6);
      }
      if(x.max < lastValue){
        let drawRightArrow = new circleArrow();
        drawRightArrow.draw(ctx, right - 2, 1, -6);
      }
    }
  }

  const moveScroll = (chart, data) => {
    const { ctx, canvas,  chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart; 
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const area = chart.chartArea;
      const maxShowItems = width >= 1024 ? 11 : window.innerWidth < 1024 && window.innerWidth >= 768 ?  7 : window.innerWidth < 768 && window.innerWidth >= 480 ? 4 : 2;

      if (x >= area.left - 24 && x <= area.left + 24 && y >= area.height / 2 + area.top - 24 && y <= area.height / 2 + area.top + 24) {
        chart.options.scales.x.min = chart.options.scales.x.min - maxShowItems;
        chart.options.scales.x.max = chart.options.scales.x.max - maxShowItems;
        if (chart.options.scales.x.min <= 0) {
          chart.options.scales.x.min = 0;
          chart.options.scales.x.max = maxShowItems;
        }        
        chart.update();
      }
      else if (x >= area.right - 24 && x <= area.right + 24 && y >= area.height / 2 + area.top - 24 && y <= area.height / 2 + area.top + 24) {
        chart.options.scales.x.min = chart.options.scales.x.min + maxShowItems;
        chart.options.scales.x.max = chart.options.scales.x.max + maxShowItems;
        if (chart.options.scales.x.max >= data.datasets[0].data.length) {
          chart.options.scales.x.min = data.datasets[0].data.length - (maxShowItems + 1);
          chart.options.scales.x.max = data.datasets[0].data.length - 1;
        }
        chart.update();
      }
    });
  }


  let configSimpleChart = {
    type: 'bar',
    data: {
      labels: 'na',         //need data
      datasets: [
        {
          label: 'Temperatura máxima/mínima',
          data: 'na',       //need data
          dataMin: 'na',    //need data
          dataForm: 'na',   //need data
          anchor: 'center',
          backgroundColor: [
            '#DDDDDD'
          ],
          barPercentage: 0.5,
          borderWidth: 1,
          borderSkipped: false,
          borderColor: ['#FFF'],
          hoverBorderColor: ['#FFF']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onResize: (event) => {
          const lastMin = event.config._config.options.scales.x.min;
          const lastMax = event.config._config.options.scales.x.max;
          const currentSize = window.innerWidth >= 1024 ? 'lg' : window.innerWidth < 1024 && window.innerWidth >= 768 ?  'md' : window.innerWidth < 768 && window.innerWidth >= 480 ? 'sm' : 'xs';
          const maxShowItems = window.innerWidth >= 1024 ? 11 : window.innerWidth < 1024 && window.innerWidth >= 768 ?  7 : window.innerWidth < 768 && window.innerWidth >= 480 ? 4 : 2;
          if(lastSize != currentSize){
            event.config._config.options.scales.x.min = 0;
            event.config._config.options.scales.x.max = maxShowItems;
            const currentMin = event.config._config.options.scales.x.min;
            const currentMax = event.config._config.options.scales.x.max;
            if (lastMax !== currentMax && lastMin !== currentMin && window.innerWidth < 1024) {
              event.config._config.plugins.push(moveChart);
            }
          }
          lastSize = currentSize;
      },
      layout: {
        padding: {
            top: 40,
            bottom: 40,
            // left: 10
        }
      },
      parsing: {
        xAxisKey: false,
        yAxisKey: false
      },
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: false,
          text: 'na'
        },
        tooltip: false,
        // {
          // callbacks: {
          //   label: (context) => {
          //     var minTemp = `${context.dataset.dataMin[context.dataIndex]}`;
          //     var formTemp = `${context.dataset.dataForm[context.dataIndex]}`;
          //     return context.dataset.label+ ': ' + context.raw + formTemp + ' / ' + minTemp + formTemp;
          //   }
          // }
        // },
        datalabels: {
          color: '#333333',
          anchor: 'start',
          align: 'bottom',
          offset: '30'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          },
          border: {
            display: true
          },
          grid: {
            display: false,
            drawOnChartArea: true,
            drawTicks: true,
          },
          min: 0,
          max: 11
        },
        y: {
          ticks: {
            // callback: function(value, index, ticks) {
            //     return '$' + value;
            // },
            display: false,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          },
          border: {
            display: false
          },
          grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: true
          },

        }
      }
    },
    plugins: [barAvatar]
  };

  let configAdvancedChart = {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Precio',
          data: initData.map(row => row.price),
          backgroundColor: [
            '#DDDDDD'
          ]
        }
      ]
    },
    options: {
      responsive: true, 
      events: ['click','mousemove','hover'],     
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return context.dataset.label +": "+ context.raw +"€";
            },
            title: (context) => {
              return '';
            }
          }
        }
      },
      layout: {
        padding: {
          bottom: 30,
          top: 30
        }
      },
      scales: {
        x: {
          max: 22,
          beginAtZero: true,          
          grid: {
            offset: false,
            display: false
          },
          ticks: {            
            font: {
              weight: (tick) => {
                let date = new Date(tick.tick.date);
                if(date.getDay() == 0 || date.getDay() == 6){
                   return 'bold';
                }
              }
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            offset: false
          },
          ticks: {            
            callback: function(value, index, ticks) {
              return value + "€";
            }
          }
        }
      },

    }
  };

  const _barAvatar = (data) => {
    return {
      id: 'barAvatar',
      afterDatasetDraw(chart, args, options) {
        var { ctx = chart.getContext("2d"), chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
        ctx.save();
        ctx.font = '3.75rem iberia';
        ctx.fillStyle = '#CCCCCC';

        for (let i = 0; i < data.length; i++) {
          if (data[i].icon === 'sun') {
            data[i].icon = '\uea1c';  // icon-t_soleado
          } else if (initData[i].icon === "rain") {
            data[i].icon = '\uea13'; // icon-t_lluvia
          } else if (data[i].icon === "cloud") {
            data[i].icon = '\uea19';  // icon-t_nublado
          } else if (data[i].icon === "snow") {
            data[i].icon = '\uea1d';  // icon-t_tormenta
          }
          ctx.fillText(data[i].icon, x.getPixelForValue(i) - (60 / 2), y.getPixelForValue(data[i].media));
        }
      }
    }
  }

  const _barAdvancedAvatar = (data) => {
    return {
      id: 'barAdvancedAvatar',
      afterDatasetDraw(chart, args, options) {
        var { ctx = chart.getContext("2d"), chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
        ctx.save();
        ctx.fillStyle = '#333';
        ctx.textAlign = "center";

        let months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        let daysWeek = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"];
        
        for (let i = 0; i < x.ticks.length; i++) {
          ctx.font = '0.8125rem Verdana';
          let currentDate = new Date(data[i].date);
          let prevDate = null;

          if(i>0){
            prevDate = new Date(data[i-1].date);
          
            if(currentDate.getMonth() != prevDate.getMonth()){            
              ctx.fillText(months[currentDate.getMonth()], x.getPixelForValue(i), 20);
            }
          }

          let tickPositionX = x.ticks[i].value;
          let tickPositionY = y.bottom;
          if(daysWeek[currentDate.getDay()] == "Sa" || daysWeek[currentDate.getDay()] == "Do"){
            ctx.font = '800 0.8125rem Verdana';
          }

          ctx.fillText(daysWeek[currentDate.getDay()], x.getPixelForValue(tickPositionX), tickPositionY + 40);
        }
      }
    }
  }

  const _getInitialDateSelected = function(data, selector){
    let parentDate = null;

    if(data.length > 0){
      let cheapestDate = "";
      let iterationDate = "";
      let cheapestIndex = "";

      for(let row in data){
        iterationDate = new Date(data[row].date);
        for(let row2 in data[row].offers){
          if(cheapestDate == "" || (data[row].offers[row2].price > 0 && data[row].offers[row2].price < cheapestDate.price)){
            parentDate = data[row];
            cheapestDate = data[row].offers[row2];
            cheapestIndex = row2;
          }
        }
      }

      let dateAttrName = "";
      let priceAttrName = "";
      let barIndexAttr = "";
      let barSelectorLabel = "";
      if(selector == "chartPrices"){
        dateAttrName = "data-start-date";
        priceAttrName = "data-start-price";
        barIndexAttr = "data-start-index";
        barSelectorLabel = ".ibe-chart-price__departure";

      } else {
        dateAttrName = "data-end-date";
        priceAttrName = "data-end-price";
        barIndexAttr = "data-end-index";
        barSelectorLabel = ".ibe-chart-price__return";          
      } 
      
      $(barSelectorLabel).html(cheapestDate.price+"€");
      $(".ibe-chart__prices-container").attr(priceAttrName, cheapestDate.price);
      $(".ibe-chart__prices-container").attr(dateAttrName, cheapestDate.date);
      $(".ibe-chart__prices-container").attr(barIndexAttr, cheapestIndex);
    }

    return parentDate;
  }

  const paintBarsClick = function (myChart) {
    let endIndex = parseInt($(".ibe-chart__prices-container").attr("data-end-index"));
    let startIndex = parseInt($(".ibe-chart__prices-container").attr("data-start-index"));
    let datasetsBar = myChart.data.datasets[0];
    datasetsBar.backgroundColor = datasetsBar.data.map(row => '#DDDDDD');

    if(myChart.canvas.id == "chartPrices"){
      datasetsBar.backgroundColor[startIndex] = '#D7192D';
      startIndex = startIndex+1;
      if(endIndex > 0){
        endIndex = endIndex+1;
      }
    } else if(myChart.canvas.id == "chartPricesReturn"){
      datasetsBar.backgroundColor[endIndex] = '#D7192D';
    }

    if(startIndex != undefined && endIndex != undefined){
      for(let i = startIndex; i < endIndex; i++){
        datasetsBar.backgroundColor[i] = '#F7D1D5';
      }
    }

    myChart.update();
  }

  const createChart = function (selector, data) {
    initData = data ? (data.list ? data.list : data) : [];
    barAvatar = _barAvatar(initData);

    configSimpleChart.data.datasets[0].data = initData.map(row => row.media);
    configSimpleChart.data.datasets[0].dataMin = initData.map(row => row.min);
    configSimpleChart.data.datasets[0].dataForm = initData.map(row => row.form);
    configSimpleChart.data.labels = initData.map(row => row.month);
    configSimpleChart.options.plugins.datalabels.formatter = (value, context) => {
      const minTemp = context.dataset.dataMin[context.dataIndex];
      const formTemp = context.dataset.dataForm[context.dataIndex];

      return value + formTemp + ' / ' + minTemp + formTemp;
    }
    configSimpleChart.plugins = [barAvatar, ChartDataLabels, moveChart];

    let myChart = new Chart($(selector), configSimpleChart);    
    myChart.ctx.onclick = moveScroll(myChart, configSimpleChart.data);


    // const myChart = new Chart();
    // myChart.config.data.datasets[0].data = initData;
    // myChart.config.data.datasets[0].dataMin = initData.min;
    // myChart.update();
  }

  const createAdvancedChart = function (selector, data) {
    if(selector == "chartPrices"){
      if($(".ibe_form__radio-input[name=flight-type]:checked").val() == "oneway"){
        initData = (data && data.oneway) ? data.oneway.info : [];
      } else {
        initData = (data && data.return) ? data.return.info : [];
      }
    } else {
      initData = (data && data.departure) ? data.departure.info : [];
    }

    let selectedDate = _getInitialDateSelected(initData, selector);
    if(selectedDate != null){
      initData = selectedDate;
    }
    barAdvancedAvatar = _barAdvancedAvatar(initData.offers);

    configAdvancedChart.data.datasets[0].data = initData.offers.map(row => row.price);
    configAdvancedChart.data.labels = initData.offers.map(row => row.date);
    configAdvancedChart.plugins = [barAdvancedAvatar];
    configAdvancedChart.data.datasets[0].backgroundColor = initData.offers.map(row => '#DDDDDD');
    configAdvancedChart.data.datasets[0].barPercentage = 0.9;
    configAdvancedChart.data.datasets[0].categoryPercentage = 1;
    configAdvancedChart.options.scales.x.ticks.callback = function(index,value,ticks){
      let date = new Date(configAdvancedChart.data.labels[index]);
      ticks[index].date = configAdvancedChart.data.labels[index];
      return date.getDate();
    };
    
    myChartPrices[selector] = new Chart($("#"+selector), configAdvancedChart);
    paintBarsClick(myChartPrices[selector]);

    document.getElementById(selector).onclick = function (evt) {    
      let pointClicked = myChartPrices[selector].getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
      let datasetsBar = myChartPrices[selector].data.datasets[0];
      
      if(pointClicked.length > 0){
        let dateAttrName = "";
        let priceAttrName = "";
        let barIndexAttr = "";

        if(selector == "chartPrices"){
          dateAttrName = "data-start-date";
          priceAttrName = "data-start-price";
          barIndexAttr = "data-start-index";
          $(".ibe-chart-price__departure").html(datasetsBar.data[pointClicked[0].index]+"€");

        } else {
          dateAttrName = "data-end-date";
          priceAttrName = "data-end-price";
          barIndexAttr = "data-end-index";
          $(".ibe-chart-price__return").html(datasetsBar.data[pointClicked[0].index]+"€");
        }

        $(".ibe-chart__prices-container").attr(priceAttrName, datasetsBar.data[pointClicked[0].index]);
        $(".ibe-chart__prices-container").attr(dateAttrName, configAdvancedChart.data.labels[pointClicked[0].index]);
        $(".ibe-chart__prices-container").attr(barIndexAttr, pointClicked[0].index);        

        paintBarsClick(myChartPrices["chartPrices"]);
        paintBarsClick(myChartPrices["chartPricesReturn"]);        
      }
    };
  }

  return {
    'init': init,
    'createChart': createChart,
    'createAdvancedChart': createAdvancedChart,
    'paintBarsClick': paintBarsClick,
    'myChartPrices': myChartPrices
  }
}(jQuery);
