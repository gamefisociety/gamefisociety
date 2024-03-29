import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button, Box } from "@mui/material";
import xhelp from "module/utils/xhelp";
import { default_avatar, default_banner } from "module/utils/xdef";
import "./GProfile.scss";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { setProfile } from "module/store/features/profileSlice";

const GProfile = () => {
  const { profile } = useSelector((s) => s.profile);
  const [localProfile, setLocalProfile] = useState({});

  const MetaPro = useMetadataPro();
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalProfile({ ...profile });
    return () => { };
  }, [profile]);

  const saveProfile = async () => {
    let evMetadata = await MetaPro.modify(localProfile);
    System.BroadcastEvent(evMetadata, (tags, client, msg) => {
      if (tags === "OK" && msg.ret && msg.ret === true) {
        localProfile.created_at = evMetadata.createAt;
        dispatch(setProfile(localProfile));
      }
      // console.log('modify profile msg', tags, msg);
    });
  };

  return (
    <Box className={'profile_bg'}>
      <img
        className="banner"
        src={
          localProfile.banner && localProfile.banner !== "default"
            ? localProfile.banner
            : default_banner
        }
        alt="banner"
      />
      <Box className='profile_content'>
        <Avatar
          sx={{
            marginTop: "-43px",
            width: "86px",
            height: "86px",
          }}
          edge="end"
          alt={localProfile.display_name}
          src={
            localProfile.picture && localProfile.picture !== "default"
              ? localProfile.picture
              : ""
          }
        />
        {localProfile.created ? (
          <Typography
            sx={{
              marginTop: "10px",
              fontSize: "12px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
          >
            {"Update: " + xhelp.formateDate(localProfile.created * 1000)}
          </Typography>
        ) : null}
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"YOUR NAME"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.display_name}
            variant="outlined"
            onChange={(event) => {
              localProfile.display_name = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"USER NAME"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.name}
            variant="outlined"
            onChange={(event) => {
              localProfile.name = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"PROFILE AVATAR"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.picture}
            variant="outlined"
            onChange={(event) => {
              localProfile.picture = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"BANNER PICTURE"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.banner}
            variant="outlined"
            onChange={(event) => {
              localProfile.banner = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"WEBSITE"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.website}
            variant="outlined"
            onChange={(event) => {
              localProfile.website = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"ABOUT ME"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.about}
            variant="outlined"
            onChange={(event) => {
              localProfile.about = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"NIP-05"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.nip05}
            variant="outlined"
            onChange={(event) => {
              localProfile.nip05 = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography className={'lable_flag'}>
            {"BITCON LIGHTNING TIPS"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={localProfile.lud16}
            variant="outlined"
            onChange={(event) => {
              localProfile.lud16 = event.target.value;
              setLocalProfile({ ...localProfile });
            }}
          />
        </Box>
        <Button
          variant="contained"
          sx={{
            marginTop: "35px",
            width: "20%",
            height: "48px",
            backgroundColor: "#006CF9",
            borderRadius: "5px",
            fontSize: "16px",
            fontFamily: "Saira",
            fontWeight: "500",
            color: "#FFFFFF",
          }}
          onClick={saveProfile}
        >
          SAVE
        </Button>
      </Box>
    </Box>
  );
};

export default GProfile;
