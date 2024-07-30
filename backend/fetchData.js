const axios = require('axios');
const fs = require('fs');

async function fetchAndStoreData() {
    const apiUrl = 'https://presidiumludhiana.in/api/v1/file/getAllTradeExcutedOrders';
    const symbol = 'CCD';
    const coinPairWith = 'INR';

    try {
        const response = await axios.post(apiUrl, {
            shareName: symbol,
            coinPairWith: coinPairWith
        });

        let data = response.data.data.map(d => ({
            time: d.customDate ? new Date(d.customDate).getTime() / 1000 : new Date(d.createdAt).getTime() / 1000,
            close: d.price,
            open: d.price,
            high: d.price,
            low: d.price,
            volume: d.quantity || 0
        }));

        // Sort data by time in ascending order
        data.sort((a, b) => a.time - b.time);

        fs.writeFileSync('historicalData.json', JSON.stringify({ [symbol]: data }, null, 2));
        console.log('Data successfully fetched, sorted, and stored.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchAndStoreData();
