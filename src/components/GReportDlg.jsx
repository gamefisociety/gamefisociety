import React, { useEffect, useState } from "react";
import "./GReportDlg.scss";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { useReportPro } from "nostr/protocal/ReportPro";
import { System } from "nostr/NostrSystem";
const GReportDlg = (props) => {
  const [curType, setCurType] = React.useState("nudity");
  const [content, setContent] = React.useState("");
  // const types = ["nudity", "profanity", "illegal", "spam", "impersonation"];
  const types = ["nudity", "profanity", "illegal", "spam"];
  let reporting = false;
  const reportPro = useReportPro();
  useEffect(() => {}, []);

  const handleDialogClose = () => {
    props.close();
  };

  const report = async () => {
    if(reporting){
      return;
    }
    if(content.length === 0){
      return;
    }
    if(!props.note.pubkey){
      return;
    }
    if(!props.note.id){
      return;
    }
    reporting = true;
    let event = await reportPro.reportNote(props.note.pubkey, props.note.id, curType);

    System.BroadcastEvent(event, (tag, client, msg) => {
      console.log("report note", tag, msg);
      // if (tag === "OK") {
      //  console.log("report success");
      // }
      reporting = false;
      handleDialogClose();
    });
  };

  return (
    <Dialog open={props.open} onClose={handleDialogClose}>
      <Box
        sx={{
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#0F0F0F",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "30px"
        }}
      >
        <Typography
          sx={{
            marginTop: "25px",
            fontSize: "24px",
            fontFamily: "Saira",
            fontWeight: "500",
            lineHeight: "29px",
            textAlign: "center",
            color: "#FFFFFF",
          }}
        >
          {"Report This Note"}
        </Typography>
        <Stack
          sx={{
            marginTop: "20px",
          }}
        >
          {types.map((item, index) => {
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Checkbox
                  checked={curType === item}
                  color="default"
                  onChange={(event) => {
                    setCurType(item);
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    color: "#FFFFFF",
                  }}
                >
                  {item}
                </Typography>
              </Box>
            );
          })}
        </Stack>
        <TextField
          inputProps={{ maxLength: 100 }}
          multiline
          rows={4}
          value={content}
          placeholder="Reason"
          sx={{
            ml: "12px",
            "& .MuiInputBase-root": {
              color: "white",
              width: "250px",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
            },
          }}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <Button
          variant="contained"
          sx={{
            marginTop: "30px",
            width: "250px",
            height: "48px",
            fontSize: "16px",
            fontFamily: "Saira",
            fontWeight: "500",
            backgroundColor: "#FF0000",
            borderRadius: "5px",
            color: "#FFFFFF",
            '&:hover': {
              backgroundColor: '#FF0000',
          },
          }}
          onClick={(event) => {
            event.stopPropagation();
            report();
          }}
        >
          {"Report"}
        </Button>
        <Button
          variant="contained"
          sx={{
            marginTop: "20px",
            width: "250px",
            height: "48px",
            fontSize: "16px",
            fontFamily: "Saira",
            fontWeight: "500",
            color: "#FFFFFF",
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleDialogClose();
          }}
        >
          {"Cancel"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default React.memo(GReportDlg);
