import { React, useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useSnackbar } from "notistack";
import FsLightbox from "fslightbox-react";
import copy from "copy-to-clipboard";
import "./GDetailProject.scss";
import ic_open_dapp from "../../asset/image/logo/ic_open_dapp.png";
import ic_report from "../../asset/image/logo/ic_report.png";
import ic_share from "../../asset/image/logo/ic_share.png";

function GDetailProject() {
  const { enqueueSnackbar } = useSnackbar();
  let location = useLocation();
  const { info } = location.state;
  const [videosBox, setVideosBox] = useState([]);
  const [togglerVideos, setTogglerVideos] = useState({
    slide: 0,
    toggles: false,
  });
  const [bannerBox, setBannerBox] = useState([]);
  const [togglerBanner, setTogglerBanner] = useState({
    slide: 0,
    toggles: false,
  });

  useEffect(() => {
    console.log(info);
    return () => {};
  }, []);

  const copyUrlShare = () => {
    let url = window.location;
    copy(url.href);
    enqueueSnackbar("copy share url success", {
      variant: "success",
      anchorOrigin: { horizontal: "center", vertical: "top" },
    });
  };
  const itemVideo = (index) => {
    console.log(index);

    setTogglerVideos({
      toggles: !togglerVideos.toggles,
      slide: index + 1,
    });
  };
  const itemBanner = (index) => {
    setTogglerBanner({
      toggles: !togglerBanner.toggles,
      slide: index + 1,
    });
  };
  const openClickLink = (url) => {
    window.open(url);
  };

  return (
    <div className="nft_detail_bg">
      <div className="layout">
        <div className="head_layout">
          <div className="product_layout">
            <img className="icon" src={info.thumb} alt="icon"></img>
            <div className="title_layout">
              <span className="title">{info.name}</span>
            </div>
          </div>
          <div className="right_layout">
            <div
              className="btn_open"
              onClick={() => openClickLink(info.website)}
            >
              <img className="img" src={ic_open_dapp} alt="dapp"></img>
              <span className="txt">Open dapp</span>
            </div>
            <div className="item_layout">
              <div className="share_btn" onClick={copyUrlShare}>
                <img className="img" src={ic_share} alt="share"></img>
                <span className="txt">Share</span>
              </div>
              <div className="share_btn">
                <img className="img" src={ic_report} alt="report"></img>
                <span className="txt">Report</span>
              </div>
            </div>
          </div>
        </div>
        <div className="tab_info_layout">
          <span className="btn_en">Overview</span>
          {/* <span className="btn_un">Marketplace</span> */}
        </div>
        <div className="info_layout">
          <div className="info_content">
            <span className="title">About {info.name}</span>
            <span className="desc">{info.description}</span>
            <span className="moreBtn">Read more.</span>
            <div className="item_fc_layout">
              <span className="name2">Social</span>
              {info.twitter && (
                <div
                  className="icon_twitter"
                  onClick={() => openClickLink(info.twitter)}
                ></div>
              )}
              {info.discord && (
                <div
                  className="icon_discord"
                  onClick={() => openClickLink(info.discord)}
                ></div>
              )}
              {info.reddit && (
                <div
                  className="icon_reddit"
                  onClick={() => openClickLink(info.reddit)}
                ></div>
              )}
              {info.github && (
                <div
                  className="icon_github"
                  onClick={() => openClickLink(info.github)}
                ></div>
              )}
              {info.telegram && (
                <div
                  className="icon_telegram"
                  onClick={() => openClickLink(info.telegram)}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GDetailProject;
