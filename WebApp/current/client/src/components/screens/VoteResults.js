import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { makeStyles } from "@mui/styles";
import '../../App.css'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

//REFERENCE CODE: https://www.pluralsight.com/guides/styling-a-react-app-with-material-ui
const useStyles = makeStyles({
    card: {
      maxWidth: 345,
      boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
      backgroundColor: "#fafafa",
    },
    media: {
      height: 300,
    },
  });

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Quicksand',
        'sans-serif'
      ].join(','),
    }
  });
  const theme2 = createTheme({
    typography: {
      fontFamily: [
        'Comfortaa',
        'cursive'
      ].join(','),
    }
  });
  const theme3 = createTheme({
   typography:{
     fontSize: 12,
     fontFamily: [
      'Comfortaa',
      'cursive'
    ].join(','),
   },
  });


const VoteResults = ()=>{
    const [data, setData] = useState([]) 

    useEffect(()=>{
        fetch('/voteresults',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
    }, [])



    const classes = useStyles();

    return (
        <div className = 'every-background'>
          <Container>
            <ThemeProvider theme={theme}>
            <div style = {{borderBottom: "1px solid grey" }}>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h4"
              align="center"
            ><p></p>
              Vote Results
            </Typography>
            <Typography gutterBottom variant = "h5" component = "div" align = "center">
              Recent results from image classification voting:
            </Typography>
            </div>
            </ThemeProvider>
                <p></p>
               
                <Grid container spacing = {3}>
                {data.map(elem => (
                <Grid item xs={12} sm={4} >
                  <ThemeProvider theme = {theme2}>
                  <div>
                  
                  <Card className={classes.card}>
                    <CardMedia
                       className={classes.media}
                      image={elem.picID.image}
                    />
                    <CardContent>
                        <Typography gutterBottom variant = "h5" component = "div">
                            Voting Result:
                        </Typography>
                        <Typography gutterBottom variant = "h6" component = "div">
                            {elem.voteResult.latin}
                        </Typography>
                        <Typography gutterBottom variant = "h6" component = "div">
                            ({elem.voteResult.common})
                        </Typography>
                        <ThemeProvider theme = {theme3}>
                        <Typography gutterBottom variant = "h6" component = "div">
                            AI Prediction: {elem.prediction.latin} 
                        </Typography>
                        <Typography gutterBottom variant = "h6" component = "div">
                            AI Confidence: {elem.conf}%
                        </Typography>
                        </ThemeProvider>
                        <Typography  varient = "body2" color="text.secondary">
                            Total Majority Votes: {elem.maxVote}
                        </Typography>
                    </CardContent>
                  </Card></div></ThemeProvider>
                </Grid>
              ))}
                </Grid>
            </Container>
            
        </div>

    );
}




export default VoteResults;