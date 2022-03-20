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
      height: 200,
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
    const [mushroomop, setOptions] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/allPostComplete',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
    }, [])


    useEffect(()=>{
      fetch('/allmush',{
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result=>{
          setOptions(result)
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
                      image={elem.image}
                    />
                    <CardContent>
                        <Typography gutterBottom variant = "h5" component = "div">
                            {elem.mushID.common}
                        </Typography>
                        <Typography gutterBottom variant = "h7" component = "div">
                            {elem.mushID.latin}
                        </Typography>
                        <Typography  varient = "body2" color="text.secondary">
                            Information about the mushroom: <a href= {elem.mushID.wiki}>Wikipedia</a>
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