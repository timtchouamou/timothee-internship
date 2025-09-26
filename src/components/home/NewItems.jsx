import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Skeleton from "react-loading-skeleton";

// ⏳ Countdown component
const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiryDate).getTime() - now;

      if (distance <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  return <div className="de_countdown">{timeLeft}</div>;
};

// 🟦 Skeleton Loader Slide
const SkeletonSlide = () => (
  <div className="nft__item skeleton">
    <div className="skeleton-img"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text short"></div>
  </div>
)

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
   const [loading, setLoading] = useState(true);

  async function fetchNewItems() {
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems`
    );
    console.log(data);
    setNewItems(data);
    setTimeout(() => {
      setLoading(false)
    },3000);
  }

  useEffect(() => {
    fetchNewItems();
  }, []);

  const itemsCount = NewItems.length;
  const slidesPerView = Math.min(itemsCount, 4);
  const enableLoop = itemsCount > 4;

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
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

            {loading
              ? // 🟦 Skeleton Slides
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <SwiperSlide key={i}>
                      <SkeletonSlide />
                    </SwiperSlide>
                  ))

           :  // ✅ Real Data Slides

          newItems.map((n, index) => (
            <SwiperSlide className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                  >
                    <img className="lazy" src={n.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                {/* ⏳ Expiry Countdown */}
                <div>
                  {n.expiryDate && <Countdown expiryDate={n.expiryDate} />}
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
                      src={n.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{n.title}</h4>
                  </Link>
                  <div className="nft__item_price">${n.price}</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{n.likes}</span>
                  </div>
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

export default NewItems;
