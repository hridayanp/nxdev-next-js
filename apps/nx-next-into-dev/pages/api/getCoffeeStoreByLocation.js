import { fetchCoffeeStores } from "apps/nx-next-into-dev/lib/coffee-stores";

const getCoffeeStoreByLocation = async (req, res) => {

    try {
        const { latLong, limit } = req.query;
        const coffeeStores = await fetchCoffeeStores(latLong, limit);
        res.status(200).json(coffeeStores);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export default getCoffeeStoreByLocation;