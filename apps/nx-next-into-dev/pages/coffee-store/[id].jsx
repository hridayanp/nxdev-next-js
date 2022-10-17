import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import { fetchCoffeeStores } from '../../lib/coffee-stores';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores.find(
        (coffeeStore) => coffeeStore.id.toString() === context.params.id
      ),
    }, //will be passes to the page component as props
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => ({
    params: { id: coffeeStore.id.toString() },
  }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}

const CoffeeStore = ({ coffeeStores }) => {
  console.log({ coffeeStores });

  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { name, imgUrl, address, neighborhood } = coffeeStores;

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
