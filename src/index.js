import Chart from 'chart.js/auto'

function dewpoint(humidity, temp) {
    const b = 17.625;
    const c = 243.04;
    const t = 5*(temp - 32)/9;
    const gamma = Math.log(humidity/100) + b*t/(c + t);
    const dp = c*gamma/(b-gamma);
    return 9*dp/5 + 32;
}

function drawChart(elemId, data) {
    new Chart(
        document.getElementById(elemId),
        {
            type: 'line',
            options: {
                scales: {
                    fahrenheit: {
                        title: { text: '°F', display: true },
                        type: 'linear',
                        display: true,
                        position: 'right',
                    },
                    percent: {
                        type: 'linear',
                        display: false,
                        position: 'left',
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                },
            },
            data: {
                labels: data.map(row => row.time.toLocaleTimeString()),
                datasets: [
                    {
                        label: 'Temp',
                        data: data.map(row => row.temp),
                        yAxisID: 'fahrenheit',
                        borderColor: 'darkred',
                        backgroundColor: 'red',
                    },
                    {
                        label: 'Dew Point',
                        data: data.map(row => row.dewpoint),
                        yAxisID: 'fahrenheit',
                        borderColor: 'green',
                        backgroundColor: 'lightgreen',
                    },
                    {
                        label: 'Humidity',
                        data: data.map(row => row.humidity),
                        yAxisID: 'percent',
                        hidden: true,
                    },
                ]
            }
        }
    );
}

(async function() {
    const response = await fetch("static/data.jsonl");
    const jsonl = await response.text();
    const rows = jsonl.split('\n').filter((row, i) => i%2 == 0 && row.length > 0);
    const data = rows.map(row => {
        const {time, temperature_F: temp, humidity} = JSON.parse(row);
        return {time: new Date(time), temp, humidity, dewpoint: dewpoint(humidity, temp)};
    });
    const past4hours = data.filter(record => new Date() - record.time < 4*3600*1000);
    const past24hours = data.filter((record, i) => i%6 == 0 && new Date() - record.time < 26*3600*1000);
    drawChart('past-four-hours', past4hours);
    drawChart('past-twentyfour-hours', past24hours);

    const current = data[data.length - 1];
    const [t1, t2, t3, t4, t5] = data.slice(data.length - 5);
    const h = (t5.time - t1.time)/1000/3600;
    const dt = (t1.temp - 8*t2.temp + 8*t4.temp - t5.temp)/12/h;
    document.getElementById("current").innerHTML = `
        <p>${current.time.toLocaleString()}</p>
        <p>${current.temp}°F ${dt.toFixed(1)}°F/hr</p>
        <p>${current.humidity}%</p>
        <p>${dewpoint(current.humidity, current.temp).toFixed(1)}°F</p>
    `;
})();
