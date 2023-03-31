import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import {
  setCurrentService,
  setApiKey,
  setApiSecret,
} from "module/store/features/ipfsSlice";
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
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "320px",
            height: "30px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {"[" + currentService.toUpperCase() + "]"}
          </Typography>
          <Link
            sx={{
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
            }}
            target="_blank"
            href={serviceHref()}
          >
            {"No project key, go " + currentService + " get it"}
          </Link>
        </Box>

        <Box
          sx={{
            position: "relative",
            padding: "12px",
            backgroundColor: "#202122",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            borderWidth: "1px",
            borderColor: "#323232",
            marginBottom: "30px",
          }}
        >
          <Box
            sx={{
              width: "340px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              PROJECT KEY
            </Typography>
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
          </Box>
          <Box
            sx={{
              width: "340px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              marginTop: "20px"
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              PROJECT SECRET
            </Typography>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GIPFSLogin;
