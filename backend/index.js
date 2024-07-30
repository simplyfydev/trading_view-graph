const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5555;

app.use(cors());

app.get('/config', (req, res) => {
    res.json({
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: ['1D', '1W', '1M', '1Y'],
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
        supported_resolutions: ['1D', '1W', '1M', '1Y'],
    });
});

app.get('/history', (req, res) => {
    console.log('Request received:', req.query);
    const { symbol, from, to, resolution } = req.query;

    // If `from` and `to` are provided, use them; otherwise, default to a year range
    // let fromTimestamp = parseInt(from, 10);
    // let toTimestamp = parseInt(to, 10);

    // // Calculate timestamps for the year 2024 if not provided
    // if (!from || !to) {
    //     const startOfYear = new Date('2024-01-01T00:00:00Z').getTime() / 1000;
    //     const endOfYear = new Date('2024-12-31T23:59:59Z').getTime() / 1000;
    //     fromTimestamp = fromTimestamp || startOfYear;
    //     toTimestamp = toTimestamp || endOfYear;
    // }

    console.log('From Timestamp:', fromTimestamp);
    console.log('To Timestamp:', toTimestamp);

    try {
        const rawData = fs.readFileSync('historicalData.json', 'utf8');
        const historicalData = JSON.parse(rawData);

        if (!historicalData[symbol]) {
            return res.json({ s: 'error', errmsg: 'Symbol not found' });
        }

        // const data = historicalData[symbol].filter(d => d.time >= fromTimestamp && d.time <= toTimestamp);
        const data = historicalData[symbol].filter(d => d.time >= fromTimestamp && d.time <= toTimestamp);
        console.log('Filtered data:', data);

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
    } catch (error) {
        console.error('Error reading data:', error);
        res.json({ s: 'error', errmsg: 'Error reading data' });
    }
});

app.get('/time', (req, res) => {
    res.json(Math.floor(Date.now() / 1000));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
