import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import axios from 'axios';
import { message } from 'antd';
import { BASE_API_URL } from "../config/index"; // API URL'sini ekleyin

const OfficialModal = ({ open, handleClose, userData, userSkins }) => {
  const [clickedLinks, setClickedLinks] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageClicked, setImageClicked] = useState({});

  // Skin ID mapping
  const skinIDMapping = {
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
  };

  const items = [
    { id: 6, title: 'YouTube Video', imgSrc: 'https://via.placeholder.com/150', link: 'https://www.youtube.com/watch?v=example', type: 'video' },
    { id: 7, title: 'Twitter Profile', imgSrc: 'https://via.placeholder.com/150', link: 'https://twitter.com/example', type: 'follow' },
    { id: 8, title: 'Item 3', imgSrc: 'https://via.placeholder.com/150', link: 'https://twitter.com/example', type: 'follow' },
    { id: 9, title: 'Item 4', imgSrc: 'https://via.placeholder.com/150', link: 'https://twitter.com/example', type: 'follow' },
    { id: 10, title: 'Item 4', imgSrc: 'https://via.placeholder.com/150', link: 'https://twitter.com/example', type: 'follow' },
  ];

  const handleLinkClick = (item) => {
    window.open(item.link, '_blank');
    setImageClicked((prev) => ({ ...prev, [item.id]: true }));
  };

  const handleBuySkin = async (item) => {
    setIsLoading(true);
    const skinIDbr = skinIDMapping[item.id];

    try {
      const response = await axios.post(`${BASE_API_URL}buy-skin`, {
        userId: userData.id,
        skinID: skinIDbr,
      });

      message.success(`Skin ${item.title} purchased successfully!`);
      setClickedLinks((prev) => ({ ...prev, [item.id]: true }));
    } catch (error) {
      message.error('Error purchasing skin');
      console.error('Error purchasing skin:', error);
      setClickedLinks((prev) => ({ ...prev, [item.id]: 'failed' }));
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = (item) => {
    return clickedLinks[item.id] === true || userSkins.includes(skinIDMapping[item.id]) || !imageClicked[item.id];
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-page-modal-title"
      aria-describedby="new-page-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75vw",
          maxHeight: "80vh", // Maximum height for scrolling
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: "17px",
          background: "#ffffffb5",
          backdropFilter: "blur(5px)",
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Typography
          id="new-page-modal-title"
          fontFamily="avenir"
          sx={{ fontSize: "24px", fontWeight: 'bold', marginBottom: 2 }}
        >
          Official Items
        </Typography>

        <Grid container spacing={2}>
          {items.map(item => (
            <Grid item xs={6} key={item.id}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  textAlign: 'center',
                  padding: 2,
                  background: '#f9f9f9',
                  cursor: 'pointer',
                  '&:hover': {
                    background: '#e0e0e0',
                  },
                }}
              >
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(item);
                  }}
                />
                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  {item.title}
                </Typography>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuySkin(item);
                  }}
                  sx={{
                    marginTop: 1,
                    backgroundColor: isButtonDisabled(item) ? 'gray' : 'primary.main',
                    color: 'white',
                  }}
                  disabled={isButtonDisabled(item)}
                >
                  {clickedLinks[item.id] === true 
                    ? 'Purchased' 
                    : clickedLinks[item.id] === 'failed' 
                    ? 'Purchase Failed' 
                    : 'Check'
                  }
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
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
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OfficialModal;
