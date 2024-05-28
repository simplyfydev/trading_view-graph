const express = require('express');
const cors = require('cors');
const app = express();
const port = 5555;

app.use(cors());

const historicalData = {
    'CCD': [
        { time: 1672531200, close: 70, open: 68, high: 75, low: 66, volume: 2000 }, // 2023-01-01
        { time: 1672617600, close: 71, open: 69, high: 76, low: 67, volume: 2100 }, // 2023-01-02
        { time: 1672704000, close: 72, open: 70, high: 77, low: 68, volume: 2200 }, // 2023-01-03
        { time: 1672790400, close: 73, open: 71, high: 78, low: 69, volume: 2300 }, // 2023-01-04
        { time: 1672876800, close: 74, open: 72, high: 79, low: 70, volume: 2400 }, // 2023-01-05
        { time: 1672963200, close: 75, open: 73, high: 80, low: 71, volume: 2500 }, // 2023-01-06
        { time: 1673049600, close: 76, open: 74, high: 81, low: 72, volume: 2600 }, // 2023-01-07
        { time: 1673136000, close: 77, open: 75, high: 82, low: 73, volume: 2700 }, // 2023-01-08
        { time: 1673222400, close: 78, open: 76, high: 83, low: 74, volume: 2800 }, // 2023-01-09
        { time: 1673308800, close: 79, open: 77, high: 84, low: 75, volume: 2900 }, // 2023-01-10
        { time: 1673395200, close: 80, open: 78, high: 85, low: 76, volume: 3000 }, // 2023-01-11
        // Continue adding data points for 2023
        { time: 1716681600, close: 76, open: 74, high: 81, low: 72, volume: 2600 }, // 2024-06-24
        { time: 1716768000, close: 77, open: 75, high: 82, low: 73, volume: 2700 }, // 2024-06-25
        { time: 1716854400, close: 78, open: 76, high: 83, low: 74, volume: 2800 }, // 2024-06-26
        { time: 1716940800, close: 79, open: 77, high: 84, low: 75, volume: 2900 }, // 2024-06-27
        { time: 1717027200, close: 80, open: 78, high: 85, low: 76, volume: 3000 }, // 2024-06-28
        // Continue adding data points for 2024
    ],
};


app.get('/config', (req, res) => {
    res.json({
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: ['1D', '1W', '1M'],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
    });
});

app.get('/symbols', (req, res) => {
    const symbol = req.query.symbol.toUpperCase();
    res.json({
        name: symbol,
        ticker: symbol,
        description: `${symbol} Coin`,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Custom Exchange',
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        has_no_volume: false,
        supported_resolutions: ['1D', '1W', '1M'],
    });
});

app.get('/history', (req, res) => {
    console.log('Request received:', req.query); // Log the query parameters for debugging
    const { symbol, from, to, resolution } = req.query;
    const fromTimestamp = parseInt(from, 10);
    const toTimestamp = parseInt(to, 10);

    console.log('From:', fromTimestamp, 'To:', toTimestamp);
    if (!historicalData[symbol]) {
        return res.json({ s: 'error', errmsg: 'Symbol not found' });
    }

    // Log the data timestamps for comparison
    historicalData[symbol].forEach(data => {
        console.log(`Data timestamp: ${data.time}`);
    });

    const data = historicalData[symbol].filter(d => d.time >= fromTimestamp && d.time <= toTimestamp);

    console.log('Filtered data:', data); // Log the filtered data

    if (data.length > 0) {
        res.json({
            s: 'ok',
            t: data.map(d => d.time),
            c: data.map(d => d.close),
            o: data.map(d => d.open),
            h: data.map(d => d.high),
            l: data.map(d => d.low),
            v: data.map(d => d.volume),
        });
    } else {
        console.log('No data found for the given range');
        res.json({ s: 'no_data', errmsg: 'No data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});