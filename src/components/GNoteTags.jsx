import React, { useEffect, useState } from "react";
import "./GNoteTags.scss";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { setIsOpen } from "module/store/features/dialogSlice";
import GSTSubjectsBase from "web3/GSTSubjects";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
//

const GNoteTags = (props) => {
  const label = props.label;
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [fetching, setFetching] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = React.useState("");
  const [curTag, setCurTag] = React.useState(label);
  const [dislogOpen, setDialogOpen] = React.useState(false);
  const [createTagState, setCreateTagState] = React.useState(0);
  const dispatch = useDispatch();
  const waittingSubjects = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];

  useEffect(() => {
    if (account) {
      getAllTags();
    }
    return () => {};
  }, [account]);

  useEffect(() => {
    if (account && createTagState === 2) {
      getAllTags();
    }
    return () => {};
  }, [createTagState]);

  //get tags
  const getAllTags = () => {
    if (account) {
      if (fetching) {
        return;
      }
      setFetching(true);
      GSTSubjectsBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchTags(0, Number(res));
          } else {
            setFetching(false);
          }
        })
        .catch((err) => {
          setFetching(false);
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  //
  const fetchTags = (index, count) => {
    if (account) {
      let tagsCache = [];
      GSTSubjectsBase.getSubjects(library, index, count)
        .then((res) => {
          setFetching(false);
          if (res && res.length > 0) {
            tagsCache = tagsCache.concat(res);
            tagsCache.reverse();
            setTags(tagsCache);
            console.log(res);
          }
        })
        .catch((err) => {
          setFetching(false);
          console.log(err, "err");
        });
    } else {
      setFetching(false);
    }
  };

  const createSubject = () => {
    if (newTag.length === 0) {
      return;
    }
    if (account) {
      if (createTagState !== 0) {
        return;
      }
      setCreateTagState(1);
      GSTSubjectsBase.createSubject(library, account, newTag)
        .then((res) => {
          console.log("createSubject", res);
          setCreateTagState(2);
          if (res) {
          }
        })
        .catch((err) => {
          console.log(err, "err");
          setCreateTagState(3);
        });
    }
  };

  const handleClose = () => {
    if (createTagState === 1) {
      return;
    }
    setDialogOpen(false);
  };

  const createTagMsg = () => {
    if (createTagState === 0) {
      return "Create";
    } else if (createTagState === 1) {
      return "Creating";
    } else if (createTagState === 2) {
      return "Success";
    } else if (createTagState === 3) {
      return "Error";
    }
    return "";
  };

  const handleClickOpen = () => {
    if (account) {
      setCreateTagState(0);
      setNewTag("");
      setDialogOpen(true);
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const renderTags = () => {
    return fetching ? renderWaittingTags() : renderCacheTags();
  };

  const renderWaittingTags = () => {
    return (
      <Box className={"tags"}>
        {waittingSubjects.map((index) => {
          return (
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                marginTop: "20px",
              }}
              key={"label_waitting_" + index}
              spacing={1}
            >
              <Skeleton variant="rectangular" width={"80%"} height={8} />
              <Skeleton variant="rectangular" width={"90%"} height={12} />
            </Stack>
          );
        })}
      </Box>
    );
  };

  const renderCacheTags = () => {
    return (
      <Box className={"tags"}>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            marginBottom: "10px",
            backgroundColor: "#1C6CF9",
            "&:hover": {
              backgroundColor: "#368AF9",
            },
          }}
          onClick={handleClickOpen}
        >
          {"CREATE"}
        </Button>
        <Button
          className={curTag === "all" ? "tag_btn_selected" : "tag_btn"}
          onClick={() => {
            setCurTag("all");
            props.clickCallback("all");
          }}
        >
          {"#ALL"}
        </Button>
        {/* <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={40}
              itemCount={tags.length}
              itemData={tags}
            >
              {({ data, index, style }) => (
                <Box style={style}>
                  <Tooltip
                    title={"#" + data[index].name}
                    placement="right"
                    key={"tag-index-" + index}
                  >
                    <Button
                      className={data[index].name === curTag ? "tag_btn_selected" : "tag_btn"}
                      onClick={() => {
                        setCurTag(data[index].name);
                        props.clickCallback(data[index].name);
                      }}
                    >
                      {"#" + data[index].name}
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </FixedSizeList>
          )}
        </AutoSizer> */}
        {tags.map((item, index) => {
          let isSelect = item.name === curTag;
          const title = "#" + item.name;
          return (
            <Tooltip title={title} placement="right" key={"tag-index-" + index}>
              <Button
                className={isSelect ? "tag_btn_selected" : "tag_btn"}
                onClick={() => {
                  setCurTag(item.name);
                  props.clickCallback(item.name);
                }}
              >
                {title}
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  const renderLoadTags = () => {
    return (
      <Box className={"tags"}>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            marginBottom: "10px",
            backgroundColor: "#1C6CF9",
            "&:hover": {
              backgroundColor: "#368AF9",
            },
          }}
          onClick={() => {
            dispatch(setIsOpen(true));
          }}
        >
          {"LOAD TAGS"}
        </Button>
      </Box>
    );
  };

  const renderCreateTagDialog = () => {
    return (
      <Dialog open={dislogOpen} onClose={handleClose}>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            padding: "24px",
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              fontFamily: "Saira",
              fontWeight: "800",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {"CREATE A TAG"}
          </Typography>
          <Box
            sx={{
              marginTop: "30px",
              width: "80%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                height: "28px",
                fontSize: "24px",
                fontFamily: "Saira",
                fontWeight: "500",
                lineHeight: "28px",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              {"#"}
            </Typography>
            <TextField
              disabled={createTagState === 1}
              sx={{
                width: "100%",
                borderRadius: "5px",
                borderColor: "#323232",
                backgroundColor: "#202122",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
              inputProps={{ maxLength: 20 }}
              value={newTag}
              variant="outlined"
              onChange={(event) => {
                let name = event.target.value.trim();
                const scReg = /[!@#$%^&*()_+\{\}:“<>?,.\/;'\[\]\\|`~]+/g;
                const newName = name.replace(scReg, "");
                setNewTag(newName);
              }}
            />
          </Box>

          <LoadingButton
            variant="contained"
            loading={createTagState === 1}
            sx={{
              marginTop: "25px",
              width: "80%",
              height: "48px",
              borderRadius: "5px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
              backgroundColor: "#1C6CF9",
              "&:hover": {
                backgroundColor: "#368AF9",
              },
            }}
            onClick={() => {
              if (createTagState === 1) {
                return;
              }
              if (createTagState === 0) {
                createSubject();
              } else {
                handleClose();
              }
            }}
          >
            {createTagMsg()}
          </LoadingButton>
        </Box>
      </Dialog>
    );
  };

  return (
    <Box className={"bg"}>
      {account ? renderTags() : renderLoadTags()}
      {renderCreateTagDialog()}
    </Box>
  );
};

export default React.memo(GNoteTags);
