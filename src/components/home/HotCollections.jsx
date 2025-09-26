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

// 1. Install Skeleton package:npm install react-loading-skeleton
//2. Import it into your component(for skeleton)
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

//Step 3: Rewrite your component with Swiper

const HotCollections = () => {

  // this section is to make Hot collection dynamic
  //  we need useState([]), to state our data
  const [hotCollection, setHotcollection] = useState([])

  //3. Add a loading state (for Skeleton)
  const [loading, setLoading] = useState(true);

  // we need async/await function to fetch our data
  async function fetchHotCollections() {
    const {data} = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections`)
    // console.log(data)
    setHotcollection(data)

    setTimeout(() => {
      setLoading(false); 
    },3000);
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
               {/* 4. Render Skeletons while loading */}
            {loading
              ? new Array(4).fill(0).map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Skeleton height={200} />
                      </div>
                      <div className="nft_coll_pp">
                        <Skeleton circle width={50} height={50} />
                      </div>
                      <div className="nft_coll_info">
                        <h4>
                          <Skeleton width={`80%`} />
                        </h4>
                        <span>
                          <Skeleton width={60} />
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
                :

          hotCollection
          .map((h, index) => (
            <SwiperSlide className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
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
          ))

        }
        </Swiper>

      </div>
      </div>
    </section>
  );
};

export default HotCollections;
