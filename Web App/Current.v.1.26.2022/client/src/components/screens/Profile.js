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


const Profile = ()=>{
    
    const [mypics, setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [userscore, setScore] = useState("")
  

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result)
        })
    }, [])

    useEffect(()=>{
      fetch('/userscore',{
          headers:{
              "Authorization": "Bearer " + localStorage.getItem("jwt")

          }
      }).then(res=>res.json())
      .then(result=>{
          setScore(result)
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
              Welcome, {state?state.name: "loading"}! 
            </Typography>
            <Typography gutterBottom variant = "h5" component = "div" align = "center">
                {mypics.length} Uploads
            </Typography>
            <Typography gutterBottom variant = "h5" component = "div" align = "center">
                Score: {userscore}
            </Typography>
            </div>
            </ThemeProvider>
            <p></p>
            <Grid container spacing={3}>
              {mypics.map(elem => (
                <Grid item xs={12} sm={4} >
                  <Card className={classes.card}>
                    <CardMedia
                       className={classes.media}
                      image={elem.image}
                    />
                    {elem.voted  
                    ? <CardContent>
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
                    : <CardContent>
                    <Typography gutterBottom variant = "h5" component = "div">
                        Currently being voted.
                    </Typography>
                </CardContent>}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          <p></p>
        </div>
      );


    
}



export default Profile;