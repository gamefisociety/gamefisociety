import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  CardContent,
} from "@mui/material";
import { Stepper, Step, StepLabel, StepContent } from "@mui/material";

import "./GIntroduce.scss";

import footer_logo from "../../asset/image/logo/footer_logo.png";
import logo_nostr from "../../asset/image/introduce/logo_nostr.png";
import logo_twitter from "../../asset/image/introduce/logo_twitter.png";
import logo_github from "../../asset/image/introduce/logo_github.png";
import logo_discord from "../../asset/image/introduce/logo_discord.png";
import logo_tele from "../../asset/image/introduce/logo_tele.png";
import bg_partone from "../../asset/image/introduce/bg_partone.png";
import bg_partwo_nostr from "../../asset/image/introduce/bg_partwo_nostr.png";
import bg_partwo_polygon from "../../asset/image/introduce/bg_partwo_polygon.png";
import bg_features_1 from "../../asset/image/introduce/bg_features_1.png";
import bg_features_2 from "../../asset/image/introduce/bg_features_2.png";
import bg_features_3 from "../../asset/image/introduce/bg_features_3.png";
import bg_features_4 from "../../asset/image/introduce/bg_features_4.png";
import bg_features_5 from "../../asset/image/introduce/bg_features_5.png";
import bg_features_6 from "../../asset/image/introduce/bg_features_6.png";
import bg_features_7 from "../../asset/image/introduce/bg_features_7.png";
import bg_features_8 from "../../asset/image/introduce/bg_features_8.png";
const steps = [
  {
    label: "2022-Q4",
    description: "# a\n# b\n# c\n",
  },
  {
    label: "2023-Q1",
    description: `For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "2023-Q2",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "2023-Q3",
    description: `Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.`,
  },
  {
    label: "2023-Q4",
    description: `Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.`,
  },
];

const GIntroduce = () => {
  const navigate = useNavigate();
  useEffect(() => {
    return () => {};
  }, []);

  const renderPartOne = () => {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "54px",
                fontFamily: "Saira",
                fontWeight: "600",
              }}
              color={"#FFFFFF"}
            >
              {"GameFi Society"}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
              }}
              color={"#FFFFFF"}
            >
              {
                "A truly decentralized game social media, all information is the real reaction of users."
              }
            </Typography>
            <Box
              sx={{
                marginTop: "27px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "102px",
                  height: "36px",
                  backgroundColor: "#006CF9",
                  borderRadius: "5px",
                  marginRight: "15px",
                }}
                onClick={() => {
                  navigate("/home");
                  //   navigate("/mint");
                }}
              >
                {"Launch"}
              </Button>
              <Button
                variant="contained"
                sx={{
                  width: "102px",
                  height: "36px",
                  backgroundColor: "#202020",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  const w = window.open("about:blank");
                  w.location.href =
                    "https://gamefisocietys-organization.gitbook.io/gamefi-society/";
                }}
              >
                {"WhitePaper"}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: "540px",
              height: "386px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={bg_partone} width="540px" alt="bg_partone" />
          </Box>
        </Box>
      </Box>
    );
  };

  const renderTwoNet = () => {
    return (
      <Box
        sx={{
          marginTop: "70px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "36px",
              fontFamily: "Saira",
              fontWeight: "600",
              marginBottom: "20px",
            }}
            color={"#FFFFFF"}
          >
            {"Nostr & Polygon"}
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Card
              sx={{
                width: "538px",
                height: "489px",
                backgroundColor: "#272727",
              }}
            >
              <CardMedia
                component="img"
                width="538px"
                height="280px"
                image={bg_partwo_nostr}
                alt="bg_partwo_nostr"
              />
              <CardContent
                sx={{
                  width: "538px",
                  height: "209px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-around",
                  paddingLeft: "35px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# keypairs to user system, say no to email & phone "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# Encrypted private chat days "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# Feel free to post to the relays "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# Content that never goes away "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# Censorship resistant content "}
                </Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                width: "538px",
                height: "489px",
                backgroundColor: "#272727",
              }}
            >
              <CardMedia
                component="img"
                width="538px"
                height="280px"
                image={bg_partwo_polygon}
                alt="bg_partwo_polygon"
              />
              <CardContent
                sx={{
                  width: "538px",
                  height: "209px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-around",
                  paddingLeft: "35px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# GFS Token ecology "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# NFT mint & market "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# Store key information on the chain "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# High-quality content on the chain "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#FFFFFF"}
                >
                  {"# GameFi Society DAO "}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderFeatures = () => {
    return (
      <Box
        sx={{
          marginTop: "50px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          direction="column"
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "36px",
              fontFamily: "Saira",
              fontWeight: "600",
              marginBottom: "20px",
            }}
            color={"#FFFFFF"}
          >
            {"Features"}
          </Typography>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            spacing={3}
          >
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_1}
                  alt={"bg_features_1"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"Post Notes"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can freely publish posts to the relays, and can also private message each other through the relays"
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_2}
                  alt={"bg_features_2"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"Follows"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can follow each other and be followed by each other."
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_3}
                  alt={"bg_features_3"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"Premium Content"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can spend some fees to push content to the blockchain. Obtain the display of the platform,"
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_4}
                  alt={"bg_features_4"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"Slots Auction"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can purchase, bid for slots on the platform, and place their own content for display."
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_5}
                  alt={"bg_features_5"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"Create & Display Game"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can push game items to the platform to get more traffic."
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_6}
                  alt={"bg_features_6"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"Topic Group"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "19px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users join topic groups and can communicate around fixed topics. These subjects can be games,hobbies, news, etc."
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_7}
                  alt={"bg_features_7"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"NFT Swap & Mint"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can mint NFT, issue their own NFT, and conduct NFT transactions in the NFT market."
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                className={"introduce_card"}
                sx={{
                  position: "relative",
                  width: "272px",
                  height: "272px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#222528",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "158px",
                    backgroundColor: "#F3F3F3",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    zIndex: 1,
                  }}
                ></Box>
                <CardMedia
                  sx={{ width: "272px", height: "190px", zIndex: 2 }}
                  image={bg_features_8}
                  alt={"bg_features_8"}
                ></CardMedia>
                <CardContent
                  sx={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: "0px",
                    width: "272px",
                    height: "106px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                    }}
                    color={"#FFFFFF"}
                  >
                    {"GFS DAO"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "22px",
                    }}
                    color={"#FFFFFF"}
                  >
                    {
                      "Users can participate in ecological governance, content review and receive certain rewards."
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const renderToken = () => {
    return (
      <Stack
        spacing={2}
        direction="column"
        alignItems={"center"}
        justifyContent={"flex-start"}
        sx={{
          width: "100%",
          // height: '400px',
          // backgroundColor: 'red',
        }}
      >
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            width: "1440px",
            height: "400px",
            backgroundColor: "blue",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              my: "46px",
              // ml: '8px'
            }}
            variant="h4"
            color={"white"}
            align={"left"}
          >
            {"Token Display"}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  const renderRoadMap = () => {
    return (
      <Box
        sx={{
          marginTop: "50px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "36px",
              fontFamily: "Saira",
              fontWeight: "600",
              marginBottom: "20px",
            }}
            color={"#FFFFFF"}
          >
            {"RoadMap"}
          </Typography>
          <Stepper
            activeStep={1}
            orientation="horizontal"
            alternativeLabel={true}
          >
            {steps.map((step, index) => (
              <Step key={step.label} expanded={true}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent sx={{}}>
                  <Typography
                    sx={{
                      mt: "20px",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      fontSize: "12px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      lineHeight: "17px",
                      //   backgroundColor: "red"
                    }}
                    color={"#FFFFFF"}
                  >
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    );
  };

  const renderUs = () => {
    return (
      <Box
        sx={{
          marginTop: "50px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "36px",
              fontFamily: "Saira",
              fontWeight: "600",
              marginBottom: "20px",
            }}
            color={"#FFFFFF"}
          >
            {"Join our community"}
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                width: "264px",
                height: "194px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#232526",
                paddingTop: "15px",
              }}
            >
              <CardMedia
                sx={{
                  width: "48px",
                  height: "48px",
                }}
                image={logo_nostr}
                alt={"logo_nostr"}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    height: "25px",
                    fontSize: "16px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#919191"}
                >
                  {"Nostr"}
                </Typography>
                <Typography
                  sx={{
                    height: "30px",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    fontSize: "12px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    lineHeight: "19px",
                  }}
                  color={"#919191"}
                >
                  {
                    "npub1jxj9kzvtgd8pfvrnxy6ssvky5kz9j2c5a9c6ldlycq70f7z7wuhsfz96ep"
                  }
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  height: "32px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "156px",
                    height: "32px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    backgroundColor: "#191A1B",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    const w = window.open("about:blank");
                    w.location.href = "https://twitter.com/GameFi_Society";
                  }}
                >
                  {"Follow on nostr"}
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Stack
            spacing={2}
            direction="row"
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              width: "100%",
              mt: "24px",
              // backgroundColor: 'blue',
            }}
          >
            <Card
              sx={{
                width: "264px",
                height: "194px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#232526",
                paddingTop: "15px",
              }}
            >
              <CardMedia
                sx={{
                  width: "48px",
                  height: "48px",
                }}
                image={logo_twitter}
                alt={"logo_twitter"}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    height: "25px",
                    fontSize: "16px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#919191"}
                >
                  {"Twitter"}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  marginTop: "30px",
                  height: "32px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "156px",
                    height: "32px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    backgroundColor: "#191A1B",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    const w = window.open("about:blank");
                    w.location.href = "https://twitter.com/GameFi_Society";
                  }}
                >
                  {"Follow on Twitter"}
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                width: "264px",
                height: "194px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#232526",
                paddingTop: "15px",
              }}
            >
              <CardMedia
                sx={{
                  width: "48px",
                  height: "48px",
                }}
                image={logo_github}
                alt={"logo_github"}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    height: "25px",
                    fontSize: "16px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#919191"}
                >
                  {"GitHub"}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  marginTop: "30px",
                  height: "32px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "156px",
                    height: "32px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    backgroundColor: "#191A1B",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    const w = window.open("about:blank");
                    w.location.href =
                      "https://github.com/gamefisociety/gamefisociety";
                  }}
                >
                  {"Fork on GitHub"}
                </Button>
              </CardActions>
            </Card>

            <Card
              sx={{
                width: "264px",
                height: "194px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#232526",
                paddingTop: "15px",
              }}
            >
              <CardMedia
                sx={{
                  width: "48px",
                  height: "48px",
                }}
                image={logo_discord}
                alt={"logo_discord"}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    height: "25px",
                    fontSize: "16px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#919191"}
                >
                  {"Discord"}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  marginTop: "30px",
                  height: "32px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "156px",
                    height: "32px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    backgroundColor: "#191A1B",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    const w = window.open("about:blank");
                    w.location.href = "https://discord.gg/fWvn6k2J6k";
                  }}
                >
                  {"Join in Dsicord"}
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                width: "264px",
                height: "194px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "#232526",
                paddingTop: "15px",
              }}
            >
              <CardMedia
                sx={{
                  width: "48px",
                  height: "48px",
                }}
                image={logo_tele}
                alt={"logo_tele"}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    height: "25px",
                    fontSize: "16px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color={"#919191"}
                >
                  {"Telegram"}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  marginTop: "30px",
                  height: "32px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "156px",
                    height: "32px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    textAlign: "center",
                    backgroundColor: "#191A1B",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    const w = window.open("about:blank");
                    w.location.href = "https://discord.gg/fWvn6k2J6k";
                  }}
                >
                  {"Join in Telegram"}
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </Box>
      </Box>
    );
  };

  const renderFooter = () => {
    return (
      <Box
        sx={{
          marginTop: "50px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: "140px",
        }}
      >
        <Box
          sx={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <img src={footer_logo} width="134px" alt="footer_logo" />
          <Typography
            sx={{
              marginLeft: "8px",
              height: "20px",
              fontSize: "12px",
              fontFamily: "Saira",
              fontWeight: "500",
            }}
            color={"#909090"}
          >
            {"The gamefi paradise of the world"}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderHeader = () => {
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
        <Box
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img src={footer_logo} width="200px" alt="footer_logo" />
        </Box>
      </Box>
    );
  };

  const renderAD = () => {
    return (
      <Box
        className={"ad"}
        sx={{
          width: "100%",
          height: "54px",
          backgroundColor: "#33AFFF",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          navigate("/mint");
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          color={"#FFFFFF"}
        >
          {"2000x Freemint GameFi Society Avatar NFTs"}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#0F0F0F" }}>
      {renderAD()}
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          {renderHeader()}
        </Grid>
        <Grid item xs={12}>
          {renderPartOne()}
        </Grid>
        <Grid item xs={12}>
          {renderTwoNet()}
        </Grid>
        <Grid item xs={12}>
          {renderFeatures()}
        </Grid>
        {/* <Grid item xs={12}>
                    {renderToken()}
                </Grid> */}
        <Grid item xs={12}>
          {renderRoadMap()}
        </Grid>
        <Grid item xs={12}>
          {renderUs()}
        </Grid>
        <Grid item xs={12}>
          {renderFooter()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GIntroduce;
