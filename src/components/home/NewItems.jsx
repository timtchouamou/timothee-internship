import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewItems = () => {
  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNewItems() {
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems`
    );
    console.log(data);
    setCard(data);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  useEffect(() => {
    fetchNewItems();
  }, []);

  // 2. Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div className="nft__item skeleton">
        <div className="author_list_pp">
          <div className="skeleton-circle"></div>
        </div>
        <div className="de_countdown skeleton-box"></div>
        <div className="nft__item_wrap">
          <div
            className="skeleton-box nft__item_preview"
            style={{ height: "200px" }}
          ></div>
        </div>
        <div className="nft__item_info">
          <div
            className="skeleton-box"
            style={{ width: "70%", height: "20px", margin: "10px 0" }}
          ></div>
          <div
            className="skeleton-box"
            style={{ width: "50%", height: "20px", marginBottom: "5px" }}
          ></div>
        </div>
      </div>
    </div>
  );

  //Step 1: Add a countdown function: We'll create
  //  a function to convert seconds into hh:mm:ss format.
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  //Step 2: Add dynamic countdown state: We can assume
  // our API returns a deadline or expiryTime for each NFT.

  const [timeLeft, setTimeLeft] = useState({});

  //Step 3: Initialize countdown for each card
  useEffect(() => {
    if (!loading && card.length > 0) {
      const countdowns = card.map((item) => {
        // if API gives expiry in timestamp:
        return Math.floor((new Date(item.expiryDate) - new Date()) / 1000);

        // else default to 5h30m32s
        return 5 * 3600 + 30 * 60 + 32; // total seconds
      });

      setTimeLeft(countdowns);

      const interval = setInterval(() => {
        setTimeLeft((prev) => prev.map((time) => (time > 0 ? time - 1 : 0)));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, card]);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
	@@ -14,62 +103,103 @@ const NewItems = () => {
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              loop={true} // 👈 makes it 360° continuous
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                1024: { slidesPerView: 4 },
                768: { slidesPerView: 2 },
                0: { slidesPerView: 1 },
              }}
            >
              {new Array(8).fill(0).map((__dirname, index) => (
                <SwiperSlide key={index}>
                  <SkeletonCard />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={4}
              loop={true} // 👈 makes it 360° continuous
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                1024: { slidesPerView: 4 },
                768: { slidesPerView: 2 },
                0: { slidesPerView: 1 },
              }}
            >
              {card.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link
                        to="/author"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Creator: Monica Lucas"
                      >
                        <img className="lazy" src={item.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="de_countdown">
                      {timeLeft[index] !== undefined
                        ? formatTime(timeLeft[index])
                        : "0h 0m 0s"}
                    </div>

                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Link to="/item-details">
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="nft__item_info">
                      <Link to="/item-details">
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};
export default NewItems;