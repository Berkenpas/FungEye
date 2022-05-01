import React from 'react';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import '../../App.css'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import p1 from './m3.gif';
import p2 from './berk_aboutus.gif';
import p3 from './prof2.gif';
import p4 from './prof4.gif';
import './AboutUs.css'


  const theme = createTheme({
    typography: {
      fontFamily: [
        'Quicksand',
        'sans-serif'
      ].join(','),
    }
  });


const AboutUs = ()=>{


    return (
        <div>
          <Container>
            <ThemeProvider theme={theme}>
            <div style = {{borderBottom: "1px solid grey" }}>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h3"
              align="center"
            >
                <p></p>
              About Us
            </Typography>
            </div>
            </ThemeProvider>
            <p></p>
            <div className = 'subtitles'>
              Our Mission Statement
            </div>
            <div className = 'paragraph'>
            FungEye aims to provide mushroom enthusiasts with a crowdsourced AI 
            solution to identifying wild mushrooms and to develop a high quality classified mushroom image dataset.
            </div>
            <p></p>
            <div className = 'subtitles'>
              Who We Are
            </div>
            <div className = 'paragraph'>
            We are four students from Pacific Lutheran University who strive to create a better world through 
            technology. We are also great mushroom enthusiasts who care about our environment! FungEye represents the
            essence of our love for nature alongside our passion for software development. Joining all of our interests into 
            this project has opened our eyes to new possibilities and has created new connections.  
            </div>
            <p></p>
            <div className = 'subtitles'>
              Get To Know Us!
            </div>
            <img src = {p1} alt = "P1" className = 'profile'/>
            <img src = {p2} alt = "P1" className = 'profile'/>
            <img src = {p3} alt = "P1" className = 'profile'/>
            <img src = {p4} alt = "P1" className = 'profile'/>
            <p></p>
            <div className = 'info'>
              <div className = 'name'>
                Vicky
              </div>
              <div className = 'about'>
                Vicky is a BS in Mathematics and a BA in Computer Science. She enjoys drawing 
                and painting on the days that are not occupied by coding. 
              </div>
            </div>
            <div className = 'info'>
              <div className = 'name'>
                Berk
              </div>
              <div className = 'about'>
                Berk is a BS in Computer Science with a minor in Data Science.
                He enjoys reading, hiking, and foraging when he's not either working or in class.
              </div>
            </div>
            <div className = 'info'>
              <div className = 'name'>
                Cade
              </div>
              <div className = 'about'>
                About Cade...
              </div>
            </div>
            <div className = 'info'>
              <div className = 'name'>
                Rainier
              </div>
              <div className = 'about'>
                About Rainier...
              </div>
            </div>
            
          </Container>
          <p></p>
        </div>
      );


    
}



export default AboutUs;