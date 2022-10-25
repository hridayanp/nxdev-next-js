import { table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        const { id, name, address, neighborhood, voting, imgUrl } = req.body;

        try {
            if (id) {
                //FIND A RECORD
                const findCoffeeStoreRecords = await table
                    .select({
                        filterByFormula: `id = ${id}`,
                    })
                    .firstPage();

                if (findCoffeeStoreRecords.length !== 0) {
                    const records = getMinifiedRecords(findCoffeeStoreRecords);

                    res.status(200).json(records);
                } else {
                    //CREATE A RECORD
                    if (name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighborhood,
                                    voting,
                                    imgUrl,
                                },
                            },
                        ]);

                        const records = getMinifiedRecords(createRecords);

                        res.status(201).json({ message: 'Create a record', records: records });
                    }
                    else {
                        res.status(400).json({ message: 'Missing id or name' });
                    }

                }
            }
            else {
                res.status(400).json({ message: 'Missing id' });
            }

        } catch (err) {
            res.status(500).json({ message: 'Error creating or finding a store' });
        }
    } else {
        res.status(404).json({ message: 'not found' });
    }
};

export default createCoffeeStore;
