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
import M from 'materialize-css';
import {Link, useNavigate} from 'react-router-dom';

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
    content:{
      fontFamily: [
        'Comfortaa',
        'cursive'
      ].join(','),
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


const Profile = ()=>{
    
    const [mypics, setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [userscore, setScore] = useState("")
    const [algo_wallet, setWallet] = useState("")
    const navigate = useNavigate()

    const UpdateWallet = ()=>{
      fetch("/updatewallet",{
          method: "post",
          headers:
          {"Content-Type":"application/json", "Authorization": "Bearer " + localStorage.getItem("jwt")},
          body: JSON.stringify({
              algo_wallet
          })
      }).then(res=>res.json())
      .then(data =>{
          if(data.error){
              M.toast({html: data.error, classes:"#c62828 red darken-3"})
          }
          else{
              M.toast({html: data.message, classes: "#4caf50 green"})
          }
      }).catch(err=>{
          console.log(err)
      })
    
    }
  
    useEffect(()=>{
      fetch('/mywallet',{
          headers:{
              "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result=>{
          setWallet(result)
      })
  }, [])

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
        <div className = 'every-background'>
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

            <Typography
              color="textPrimary"
              gutterBottom
              variant="h6"
              align="center"
            >
            
            Any rewards earned will be sent to  the following address:<p></p>
            <input
                    style={{width: "600px"}}
                    type = 'algo_wallet'
                    placeholder = 'Update Wallet Address'
                    value = {algo_wallet}
                    onChange = {(e)=> setWallet(e.target.value)}//{(state)=> setWallet(state?state.algo_wallet: "loading")}
            />
            </Typography>

            <Typography
              color="textPrimary"
              gutterBottom
              variant="h4"
              align="center"
            >
            <button className="btn waves-effect waves-light #a1887f brown lighten-2" onClick = {()=> UpdateWallet()}>
                    Set Wallet Address
                </button>
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
              {mypics?.map(elem => (
                <Grid item xs={12} sm={4} >
                  
                  <Card className={classes.card}>
                    <CardMedia
                       className={classes.media}
                      image={elem.image}
                    />
                    <ThemeProvider theme = {theme2}>
                    <div>
                    {elem.voted  
                    ? <CardContent >
                        <Typography gutterBottom variant = "h5" component = "div">
                            {elem.mushID?.common}
                        </Typography>
                        <Typography gutterBottom variant = "h6" component = "div" >
                            {elem.mushID?.latin}
                        </Typography>
                        <Typography  varient = "body2" color="text.secondary" >
                            Information about the mushroom: <a href= {elem.mushID?.wiki}>Wikipedia</a>
                        </Typography>
                    </CardContent>
                    : <CardContent>
                    <Typography gutterBottom variant = "h5" component = "div" >
                        Voting in progress!
                    </Typography>
                    <Typography gutterBottom variant = "h6" component = "div" >
                        Come back in 24 hours. 
                    </Typography>
                </CardContent>}</div></ThemeProvider>
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