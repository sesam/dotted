var ticker_interval = 500; // milliseconds between ticker updates
var chart; // integration point
var data_url = window.location + 'data';
var last_data = null;

function ticker_recieved(data) {
  last_data = data;
  $('h2#ticker span').text(data.value);
  $('h2#ticker code').text(data.time);
  $('h2#ticker pre').text(data.dotted.port);

  // Version info and upgrade button
  var tag_changed = data.dotted.deployed_tag != data.dotted.tag;
  $('div#ver span').text(data.dotted.major + ' [' + data.dotted.tag + ']');
  $('div#ver b').text(data.dotted.migrate);
  $('div#ver button').text(tag_changed ? 'Upgrade to ' + data.dotted.deployed_tag : '..');

  add_data_to_chart(data);
}

function dotted_upgrade() {
  event.stopImmediatePropagation();
  old_url = data_url;
  data = last_data;
  data_url = data_url.replace(data.dotted.port, data.dotted.next_port);
  $('div#ver button').text('data_url changed from ' + old_url + ' to ' + data_url);
}

var ticker_refresh = () => {
  $.getJSON(data_url, ticker_recieved).fail((err) => {
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
          animation: false,
          renderTo: 'container',
          defaultSeriesType: 'line',
      },
      plotOptions: {
          series: {
              step: 'center'
          }
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
