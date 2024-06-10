import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, IconButton, Container, CircularProgress, Select, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import exampleImage1 from '../assets/example1.png'; // Replace with your example images
import exampleImage2 from '../assets/example2.png'; // Replace with your example images
import icon from "../assets/Vector.png";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import url from '../components/Url';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [UserID, setUserID] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getID = localStorage.getItem('userID');
    setUserID(getID);
    console.log(getID);

    if (location.state?.sendData) {
      const imageUrl = location.state.sendData;
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
          setSelectedFile(file);
          setIsUploaded(true);
        });
    }
  }, [location.state]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsUploaded(true);
  };

  const handleDropdownChange = (event) => {
    setInputText(event.target.value);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        const Prompt = `A ${inputText} Outdoor Porch Editorial Style Photo, Symmetry, Straight On, Wooden Porch, Stone Fireplace, Wicker Furniture, Lanterns, Cozy Textiles, Neutral Palette, Natural Light, Cottage, Morning, Inviting, Country Style, 4k`
        axios.post(`/api/v1/images/Generate`, { userId: UserID, base64StringImage: base64String, inputText: Prompt })
          .then(response => {
            console.log('Image uploaded successfully:', response.data.output);
            let images = [
              { id: response.data.output[0]._id, src: response.data.output[0].ImageUrl, alt: 'Generated Image 1', Feedback: response.data.output[0].Feedback },
              { id: response.data.output[1]._id, src: response.data.output[1].ImageUrl, alt: 'Generated Image 2', Feedback: response.data.output[1].Feedback },
            ];
            setLoading(false);
            navigate('/create', { state: { sendData: images, } });
          })
          .catch(error => {
            console.error('There was an error uploading the image:', error);
            setLoading(false);
          });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Container sx={{ display: 'flex', alignItems: 'flex-start', mt: 5 }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Create
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: 5 }}>
          <Typography backgroundColor="#d3d3d3" sx={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px', paddingLeft: '15px', gutterBottom: true }}>
            <img src={icon} alt="Icon" style={{ marginRight: '10px', width: '24px', height: '24px' }} />
            Upload an image from your computer or get started with one of the templates
            <br />
            Image formats: JPEG, PNG
          </Typography>
          <Grid container spacing={3} mb={5} mt={3}>
            <Grid item xs={12} sm={isUploaded ? 12 : 6}>
              {selectedFile ? (
                <Paper variant="outlined" sx={{ textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <img src={URL.createObjectURL(selectedFile)} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Paper>
              ) : (
                <Paper variant="outlined" sx={{ textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <IconButton component="label" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CloudUploadIcon fontSize="large" />
                    <Typography>Drag and drop or click to browse</Typography>
                    <input type="file" hidden onChange={handleFileChange} />
                  </IconButton>
                </Paper>
              )}
            </Grid>
            {!isUploaded && (
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: 25, fontWeight: "bold" }}>
                    Don't have an image?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 6, fontSize: 15 }}>
                    Use an example
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <img src={exampleImage1} alt="Example 1" style={{ width: '60%' }} />
                    </Grid>
                    <Grid item xs={6}>
                      <img src={exampleImage2} alt="Example 2" style={{ width: '60%' }} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
          <Select
            value={inputText}
            onChange={handleDropdownChange}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Please select a style</MenuItem>
            <MenuItem value="Rustic Charm">Rustic Charm</MenuItem>
            <MenuItem value="Bohemian Retreat">Bohemian Retreat</MenuItem>
            <MenuItem value="Minimalist Zen">Minimalist Zen</MenuItem>
            <MenuItem value="Coastal Breeze">Coastal Breeze</MenuItem>
            <MenuItem value="Urban Chic">Urban Chic</MenuItem>
            <MenuItem value="Garden Oasis">Garden Oasis</MenuItem>
          </Select>
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: 'green', color: 'white' }}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
        </Button>
      </Box>
    </Container>
  );
};

export default UploadPage;
