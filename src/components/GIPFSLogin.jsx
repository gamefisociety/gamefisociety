import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { setCurrentService, setApiKey, setApiSecret } from "module/store/features/ipfsSlice";
import "./GIPFSLogin.scss";
//
const GIPFSLogin = (props) => {
  const { serviceProviders, currentService, apiKey, apiSecret } = useSelector(
    (s) => s.ipfs
  );
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {};
  }, [props]);

  const serviceHref = () => {
    if (currentService === "infura") {
      return "https://app.infura.io/dashboard";
    } else if (currentService === "fleek") {
      return "https://app.fleek.co/";
    } else if (currentService === "pinata") {
      return "https://app.pinata.cloud/developers/api-keys";
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Typography
        sx={{
          marginBottom: "20px",
          fontSize: "15px",
          fontFamily: "Saira",
          fontWeight: "500",
          color: "#FFFFFF",
          textAlign: "left",
          lineHeight: "18px",
        }}
      >
        ⚠️ Notice ⚠️ - &nbsp;Please rest assured that we do not save or upload
        your project key or project secret, we only use them to obtain platform
        upload permissions.
      </Typography>
      <div className="checkboxs">
        {serviceProviders.map((service) => (
          <label className="label" key={service}>
            <input
              className="checkbox"
              checked={currentService === service}
              onChange={() => {
                dispatch(setCurrentService(service));
                dispatch(setApiKey(""));
                dispatch(setApiSecret(""));
              }}
              type="checkbox"
            />
            {service}
          </label>
        ))}
      </div>
      <div className="keyblock">
        <div className="project">
          <p className="name">{"[" + currentService.toUpperCase() + "]"}</p>
          <Link
            sx={{
              marginTop: "5px",
            }}
            target="_blank"
            href={serviceHref()}
          >
            {"No project key, go " + currentService + " get it"}
          </Link>
        </div>

        <div className="keybox">
          <div className="pid">
            <p className="name">PROJECT KEY</p>
            <input
              type="text"
              className="name"
              value={apiKey}
              onChange={(e) => {
                console.log(e);
                dispatch(setApiKey(e.target.value));
              }}
              size="30"
            ></input>
          </div>
          <div className="pid">
            <p className="name">PROJECT SECRET</p>
            <input
              type="password"
              className="name"
              value={apiSecret}
              onChange={(e) => {
                console.log(e);
                dispatch(setApiSecret(e.target.value));
              }}
              size="30"
            ></input>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default GIPFSLogin;
