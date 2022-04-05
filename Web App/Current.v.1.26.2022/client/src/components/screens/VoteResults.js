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
        <div>
          <Container>
            <ThemeProvider theme={theme}>
            <div style = {{borderBottom: "1px solid grey" }}>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h4"
              align="center"
            >
                <p></p>
              Recent results from image classification voting:
            </Typography>
            </div>
            </ThemeProvider>
                <p></p>
               
                <Grid container spacing = {3}>
                {data.map(elem => (
                <Grid item xs={12} sm={4} >
                  <Card className={classes.card}>
                    <CardMedia
                       className={classes.media}
                      image={elem.picID.image}
                    />
                    <CardContent>
                        <Typography gutterBottom variant = "h6" component = "div">
                            Final Result: {elem.voteResult.latin}
                        </Typography>
                        <Typography gutterBottom variant = "h7" component = "div">
                            {elem.voteResult.common}
                        </Typography>
                        <Typography  varient = "body2" color="text.secondary">
                            Prediction: {elem.prediction.mush_type.latin}
                        </Typography>
                        <Typography  varient = "body2" color="text.secondary">
                            Total Votes: {elem.maxVote}
                        </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
                </Grid>
            </Container>
            
        </div>

    );
}




export default VoteResults;