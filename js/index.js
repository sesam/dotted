var ticker_interval = 500; // milliseconds between ticker updates
var chart; // integration point

function ticker_recieved(data) {
  $('h2#ticker span').text(data.value);
  $('h2#ticker code').text(data.time);
  $('div#ver span').text(data.dotted.major + ' [' + data.dotted.tag + ']');
  if (data.dotted.deployed_tag != data.dotted.tag) {
    $('div#ver b').text(next_tag);
  }
  add_data_to_chart(data);
}

var ticker_refresh = () => {
  $.getJSON('/data', ticker_recieved).fail((err) => {
    console.log('error ' + err + ' so trying by enabling jQuery CORS support');
    $.support.cors = true;
  });
}

function add_data_to_chart(data) {
  var shift = chart.series[0].data.length > 20; // move chart forward
  chart.series[0].addPoint([data.time, data.value], true, shift);
}

$(document).ready(() => {
  console.log('index.js ticker interval ' + ticker_interval);
  setInterval(ticker_refresh, ticker_interval);

  chart = new Highcharts.Chart({
      chart: {
          renderTo: 'container',
          defaultSeriesType: 'spline',
      },
      title: { text: 'Ticker chart' },
      xAxis: {
          type: 'datetime',
      },
      yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          title: { text: 'Value', margin: 80 }
      },
      tooltip: {
          pointFormat: '{point.y:.2f}',
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
      },
      series: [{ name: 'x', data: [] }]
  });
});

console.log('index.js loaded');
