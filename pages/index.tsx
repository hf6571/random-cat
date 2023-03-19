import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import { GetStaticProps } from 'next'
// import { useEffect } from "react";

type Props = {
    initialImageUrl: string;
    allPostsData: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl , allPostsData } ) =>{
    // useState def
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);
    //// image fetch
    //useEffect(() => {
    //    fetchImage().then((newImage) => {
    //        setImageUrl(newImage.url); //url update
    //        setLoading(false); //loading state
    //    });
    //},[]);
    
    const handleClick = async () => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };

    // not loading then return
    // ({
    // allPostsData
    //    }: {
    //    allPostsData: {
    //        date: string
    //        title: string
    //        id: string
    //    }[]
    //    }) {
    return (
        <div>
            <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>[My Self Introduction]</p>
                <p>
                (This is a sample website - {' '}
                <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
                </p>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Blog</h2>
                <ul className={utilStyles.list}>
                {allPostsData.map(({ id, date, title }) => (
                    <li className={utilStyles.listItem} key={id}>
                    <Link href={`/posts/${id}`}>{title}</Link>
                    <br />
                    <small className={utilStyles.lightText}>
                        <Date dateString={date} />
                    </small>
                    </li>
                ))}
                </ul>
            </section>
            </Layout>

            <div className={styles.page}>
                <button onClick={handleClick} className={styles.button}>
                    another
                </button>
                <div className={styles.frame}>
                    {loading || <img src={imageUrl} className={styles.img} />}
                </div>
            </div>
        </div>
        );
    //};
};

export default IndexPage;

// sarverSide process
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    const allPostsData = getSortedPostsData();
    return {
        props: {
            initialImageUrl: image.url,
            allPostsData,
        },
    };
};

type Image = {
    url: string;
};

const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    // array check
    if (!Array.isArray(images)) {
        throw new Error("array Error cat");
    }
    const image: unknown = images[0];
    // image check
    if (!isImage(image)) {
        throw new Error("image Error cat");
    }
    console.log(images);
    return images[0];
};

// type 
const isImage = (value: unknown): value is Image =>{
    // value is obj?
    if (!value || typeof value !== "object") {
        return false;
    }
    // url exists and string
    return "url" in value && typeof value.url === "string";
}

fetchImage().then((image) => {
    console.log(image.url);
});


//export const getStaticProps: GetStaticProps = async () => {
//    const allPostsData = getSortedPostsData()
//    return {
//      props: {
//        allPostsData
//      }
//    }
//  }