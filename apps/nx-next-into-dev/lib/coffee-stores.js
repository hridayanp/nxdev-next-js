import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getListOfCoffeeStorePhoto = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        perPage: 30,
    });
    const unsplashResults = photos.response.results;

    return unsplashResults.map((result) => {
        return result.urls['small'];
    });
};

export const fetchCoffeeStores = async (
    latLong = '43.653833032607096%2C-79.37896808855945',
    limit = 6
) => {
    const photos = await getListOfCoffeeStorePhoto();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FQS_API_KEY,
        },
    };

    const response = await fetch(
        `https://api.foursquare.com/v3/places/search?query=coffee&ll=${latLong}&limit=${limit}`,
        options
    );
    const data = await response.json();

    return data.results.map((result, idx) => {
        const neighborhood = result.location.neighborhood;
        return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            neighborhood:
                neighborhood?.length > 0
                    ? neighborhood.map((neighbourhood) => neighbourhood)
                    : '',
            imgUrl: photos.length > 0 ? photos[idx] : null,
        };
    });
};
