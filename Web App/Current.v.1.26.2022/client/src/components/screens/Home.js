import React, {useState, useEffect} from 'react';
import "../../App.css";
import { IconButton, Typography} from '@mui/material';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';
import { Card } from '@mui/material';
import { CardMedia } from '@mui/material';
import { CardContent } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles'
import '../../App.css'


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

  const theme1 = createTheme({
    typography: {
      fontFamily: [
        'Quicksand',
        'sans-serif'
      ].join(','),
    }
  });

const Home = ()=>{
    const [data, setData] = useState([])

    useEffect(()=>{
        fetch('/allpost',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
    }, [])

    const classes = useStyles();
    return(

        <div > 
            <Container>
            <ThemeProvider theme={theme1}>
            <div style = {{borderBottom: "1px solid grey" }}>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h4"
              align="center"
            >
                <p></p>
              Unidentified Mushrooms
            </Typography>
            <Typography gutterBottom variant = "h5" component = "div" align = "center">
                Help us identify some mushrooms from our database!
            </Typography>
            </div>
            </ThemeProvider>
                <p></p>
                <Grid container spacing = {3}>
                    {
                        data.map(item =>(
                            
                             <Grid item xs={12} sm ={4}>
                                 <Card className={classes.card}>
                                    <CardMedia
                                    className={classes.media}
                                        image={item.image}
                                    />
                                    <CardContent>
                                        <IconButton aria-label="vote">
                                        <BallotOutlinedIcon />
                                    </IconButton>
                                    <Typography> Which mushroom do you identify in this image?</Typography>
                                    <form action="#">
                                        <p>
                                        <label>
                                            <input className="with-gap" name="group1" type="radio" />
                                            <span>Mushroom 1</span>
                                        </label>
                                        </p>
                                        <p>
                                        <label>
                                            <input className ="with-gap" name="group1" type="radio" />
                                            <span>Mushroom 2</span>
                                        </label>
                                        </p>
                                        <p>
                                        <label>
                                            <input className ="with-gap" name="group1" type="radio"  />
                                            <span>Mushroom 3</span>
                                        </label>
                                        </p>
                                        <p>
                                        <label>
                                            <input className ="with-gap" name="group1" type="radio" />
                                            <span>Mushroom 4</span>
                                        </label>
                                        </p>
                                        <p>
                                        <label>
                                        <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                                            <i className ="material-icons right">send</i>
                                        </button>
                                        </label>
                                        </p>
                                    </form>
                                    </CardContent>
                                    
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
            
        </div>

    );
}



export default Home;