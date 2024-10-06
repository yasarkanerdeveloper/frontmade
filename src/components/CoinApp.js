import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { message } from "antd";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  LinearProgress,
} from "@mui/material";
import SkinsModal from "./Skins";
import OfficialModal from "./Official";
import FriendsModal from "./Freinds";
import LeaderboardModal from "./Leaderboard";
import { keyframes } from "@emotion/react";
import MyProgress from "./Progress";
import axios from "axios";
import leafRight from "../images/leaf-right.png";
import { BASE_API_URL } from "../config/index";

// import images of skins
import defaultCoin from "../images/rabbit1.png";
import OrangeCoin from "../images/rabbit1.png";
import GuardCoin from "../images/rabbit1.png";
import BattleCoin from "../images/rabbit1.png";
const isDesktop = window.innerWidth > 1000;
const theme = createTheme();

// Styled components for the gold buttons
const openPopups = () => {
  window.open(
    'https://www.beinconnect.com.tr',
    '_blank',
    'width=600,height=400,left=200,top=200'
  );
};
  
const GoldButton = styled(Button)({
  backgroundColor: "transparent",
  borderRadius: 15,
  width: "20vw",
  margin: "10px",
  padding: window.innerHeight < 740 ? "5px" : "10px",
  fontFamily: "avenir",
  fontSize: "19px",
  textTransform: "Capitalize",
  fontWeight: 800,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
});

const CoinLogo = styled(Box)({
  width: "35vw",
  marginBottom: "15px",
  // filter: 'hue-rotate(12deg) drop-shadow(0px 0px 25px #0152AC)',
  [theme.breakpoints.down("md")]: {
    width: window.innerHeight < 740 ? "67vw" : "75vw",
    marginBottom: window.innerHeight < 740 ? "10px" : "35px",
  },
});

// keyframes for animation
const expand = keyframes`
   from, to { width: ${isDesktop ? "33vw" : "73vw"}; }
   20% { width: ${isDesktop ? "28.5vw" : "68vw"}; }
   50% { width: ${isDesktop ? "30vw" : "70vw"}; }
`;

const fontSizeAnim = keyframes`
   from, to { font-size: ${isDesktop ? "22px" : "26px"}; }
   50% { font-size: ${isDesktop ? "22px" : "26px"}; }
`;

const floatUpAndFadeOut = keyframes`
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
`;

