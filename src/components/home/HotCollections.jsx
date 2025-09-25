import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//Step 1: Install Swiper: npm install swiper
// Step 2: Import Swiper in your component
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

//Step 3: Rewrite your component with Swiper

const HotCollections = () => {

  // this section is to make Hot collection dynamic
  //  we need useState([]), to state our data
  const [hotCollection, setHotcollection] = useState([])

  // we need async/await function to fetch our data
  async function fetchHotCollections() {
    const {data} = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections`)
    console.log(data)
    setHotcollection(data)
  }

  // call the function in useEffect to mount the data
  useEffect(() => {
    fetchHotCollections()
  },[])

   // ✅ Dynamic setup to prevent Swiper loop warnings
  const itemsCount = hotCollection.length;
  const slidesPerView = Math.min(itemsCount, 4); // show up to 4, or fewer if not enough
  const enableLoop = itemsCount > 4; // only loop when more than 4 slides

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
           <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={slidesPerView}
            loop={enableLoop}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              1000: { slidesPerView: 4 },
            }}
          >
          {hotCollection
          .map((h, index) => (
            <SwiperSlide key={index}>
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
            </SwiperSlide>
          ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
