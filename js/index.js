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

var next_value = (value) => Math.round(value + 2 * Math.random() - 1.0);
// const sum_reducer = (accumulator, currentValue) => accumulator + currentValue;

function myWalk() {
	return Math.round(2 * Math.random(), 0) - 1.0;
}

$('#container').highcharts({
    title: {
        text: 'Walkers',
        x: -20 //center
    },
    xAxis: {
        type: 'linear'
    },
    tooltip: {
        valueSuffix: ' units'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'timeline',
        data: randomWalk(100, boxMullerRandom), // myWalk),
    }],
});
