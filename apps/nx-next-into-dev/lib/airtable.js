const Airtable = require('airtable');
const base = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

export const table = base('coffee-stores');

const getMinifiedRecord = (record) => {
    return {
        ...record.fields,
    };
}

export const getMinifiedRecords = (records) => {
    return records.map((record) => getMinifiedRecord(record));
}

export const findRecordByFilter = async (id) => {
    //FIND A RECORD
    const findCoffeeStoreRecords = await table
        .select({
            filterByFormula: `id = "${id}"`,
        })
        .firstPage();
    return getMinifiedRecords(findCoffeeStoreRecords);
}