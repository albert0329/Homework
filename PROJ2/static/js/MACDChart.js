var MACD;



d3.json('/MACD').then(function(data) {
 MACD = data;
 graph2();
 console.log(MACD);
 });


function graph2() {
   var x = MACD.map(a => a.DateTime);
   var y = MACD.map(a => a.Mov_Avg12);


  var trace1 = {
    x: x,
    y: y,
    type: 'scatter'
  };

  var data = [trace1];

  Plotly.newPlot('plot2', data);
};