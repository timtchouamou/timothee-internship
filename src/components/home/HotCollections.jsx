import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HotCollections = () => {
  // this section is to make Hot collection dynamic
  //  we need useState([]), to state our data
  const [hotCollection, setHotcollection] = useState([]);

  //3. Add a loading state (for Skeleton)
  const [loading, setLoading] = useState(true);

  // we need async/await function to fetch our data
  async function fetchHotCollections() {
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections`
    );
    console.log(data);
    setHotcollection(data);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  // call the function in useEffect to mount the data
  useEffect(() => {
    fetchHotCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {hotCollection.map((h, index) => (
            <div key={index}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  <Link to="/item-details">
                    <img src={h.nftImage} className="lazy img-fluid" alt="" />
                  </Link>
                </div>
                <div className="nft_coll_pp">
                  <Link to="/author">
                    <img className="lazy pp-coll" src={h.authorImage} alt="" />
                  </Link>
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft_coll_info">
                  <Link to="/explore">
                    <h4>{h.title}</h4>
                  </Link>
                  <span>ERC-{h.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
