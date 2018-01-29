var boxMullerRandom = (function () {
    var phase = 0,
        RAND_MAX,
        array,
        random,
        x1, x2, w, z;

    if (crypto && typeof crypto.getRandomValues === 'function') {
        RAND_MAX = Math.pow(2, 32) - 1;
        array = new Uint32Array(1);
        random = function () {
            crypto.getRandomValues(array);

            return array[0] / RAND_MAX;
        };
    } else {
        random = Math.random;
    }

    return function () {
        if (!phase) {
            do {
                x1 = 2.0 * random() - 1.0;
                x2 = 2.0 * random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);

            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            z = x1 * w;
        } else {
            z = x2 * w;
        }

        phase ^= 1;

        return z;
    }
}());

function randomWalk(steps, randFunc) {
    steps = steps >>> 0 || 100;
    var arr = Array.apply(0, Array(steps));
    arr[0] = 0;
    for (var t = 1; t < steps; t += 1) {
        arr[t] = arr[t-1] + randFunc();
    }
    // console.log(arr.reduce(sum_reducer));
    return arr;
}

var next_value = (value) => value + 2 * Math.random() - 1.0;
// const sum_reducer = (accumulator, currentValue) => accumulator + currentValue;

function myWalk() {
	return 2 * Math.random() - 1.0;
}

var last_data = {};
function ticker_recieved(data) {
  last_data = data;
  $('h2#ticker span').text(data.value);
  $('h2#ticker code').text(data.time);
  $('div#ver span').text(data.dotted.major + ' [' + data.dotted.tag + ']');
  if (data.dotted.deployed_tag != data.dotted.tag) {
    $('div#ver b').text(next_tag);
  }
}
var ticker_refresh = () => {
  $.getJSON('/data', ticker_recieved).fail((err) => {
    console.log('error ' + err + ' so trying by enabling jQuery CORS support');
    $.support.cors = true;
  });
}
var ticker_interval = 500;
$(document).ready(() => {
  console.log('index.js ticker interval ' + ticker_interval);
  setInterval(ticker_refresh, ticker_interval);
});

$('#container').highcharts({
    title: {
        text: 'Value',
        x: -20 //center
    },
    xAxis: {
        type: 'linear'
    },
    tooltip: {
        valueSuffix: 'x',
        pointFormat: '{point.y:.2f}',
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'x',
        data: randomWalk(100, boxMullerRandom), // myWalk),
    }],
});
console.log('index.js loaded');
