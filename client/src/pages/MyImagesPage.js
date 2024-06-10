import React, { useState, useEffect } from 'react';
import { Grid, Card, Box, CardActions, Button, Typography, IconButton, Modal, Backdrop, Fade } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExportIcon from '@mui/icons-material/CloudDownload';
import InputIcon from '@mui/icons-material/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import url from '../components/Url';

const MyImagesPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [reload, setReload] = useState(0); // New state to trigger reload
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      axios.get(`/api/v1/images/getImages/${userId}`)
        .then(response => {
          console.log(response.data.images)
          setImages(response.data.images);
        })
        .catch(error => {
          console.error('There was an error fetching the images:', error);
        });
    }
  }, [reload]); // Add reload state as a dependency

  const handleFeedback = async (id, value) => {
    // Optimistically update the feedback state
    const newImages = images.map(image =>
      image._id === id ? { ...image, Feedback: value } : image
    );
    setImages(newImages);

    try {
      await axios.put(`/api/v1/images/feedback`, {
        imageId: id,
        feedback: value
      });
    } catch (error) {
      // Revert feedback state if API call fails
      console.error('Failed to update feedback:', error);
      const revertedImages = images.map(image =>
        image._id === id ? { ...image, Feedback: '' } : image
      );
      setImages(revertedImages);
    }
  };

  const handleView = (image) => {
    setSelectedImage(image);
  };

  const handleCloseView = () => {
    setSelectedImage(null);
  };

  const handleExport = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported_image.png';
    link.click();
  };

  const handleDelete = (image) => {
    setImageToDelete(image);
    setDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/v1/images/delete/${imageToDelete._id}`);
      setImages(images.filter(image => image._id !== imageToDelete._id));
      setDeleteConfirmation(false);
      setImageToDelete(null);
      setReload(reload + 1); // Increment reload state to trigger useEffect
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleUseAsInput = (image) => {
    console.log(image)
    navigate('/upload', { state: { sendData: image.ImageUrl } });
  };

  return (
    <div style={{ padding: '40px' }}>
      <Typography variant="h4" gutterBottom style={{ fontSize: 35, fontWeight: 800, marginLeft: 25 }}>My Images</Typography>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card>
              <Box style={{ padding: 12, alignItems: "center" }}>
                <img src={image.ImageUrl} alt={image.alt} style={{ width: '100%' }} />
              </Box>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  style={{ padding: 14, backgroundColor: "black", color: "white", marginRight: 6 }}
                  onClick={() => handleView(image)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <VisibilityIcon />
                    <Box component="span" sx={{ mt: 1 }}>View</Box>
                  </Box>
                </Button>

                <Button
                  size="small"
                  color="primary"
                  style={{ padding: 14, backgroundColor: "black", color: "white", marginRight: 6 }}
                  onClick={() => handleExport(image.ImageUrl)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ExportIcon />
                    <Box component="span" sx={{ mt: 1 }}>Export</Box>
                  </Box>
                </Button>

                <Button
                  size="small"
                  color="primary"
                  style={{ padding: 14, backgroundColor: "black", color: "white", marginRight: 6 }}
                  onClick={() => handleUseAsInput(image)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <InputIcon />
                    <Box component="span" sx={{ mt: 1 }}>Use as input</Box>
                  </Box>
                </Button>

                <Button
                  size="small"
                  color="secondary"
                  style={{ padding: 14, backgroundColor: "black", color: "white", marginRight: 6 }}
                  onClick={() => handleDelete(image)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DeleteIcon />
                    <Box component="span" sx={{ mt: 1 }}>Delete</Box>
                  </Box>
                </Button>

                <IconButton
                  color={image.Feedback === 'like' ? 'primary' : 'default'}
                  size="large"
                  onClick={() => handleFeedback(image._id, 'like')}
                >
                  <ThumbUpIcon />
                </IconButton>
                <IconButton
                  color={image.Feedback === 'dislike' ? 'secondary' : 'default'}
                  onClick={() => handleFeedback(image._id, 'dislike')}
                >
                  <ThumbDownIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
            {selectedImage && <img src={selectedImage.ImageUrl} alt={selectedImage.alt} style={{ width: '100%' }} />}
          </Box>
        </Fade>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={deleteConfirmation}>
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
              Are you sure you want to delete this image?
            </Typography>
            <Button variant="contained" color="secondary" onClick={confirmDelete} sx={{ mr: 2 }}>
              Yes
            </Button>
            <Button variant="contained" onClick={() => setDeleteConfirmation(false)}>
              No
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default MyImagesPage;
