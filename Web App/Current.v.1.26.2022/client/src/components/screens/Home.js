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
import {useNavigate} from 'react-router-dom';
import M from 'materialize-css';


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
    const [mushroomop, setOptions] = useState([])
    const [choice, setChoice] = useState("");
    const [submit, setSubmit] = useState("")


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

    
const navigate = useNavigate()

    useEffect(() => {
        
        if(choice && submit){
            fetch("/storevote",{
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    image: submit,
                    vote: choice
                })
            }).then(res=>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html: "Vote Sent", classes: "#4caf50 green"})
                    //clear the choice and submit states
                    
                    navigate('/');
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }, [choice, submit])

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
                                        image={item.image} name = "image" value = {item._id}
                                    />
                                    <CardContent>
                                        <IconButton aria-label="vote">
                                        <BallotOutlinedIcon />
                                        </IconButton>
                                            <Typography> Which mushroom do you identify in this image?</Typography>
                                            
                                         <div>  
                                        {
                                                mushroomop.map((option)=>(
                                                    <p>
                                                    <label>
                                                        <input className="with-gap" name="vote" type="radio" value = {option._id} onChange = {(e)=>setChoice(e.target.value)}/>
                                                        <span>{option.latin}</span>
                                                    </label>
                                                    </p>
                                                ))
                                            }
                                                    
                                                    <p></p>
                                            
                                        </div> 
                                            <label>
                                            <button className="btn waves-effect waves-light" type="submit" name = "submit" value = {item._id}  onClick = {(e)=>setSubmit(e.target.value)}>Submit
                                                <i className ="material-icons right">send</i>
                                            </button>
                                            </label>
                                            
                                                   
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