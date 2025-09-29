import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ExploreItems.css"


const ExploreItems = ({ explore }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [visibleCount, setVisibleCount] = useState(4); // show 4 items initially
  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ skeleton state

  // Countdown formatter
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

 useEffect(() => {
  if (explore && explore.length > 0) {
    setLoading(false);
    setCard(explore);

    const countdowns = explore.map((item) =>
      item.expiryDate
        ? Math.floor((new Date(item.expiryDate) - new Date()) / 1000)
        : 5 * 3600 + 30 * 60 + 32
    );

    setTimeLeft(countdowns);
  }
}, [explore]);

  // Countdown tick
  useEffect(() => {
    if (!loading && card.length > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev.map((time) => (time > 0 ? time - 1 : 0)));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, card]);

    const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4); // load 4 more items each click
  };

  function filterExploreItems(filter) {
    let sortedData = [...explore]; // clone original data
    
    console.log(filter)

    if(filter === "price_low_to_high") {
     sortedData.sort((a,b) =>a.price - b.price)
    }
    if(filter === "price_high_to_low") {
     sortedData.sort((a,b) =>b.price - a.price)
    }
    if(filter === "likes_high_to_low") {
     sortedData.sort((a,b) =>b.likes - a.likes)
    } 

    setCard(sortedData); // update state with sorted list

  }


  return (
    <>
      <div>
        <select id="filter-items"  defaultValue="DEFAULT"onChange={(event) =>filterExploreItems(event.target.value)}>
          <option value="DEFAULT" disabled>Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

        {/* ✅ Skeleton loader when loading */}
      {loading
        ? Array.from({ length: visibleCount }).map((_, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            >
              <div className="nft__item skeleton">
                <div className="skeleton-img"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
          ))

          :

      card.slice(0,visibleCount).map((item, index) => (
        <div
          key={index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to="/author"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
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
                <img src={item.nftImage} className="lazy nft__item_preview" alt="" />
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
        </div>
      ))}

      {!loading && visibleCount < explore.length && (
        <div className="col-md-12 text-center">
      <button id="loadmore" className="btn-main lead" onClick={handleLoadMore}>
          Load more
        </button>
      </div>
      )}
      

    </>
  );
};

export default ExploreItems;
