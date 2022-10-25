import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { useContext, useState, useEffect } from 'react';
import { isEmpty } from '../../utils/index';
import { StoreContext } from '../../store/store-context';

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  console.log('params', params);
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => ({
    params: { id: coffeeStore.id.toString() },
  }));

  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}

const CoffeeStore = (inititalProps) => {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(inititalProps.coffeeStore);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, neighborhood, address } = coffeeStore;

      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighborhood: neighborhood[0] || '',
          address: address || '',
        }),
      });

      const dbCOffeeStore = await response.json();
      console.log({ dbCOffeeStore });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isEmpty(inititalProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(inititalProps.coffeeStore);
    }
  }, [id, inititalProps.coffeeStore]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { name, imgUrl, address, neighborhood } = coffeeStore;

  const handleUpvoteButton = () => {
    console.log('Upvote button clicked!');
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || '/static/hero-image.png'}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                alt="places"
                src="/static/icons/places.svg"
                width="24"
                height="24"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                alt="nearMe"
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              alt="star"
              src="/static/icons/star.svg"
              width="24"
              height="24"
            />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
