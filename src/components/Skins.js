import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Button, Typography, Grid, Paper, TextField } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import BattleCoin from '../images/youtube.gif';
import defaultCoin from '../images/xfollow.gif';
import GuardCoin from '../images/telegram.gif';
import OrangeCoin from '../images/mrabbit.gif';
import { message } from 'antd';
import { BASE_API_URL } from "../config/index";

const images = [
  { name: 'X Official', price: '50 Points', src: defaultCoin, link: 'https://x.com' },
  { name: 'Mini Game', price: '150 Points', src: OrangeCoin, link: 'https://link-to-orange-skin.com' },
  { name: 'Telegram Channel', price: '2200 Points', src: GuardCoin, link: 'https://link-to-guard-skin.com' },
  { name: 'Youtube Channel', price: '5000 Points', src: BattleCoin, link: 'https://link-to-battle-skin.com' },
];

const validKeys = {
  1: 'DEFAULT123', 
  2: 'ORANGE123',  
  3: 'GUARD123',   
  4: 'BATTLE123',  
};

const slideIn = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100px);
    opacity: 0;
  }
`;

const AnimatedDiv = styled('div')(({ theme, open }) => ({
  animation: `${open ? slideIn : slideOut} 0.5s`,
  maxHeight: '80vh',
  overflowY: 'auto',
}));

const SkinsModal = ({ open, handleClose, userData, userSkins, userCurrentSkin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [activeSkinId, setActiveSkinId] = useState(null);
  const [keyErrorShown, setKeyErrorShown] = useState(false);

  const handleBuySkin = (event) => {
    const skinID = event.target.id;
    setIsLoading(true);

    if (activeSkinId !== skinID) {
      message.error("Invalid key for this skin, purchase not allowed");
      setIsLoading(false);
      return;
    }

    axios.post(`${BASE_API_URL}buy-skin`, {
      userId: userData.id,
      skinID: Number(skinID)
    })
      .then(response => {
        message.success('Skin purchased successfully!');
        handleClose();
      })
      .catch(error => {
        if (error.response.data.error === "SkinID already exists") {
          axios.post(`${BASE_API_URL}change-skin`, {
            userId: userData.id,
            skinID: Number(skinID)
          }).then(response => {
            message.success('Skin changed successfully');
            handleClose();
          }).catch(error => {
            message.error('Error changing skin');
            console.error('Error changing skin:', error);
          }).finally(() => setIsLoading(false));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleImageClick = (skinId) => {
    const selectedSkin = images.find((image, index) => index + 1 === skinId);
    if (selectedSkin && selectedSkin.link) {
      window.open(selectedSkin.link, '_blank');
    }
  };

  const handleKeyChange = (event) => {
    const inputKey = event.target.value;
    setKeyInput(inputKey);

    const skinId = Object.keys(validKeys).find(skinId => validKeys[skinId] === inputKey);

    if (skinId) {
      setActiveSkinId(skinId);
      setKeyErrorShown(false);
      message.success(`Key is valid for ${images[skinId - 1].name}, you can now buy this skin`);
    } else {
      setActiveSkinId(null);
      if (!keyErrorShown) {
        message.error("Invalid key, please try again");
        setKeyErrorShown(true);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <AnimatedDiv open={open} style={{
          backgroundColor: '#ffffffb5',
          backdropFilter: 'blur(5px)',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '300px',
          margin: 'auto',
          marginTop: '2.5vh',
        }}>
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            Enter Key to Task Earn
          </Typography>
          <TextField
            label="Enter Key"
            variant="outlined"
            fullWidth
            value={keyInput}
            onChange={handleKeyChange}
            sx={{ marginBottom: '20px' }}
          />

          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid key={index} item xs={6}>
                <Paper
                  sx={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img 
                    src={image.src} 
                    alt={`Product ${index + 1}`} 
                    style={{ width: '100%', borderRadius: '10px', cursor: 'pointer' }} 
                    onClick={() => handleImageClick(index + 1)} 
                  />
                  <div style={{ padding: '10px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{image.name}</Typography>
                    <Typography variant="body2">{image.price}</Typography>
                  </div>
                  <Button
                    onClick={handleBuySkin}
                    id={index + 1}
                    variant="contained"
                    disabled={activeSkinId !== (index + 1).toString()} 
                    sx={{
                      backgroundColor: `${userCurrentSkin === index + 1 ? isLoading ? 'darkgray' : 'dodgerblue' : userSkins.includes(index + 1) ? 'gray' : '#00db0e'}`,
                      width: '100%',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontFamily: 'avenir',
                    }}
                  >
                    {userCurrentSkin === index + 1 ? 'Selected' : userSkins.includes(index + 1) ? 'Select' : 'Buy'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
            <CloseIcon onClick={handleClose} />
          </div>
        </AnimatedDiv>
      </Fade>
    </Modal>
  );
};

export default SkinsModal;
