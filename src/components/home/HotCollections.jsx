import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HotCollections = () => {
  const [card, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  async function FectHotCollections() {
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections`
    );
    console.log(data);
    setCart(data);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  useEffect(() => {
    FectHotCollections();
  }, []);

  return (

    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>Hot Collections</h2>
            <div className="small-border bg-color-2"></div>
          </div>
        </div>

        {loading ? (
          <div className="row">
            <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
             loop={true}                     // 👈 makes it 360° continuous
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
          >
            {[...Array(4)].map((_, i) => (
               <SwiperSlide key={i}>
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <div className="skeleton" />
                  </div>
                  <div className="nft_coll_pp">
                    <div
                      className="skeleton"
                      style={{ borderRadius: "50%", width: 50, height: 50 }}
                    />
                  </div>
                  <div className="nft_coll_info">
                    <div className="skeleton-text" style={{ width: "80%" }} />
                    <div className="skeleton-text" style={{ width: "50%" }} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
          </div>

        ) : (

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
             loop={true}                     // 👈 makes it 360° continuous
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
          >
            {card.slice(0, 8).map((item, index) => (
              <SwiperSlide key={index}>
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <Link to="/item-details">
                      <img
                        src={item.nftImage}
                        className="lazy img-fluid"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link to="/author">
                      <img
                        className="lazy pp-coll"
                        src={item.authorImage}
                        alt=""
                      />
                    </Link>
                    <i className="fa fa-check" />
                  </div>

                  <div className="nft_coll_info">
                    <Link to="/explore">
                      <h4>{item.title}</h4>
                    </Link>
                    <span>ERC-{item.code}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default HotCollections;
