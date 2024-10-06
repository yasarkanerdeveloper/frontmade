import React from 'react';
import { Modal, Backdrop, Fade, Typography, Grid, Box, Avatar } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';


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

const AnimatedDiv = styled('div')(({ open }) => ({
  animation: `${open ? slideIn : slideOut} 0.5s`,
}));

const LeaderboardModal = ({ open, handleClose, leaderboardList }) => {
  const firstPlace = leaderboardList[0] || {};
  const secondPlace = leaderboardList[1] || {};
  const thirdPlace = leaderboardList[2] || {};

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
          backgroundColor: '#0C0E25',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '330px',
          height: '85vh',
          margin: 'auto',
          marginTop: '4vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <Grid container spacing={4} textAlign={'center'}>
            <Box sx={{ textAlign: 'center', width: '100%', ml: 2, mb: 6,color:'#FDFDFD' }}>
              <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'2rem'} sx={{ mt: 4 }}>Leaderboard</Typography>
              <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1rem'} sx={{ mt: 0.5 }}>Here are the top players</Typography>
            </Box>
          </Grid>

          <Grid container spacing={4} textAlign={'center'}>
            <Box sx={{ alignItems: 'center', width: '100%', ml: 2 }}>

              {/* Top 3 Players (First, Second, Third) */}
              <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  {/* Second Place */}
                  <Box style={{ textAlign: 'center',color:'#FDFDFD'}}>
                    <Avatar src={secondPlace.avatarUrl} sx={{ width: 80, height: 80, margin: 'auto' }} />
                    <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1.2rem'}>
                      2nd
                    </Typography>
                    <Typography>{secondPlace.username || 'Empty'}</Typography>
                    <Typography>{secondPlace.points || '0'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  {/* First Place */}
                  <Box style={{ textAlign: 'center', color:'#FDFDFD',
                   }}>
                    <Avatar src={firstPlace.avatarUrl} sx={{ width: 100, height: 100, margin: 'auto', border: '2px solid gold' }} />
                    <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1.5rem'}>
                      1st
                    </Typography>
                    <Typography>{firstPlace.username || 'Empty'}</Typography>
                    <Typography>{firstPlace.points || '0'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  {/* Third Place */}
                  <Box style={{ textAlign: 'center', color:'#FDFDFD'}}>
                    <Avatar src={thirdPlace.avatarUrl} sx={{ width: 80, height: 80, margin: 'auto' }} />
                    <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1.2rem'}>
                      3rd
                    </Typography>
                    <Typography>{thirdPlace.username || 'Empty'}</Typography>
                    <Typography>{thirdPlace.points || '0'}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Below Top 3, original list remains unchanged */}
            </Box>
          </Grid>
          <Grid container spacing={4} textAlign={'center'}>
            <Box sx={{ textAlign: 'center', width: '100%', ml:2, mb: 6 }}>
               <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'2rem'} sx={{ mt: 4 }}> </Typography>
               <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1rem'} sx={{ mt: 0.5 }}></Typography>
            </Box>
          </Grid>
          <Grid container spacing={4} textAlign={'center'}>
            <Box sx={{alignItems: 'center', width: '100%', ml:2 }}>
                {leaderboardList?.map((referral, index) => (
                <Box key={index} bgcolor={'#0C0E25'} style={{ textAlign: 'left', width: '95%', margin:'5px', padding: '10px', borderRadius: '10px' }}>
                  <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1rem'} color={'blanchedalmond'}>{referral.username} 
                    <span style={{position: 'absolute',right: '35px',background: '#ffffff7d',borderRadius: '10px',color: '#ffffff7d',padding: '5px 10px',marginTop: '10px'}}>
                       {referral.points}
                    </span>
                   </Typography>
                  <Typography fontFamily={'avenir, sans-serif, serif'} color={'blanchedalmond'} fontWeight={700} fontSize={'0.8rem'}>ID : {referral.userId}</Typography>
                </Box>
                ))}
                 {leaderboardList.length === 0 && (
                <Box bgcolor={'#ffffff7d'} style={{ textAlign: 'left', width: '95%', margin:'5px', padding: '10px', borderRadius: '10px' }}>
                  <Typography fontFamily={'avenir, sans-serif, serif'} fontWeight={700} fontSize={'1.5rem'}>Ranking is empty :</Typography>
                </Box>
                )}
            </Box>
          </Grid>
          <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
            <CloseIcon onClick={handleClose} />
          </div>
        </AnimatedDiv>
      </Fade>
    </Modal>
  );
};

export default LeaderboardModal;