export default function CoinApp(props) {
  const {
    userData,
    profileUrl,
    telApp,
    userId,
    pointCount,
    setPointCount,
    miningInfo,
    setMiningInfo,
  } = props;
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openSkins, setOpenSkins] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const [expandAnimation, setExpandAnimation] = useState("");
  const [fontSizeAnimation, setFontSizeAnimation] = useState("");
  const [textPoints, setTextPoints] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [userSkins, setUserSkins] = useState([]);
  const [userCurrentSkinID, setUserCurrentSkinID] = useState();
  const [userCurrentSkinImage, setUserCurrentSkinImage] = useState(0);
  const [userCurrentReferrals, setUserCurrentReferrals] = useState(0);
  const [userReferralsInfo, setUserReferralsInfo] = useState([]);
  const [userCurrentRank, setUserCurrentRank] = useState(null);
  const [leaderboardList, setLeaderboardList] = useState([]);

  const [openNewPage, setOpenNewPage] = useState(false); // Yeni modal için state

  const handleOpenNewPage = () => setOpenNewPage(true); // Yeni sayfayı açma fonksiyonu
  const handleCloseNewPage = () => setOpenNewPage(false);

  const [audio] = useState(
    new Audio("https://assets.mixkit.co/active_storage/sfx/216/216.wav"),
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      setMiningInfo((prevMiningInfo) => {
        // Only increase limit if it's below the max
        if (userData.id) axios.get(`${BASE_API_URL}user/${userData.id}`);
        if (prevMiningInfo.limit < prevMiningInfo.max) {
          return { ...prevMiningInfo, limit: prevMiningInfo.limit + 1 };
        } else {
          // Otherwise, keep the previous state unchanged
          clearInterval(interval); // If limit reached max, clear the interval to stop it
          return prevMiningInfo;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [miningInfo.limit]);

  useEffect(() => {
    const req = async () => {
      await axios
        .post(`${BASE_API_URL}user/${userId}/add-point`, {
          points: miningInfo.perClick,
        })
        .then((response) => {
          console.log("Score was updated:", response.data);
          // Additional code to handle the response...
        })
        .catch((error) => {
          console.error("Error updating score:", error);
          // Additional code to handle the error...
        });
    };
    req();
  }, [pointCount]);

  useEffect(() => {
    const req = async () => {
      await axios
        .get(`${BASE_API_URL}user/${userId}`)
        .then((response) => {
          const userCurrentSkinID = response.data.skinID;
          setUserSkins(response.data.skins);
          setUserCurrentSkinID(userCurrentSkinID);
          setUserCurrentReferrals(response.data.referrals);
          setUserReferralsInfo(response.data.referralsInfo);
          // set user images
          switch (userCurrentSkinID) {
            case 1:
              setUserCurrentSkinImage(defaultCoin);
              break;
            case 2:
              setUserCurrentSkinImage(OrangeCoin);
              break;
            case 3:
              setUserCurrentSkinImage(GuardCoin);
              break;
            case 4:
              setUserCurrentSkinImage(BattleCoin);
              break;
            default:
              setUserCurrentSkinImage(defaultCoin);
          }
        })
        .catch((error) => {
          console.error("Error getting skins:", error);
          // Additional code to handle the error...
        });

      await axios
        .get(`${BASE_API_URL}user/${userId}/get-rank`)
        .then((response) => {
          setUserCurrentRank(response.data.rank);
          console.log("Rank:", response.data.rank);
          // Additional code to handle the response...
        });

      await axios
        .get(`${BASE_API_URL}leaderboard`)
        .then((response) => {
          setLeaderboardList(response.data.users);
        })
        .catch((error) => {
          console.error("Error getting leaderboard:", error);
        });
    };
    req();
  }, [pointCount, openSkins, openFriends]);


  const handleOpen = () => setOpenWithdraw(true);
  const handleClose = () => setOpenWithdraw(false);

  // Handle the change of the address input
  const handleAddressChange = (event) => setUserAddress(event.target.value);

  const handleCoinClick = (event) => {
   
  };

  // this function will show withdraw modal after user clicked on the button
  const handleWithdrawClick = () => {
    setOpenWithdraw(true);
  };

  // this function will show after user clicked on the button in withdraw modal
  const handleWithdraw = () => {
    if (pointCount >= 50) {
      axios
        .post(`${BASE_API_URL}withdraw`, {
          userId: userId,
          userAddress: userAddress,
          points: pointCount,
        })
        .then((response) => {
          message.success(
            "Withdrawal was successfully, please check your wallet!",
          );
          if (window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
          }
        })
        .catch((error) => {
          message.error("Something went wrong, please check SendChain bot!");
          // Additional code to handle the error...
        });
    } else {
      alert(
        "Insufficient balance. you need to have at least 5000 points to withdraw",
      );
    }
    setOpenWithdraw(false);
  };
  // remove a point after animation is done
  const removePoint = (id) => {
    setTextPoints(textPoints.filter((point) => point.id !== id));
  };

  const getPointLeftPosition = (pointCount) => {
    const thresholds = [
      [999999999999999, "17vw"],
      [9999999999999, "21vw"],
      [999999999999, "23vw"],
      [9999999999, "27vw"],
      [999999999, "29vw"],
      [99999999, "32vw"],
      [9999999, "34vw"],
      [999999, "36vw"],
      [99999, "38vw"],
      [9999, "40vw"],
      [999, "42vw"],
      [99, "45vw"],
      [9, "46vw"],
    ];

    for (const [threshold, position] of thresholds) {
      if (pointCount > threshold) {
        return position;
      }
    }

    return "47.5vw";
  };

  const getCoinSkinShadow = (userCurrentSkinID) => {
    switch (userCurrentSkinID) {
      case 1:
        return "0px 0px 45px #291400";
      case 2:
        return "0px 0px 45px #FAE088";
      case 3:
        return "0px 0px 45px #5c716c";
      case 4:
        return "0px 0px 45px skyblue";
      default:
        return "0px 0px 45px #0152AC";
    }
  };

  return (

    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1,
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px",
          background: "rgba(0,0,0,0.21)",
          color: "white",
          padding: "10px",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          width: `${isDesktop ? "30vw" : "90vw"}`,
          height: `${isDesktop ? "6.5vw" : "10vh"}`,
        }}
      >
        <Avatar
          src={profileUrl}
          alt="Profile"
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "15px !important",
          }}
        />
        <Typography
          variant="h5"
          component="p"
          sx={{
            fontWeight: "800",
            fontFamily: "Avenir",
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          
        </Typography>

        <Typography
        component="p"
        sx={{
          fontWeight: "800",
          fontFamily: "avenir",
          position: "absolute",
          top: "20%",
          left: getPointLeftPosition(pointCount),
          color: "aliceblue",
          animation: fontSizeAnimation,
          fontSize: `${isDesktop ? "17px" : "17px"}`,
          zIndex: 1,
        }}
      >
      
 
      {pointCount}

        <img
          src="https://i.hizliresim.com/qzm3k1l.png"
          alt="leaf"
          style={{
            marginLeft:"5px",
            marginBottom:"5px",
            width: "5vw",
            height:"3vh",
            verticalAlign: "middle",
            transform: "scaleX(-1)",
          }}
        />
      </Typography>

      <Typography
        component="p"
        sx={{
          background:"#755EF3",
          fontWeight: "600",
          borderRadius:"5px",
          width:"38vw",
          height:"4vh",
          fontFamily: "avenir",
          position: "absolute",
          top: "58%",
          color: "aliceblue",
          fontSize: `${isDesktop ? "12px" : "14"}`,
          zIndex: 1,
        }}
      >

        
<img
          src="https://i.hizliresim.com/72ma2b0.png"
          alt="leaf"
          style={{
            marginRight:"5px",
            marginBottom:"5px",
            width: "5vw",
            height:"3vh",
            verticalAlign: "middle",
            transform: "scaleX(-1)",
          }}
        />

        
        Ranking :{" "}
        {userCurrentRank === null
          ? "Loading..."
          : userCurrentRank === 1
            ? "1st"
            : userCurrentRank === 2
              ? "2nd"
              : userCurrentRank === 3
                ? "3rd"
                : `${userCurrentRank}th`}
        
      </Typography>


      </Box>

    
      <CoinLogo
        component="img"
        src={userCurrentSkinImage || defaultCoin}
        alt="Coin Logo"
        onClick={handleCoinClick}
        sx={{
          animation: expandAnimation,
          "&:hover": { cursor: "pointer" },
          filter: `drop-shadow(${getCoinSkinShadow(userCurrentSkinID)})`,
        }}
      />

      {textPoints.map((point) => (
        <Box
          key={point.id}
          sx={{
            position: "absolute",
            left: point.x - 10,
            top: point.y - 20,
            animation: `${floatUpAndFadeOut} 1s ease forwards`, // forwards keeps the end state after animation completes
            fontSize: `${isDesktop ? "40px" : "35px"}`,
            fontFamily: "avenir",
            color: "white",
          }}
          onAnimationEnd={() => removePoint(point.id)} // remove element after animation
        >
          +{miningInfo.perClick}
        </Box>
      ))}

 
      {/* Buttons */}
      <Box
        sx={{
          mb: 2,
          width: "95vw",
          maxWidth: "138vw",
          background: "#2f32325c",
          borderRadius: "15px",
          display: "flex",
          backdropFilter: "blur(10px)",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <GoldButton variant="contained" onClick={() => setOpenFriends(true)}>
        <span style={{ marginRight: "5px", marginTop: "5px", fontSize:"14px"}}>
            Frens
          </span>{" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="25"
            height="25"
            src="https://i.hizliresim.com/bvbdr4r.png"
            alt="paint-palette"
          />
        </GoldButton>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          color="rgb(255 255 255 / 40%)"
          sx={{ marginRight: "30px" }}
        />
        <GoldButton
          variant="contained"
          onClick={() => setOpenLeaderboard(true)}
        >
          
          
          <span style={{ marginRight: "5px", marginTop: "5px", fontSize:"14px"}}>
            Ranked
          </span>
          <img
            style={{ verticalAlign: "middle" }}
            width="25"
            height="25"
            src="https://i.hizliresim.com/nenl69m.png"
            alt="external-podium"
          />
        </GoldButton>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          color="rgb(255 255 255 / 40%)"
          sx={{ marginLeft: "30px" }}
        />
        <GoldButton variant="contained" onClick={handleOpenNewPage}>
        <span style={{ marginRight: "5px", marginTop: "5px", fontSize:"14px"}}>
            Earn
          </span>{" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="25"
            height="25"
            src="https://i.hizliresim.com/gzmgbqr.png"
            alt="paint-palette"
          />
          
        </GoldButton>
        <GoldButton
          variant="contained"
          onClick={handleWithdrawClick}
          sx={{
            position: "absolute",
            right: "0vw",
            bottom: "15vh",
            padding: "10px",
            fontSize:"20px",
            bottom: "15vh",
            padding: "10px",
           borderRadius: "12px",
            background: "#755EF3",
            width: "30vw",
            height: "7vh",
          }}
        >
          Event{" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="30"
            height="30"
            marginBottom="5px"
            src="
           https://i.hizliresim.com/n9hthed.png
            "
            alt="flash-on"
          />
        </GoldButton>

        <GoldButton
          variant="contained"
          onClick={handleWithdrawClick}
          sx={{
            position: "absolute",
            left: "0.5vw",
            bottom: "15vh",
            padding: "10px",
            borderRadius: "12px",
            background: "#755EF3",
            width: "30vw",
            height: "7vh",
          }}
        >
          Boost{" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="25"
            height="25"
            src="https://img.icons8.com/fluency/48/flash-on.png"
            alt="flash-on"
          />
        </GoldButton>

        <GoldButton
          variant="contained"
          onClick={handleWithdrawClick}
          sx={{
            position: "absolute",
            bottom: "15vw",
            bottom: "7vh",
            padding: "10px",
            borderRadius: "12px",
            background: "#755EF3",
            width: "90vw",
            height: "6vh",
          }}
        >
          Play Game Drop{" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="25"
            height="25"
            src="https://img.icons8.com/fluency/48/flash-on.png"
            alt="flash-on"
          />
        </GoldButton>

        <GoldButton
          variant="contained"
          onClick={handleWithdrawClick}
          sx={{
            position: "absolute",
            bottom: "75vw",
            left: "5vw",
            padding: "10px",
           
            width: "1vw",
            height: "5vh",
          }}
        >
          {" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="55"
            height="55"
            src="https://i.hizliresim.com/b6qrimh.png"
            alt="flash-on"
          />
        </GoldButton>

        <GoldButton
          variant="contained"
          onClick={handleWithdrawClick}
          sx={{
            position: "absolute",
            bottom: "75vw",
            right: "5vw",
            padding: "10px",
           
            width: "1vw",
            height: "5vh",
          }}
        >
          {" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="55"
            height="55"
            src="
            https://i.hizliresim.com/t2txrsi.png"
            alt="flash-on"
          />
        </GoldButton>

        <GoldButton
          variant="contained"
          onClick={handleWithdrawClick}
          sx={{
            position: "absolute",
            bottom: "105vw",
            right: "5vw",
            padding: "10px",
           
            width: "1vw",
            height: "5vh",
          }}
        >
          {" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="55"
            height="55"
            src="
           https://i.hizliresim.com/72ma2b0.png"
            alt="flash-on"
          />
        </GoldButton>

        <GoldButton
          variant="contained"
          
         onClick={() => setOpenSkins(true)}
          sx={{
            position: "absolute",
            bottom: "105vw",
            left: "5vw",
            padding: "10px",
           
            width: "1vw",
            height: "5vh",
          }}
        >
          {" "}
          <img
            style={{ verticalAlign: "middle" }}
            width="55"
            height="55"
            src="
            https://i.hizliresim.com/b7vw16j.png"
            alt="flash-on"
          />
        </GoldButton>
      </Box>

      {/* Withdraw Address Modal */}
      <Modal
        open={openWithdraw}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75vw",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "17px",
            background: "#ffffffb5",
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography
            id="modal-modal-title"
            fontFamily="avenir"
            sx={{ fontSize: "20px" }}
          >
            
             <iframe 
           src="https://superb-kangaroo-41fa03.netlify.app/" 

          width="100%" 
          height="400px" 
          title="Popup İçerik"  
        ></iframe>
        
       

          </Typography>
          
          


          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              sx={{
                fontWeight: "100",
                fontSize: "20px",
                fontFamily: "avenir",
                textTransform: "capitalize",
                margin: "3px",
                borderRadius: "10px",
              }}
            >
              Cancel
            </Button>
            

          </Box>

        </Box>
      </Modal>

      {/* Skins Modal */}
      <SkinsModal
        open={openSkins}
        handleClose={() => setOpenSkins(false)}
        userData={userData}
        userSkins={userSkins}
        userCurrentSkin={userCurrentSkinID}
      />

<OfficialModal
        open={openNewPage}
        handleClose={handleCloseNewPage}
        userData={userData}
        userSkins={userSkins}
        userCurrentSkin={userCurrentSkinID}
      />


      {/* Friends Modal */}
      <FriendsModal
        open={openFriends}
        handleClose={() => setOpenFriends(false)}
        userData={userData}
        referralCount={userCurrentReferrals}
        referralList={userReferralsInfo === "null" ? [] : userReferralsInfo}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        open={openLeaderboard}
        handleClose={() => setOpenLeaderboard(false)}
        userData={userData}
        leaderboardList={leaderboardList}
      />
    </Box>
  );
}
