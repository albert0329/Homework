var CS;
var MACD;



d3.json('/latest').then(function(data) {
 CS = data;
 graph1();
 });


function graph1() {
   var x = CS.map(a => a.DateTime);
   var close = CS.map(a => a.ask_c);
   var high = CS.map(a => a.ask_h);
   var low = CS.map(a => a.ask_l);
   var open = CS.map(a => a.ask_o);


var trace1 = {
   x: x,
   close: close,
   decreasing: {line: {color: 'red'}},
   high: high,
   increasing: {line: {color: 'green'}},
   line: {color: 'rgba(31,119,180,1)'},
   low: low,
   open: open,
   type: 'candlestick',
   xaxis: 'x',
   yaxis: 'y'
 };

 var data = [trace1];

 var layout = {
   dragmode: 'zoom',
   title : 'EUR/USD Price 5 Minute',
   plot_bgcolor : '#rgba(16, 14, 15, 0.9)',
   showlegend : false,
   showgrid : true,
   gridwidth : 100,
   xaxis: {
     fixedrange: true,
     rangeslider: {
      visible: false
     }
   },
   yaxis: {
      fixedrange: true
   }
 };

 Plotly.newPlot('plot1', data, layout, {displayModeBar: false});

};


d3.json('/MACD').then(function(data) {
 MACD = data;
 graph2();
 //console.log(MACD);
 });


function graph2() {
   var x = MACD.map(a => a.DateTime);
   var y = MACD.map(a => a.Mov_Avg12);


  var trace1 = {
    x: x,
    y: y,
    type: 'scatter'
  };

  var layout = {
    xaxis: {
     fixedrange: true
   },
   yaxis: {
      fixedrange: true
   }
  };

  var data = [trace1];

  Plotly.newPlot('plot2', data, layout, {displayModeBar: false});
};

var myPlot = document.getElementById('plot1');
myPlot.on('plotly_hover', function (eventdata){
    var points = eventdata.points[0],
        pointNum = points.pointNumber;

    Plotly.Fx.hover('plot2',[
        { curveNumber:0, pointNumber:pointNum }
    ]);
});


