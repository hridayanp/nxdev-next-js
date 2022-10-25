import { findRecordByFilter } from "apps/nx-next-into-dev/lib/airtable";

const getCoffeeStoreById = async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const records = await findRecordByFilter(id);

            if (records.length !== 0) {
                res.status(200).json(records);
            }
            else {
                res.status(404).json({ message: 'Not found' });
            }
        }
        else {
            res.status(400).json({ message: 'Missing id' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong', err })
    }
}

export default getCoffeeStoreById