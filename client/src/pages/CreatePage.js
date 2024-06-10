import React, { useState } from 'react';
import { Grid, Card, CardActions, Button, Typography, IconButton, Box, Container, Modal, Backdrop, Fade } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import ExportIcon from '@mui/icons-material/CloudDownload';
import exampleImage1 from '../assets/example1.png';
import exampleImage2 from '../assets/example2.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../components/Url';
import { debounce } from 'lodash';

let images = [
  { id: 1, src: exampleImage1, alt: 'Generated Image 1' },
  { id: 2, src: exampleImage2, alt: 'Generated Image 2' },
];

const CreatePage = () => {
  const [feedback, setFeedback] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [saveConfirmation, setSaveConfirmation] = useState(false);
  const [loading, setLoading] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state ? location.state.sendData : [];

  images = receivedData;

  const handleFeedback = debounce(async (id, value) => {
    // Set loading state for the specific image
    setLoading(prevLoading => ({ ...prevLoading, [id]: true }));
    // Optimistically update the feedback state
    const newFeedback = { ...feedback, [id]: value };
    setFeedback(newFeedback);

    try {
      await axios.put(`/api/v1/images/feedback`, {
        imageId: id,
        feedback: value
      });
    } catch (error) {
      // Revert feedback state if API call fails
      console.error('Failed to update feedback:', error);
      setFeedback(prevFeedback => ({ ...prevFeedback, [id]: '' }));
    } finally {
      // Clear loading state for the specific image
      setLoading(prevLoading => ({ ...prevLoading, [id]: false }));
    }
  }, 300); // Adjust the debounce delay as needed

  const handleBack = () => {
    navigate('/upload', { replace: true });
  };

  const handleView = (image) => {
    setSelectedImage(image);
  };

  const handleCloseView = () => {
    setSelectedImage(null);
  };

  const handleSave = () => {
    setSaveConfirmation(true);
    setTimeout(() => {
      setSaveConfirmation(false);
    }, 5000);
  };

  return (
    <Container sx={{ padding: '40px' }}>
      <Typography variant="h4" gutterBottom style={{ padding: 16 }}>Create</Typography>
      <Typography variant="h6" style={{ padding: 16 }}>Review the generated images</Typography>
      <Grid container spacing={3} style={{ marginTop: '16px' }}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={5} key={image.id}>
            <Card style={{ padding: 12, alignItems: "center" }}>
              <img src={image.src} alt={image.alt} style={{ width: '100%' }} />
              <CardActions>
                <Button
                  size="large"
                  color="primary"
                  startIcon={<SaveIcon />}
                  style={{ padding: 14, backgroundColor: "black", color: "white", marginRight: 26 }}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  size="large"
                  color="primary"
                  startIcon={<ExportIcon />}
                  style={{ padding: 14, backgroundColor: "black", color: "white", marginRight: 16 }}
                  onClick={() => handleView(image)}
                >
                  View
                </Button>
                <Box display="flex" alignItems="center" flexDirection="column" spacing={14} style={{ marginLeft: 23 }}>
                  <Typography variant="body1" color="black" fontSize={16} fontWeight={800}>
                    Algorithm feedback
                  </Typography>
                  <Box display="flex" alignItems="center" flexDirection="row">
                    <IconButton
                      color={feedback[image.id] === 'like' ? 'primary' : 'default'}
                      size="large"
                      onClick={() => handleFeedback(image.id, 'like')}
                      disabled={loading[image.id] === true}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton
                      color={feedback[image.id] === 'dislike' ? 'secondary' : 'default'}
                      onClick={() => handleFeedback(image.id, 'dislike')}
                      disabled={loading[image.id] === true}
                    >
                      <ThumbDownIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        onClick={handleBack}
        sx={{ marginTop: 10, marginBottom: 2, backgroundColor: 'green', color: 'white' }}
      >
        Back
      </Button>

      {/* View Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={handleCloseView}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={!!selectedImage}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              outline: 'none'
            }}
            onClick={handleCloseView}
          >
            {selectedImage && <img src={selectedImage.src} alt={selectedImage.alt} style={{ width: '100%' }} />}
          </Box>
        </Fade>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        open={saveConfirmation}
        onClose={() => setSaveConfirmation(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={saveConfirmation}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              outline: 'none',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              <CheckCircleIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
            </Typography>
            <Typography variant="body1">
              The image has been successfully saved.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default CreatePage;
