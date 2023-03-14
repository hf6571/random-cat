import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

// import { useEffect } from "react";

type Props = {
    initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) =>{
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
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                another
            </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img} />}
            </div>
        </div>
    );
};

export default IndexPage;

// sarverSide process
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
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