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
import mushbike from "./bikemush1.gif";




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
    const [time, setTime] = useState("");
    const [time2, setTime2] = useState("");
    const [voted, setVoted] = useState(localStorage.getItem('after-vote'));
    const [submit, setSubmit] = useState("");

    useEffect(()=>{
        localStorage.setItem('after-vote', voted)
    }, [voted]);


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

    useEffect(()=>{
        fetch('/time',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            var checkTime = Date.now();
            setTime(Date.now())
            for(let j = 0; j < result.length; j++){
                //get current image date
                //getTime
                //compare one minute ago with current
                var currImTime = result[j].milliseconds;
                var postedDate = currImTime + 28800800 + 60000; //plus 8 hours + five minutes
                setTime2(postedDate)
                if(checkTime > postedDate){
                    fetch('/updateafter',{
                        method: "post",
                            headers: {
                                "Content-Type":"application/json",
                                "Authorization": "Bearer " + localStorage.getItem("jwt")
                            },
                            body: JSON.stringify({
                                image: result[j]._id
                            })
                    }).then(res=>{
                        res.json();
                    navigate('/vote')})
                    .catch(err=>{
                        console.log(err)
                    })
                }
                
            }
            
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
                    
                    setVoted(prevState =>
                        [...prevState, submit]
                    )
                    navigate('/vote');
                }
            })

        }

        
    }, [choice, submit])


    const classes = useStyles();


    const theme2 = createTheme({
        typography: {
          fontFamily: [
            'Comfortaa',
            'cursive'
          ].join(','),
        }
    });


    
    return(
        <div>
            <Container>
            <ThemeProvider theme={theme1}>
            <div style = {{borderBottom: "1px solid grey" }}>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h4"
              align="center"
            ><p></p>
              Unidentified Mushrooms 
            </Typography>
            <Typography gutterBottom variant = "h5" component = "div" align = "center">
                Help us identify some mushrooms from our database!
            </Typography>
            </div>
            </ThemeProvider>
                <p></p>
               {!data.length==0 ?
                <Grid container spacing = {3}>
                    {
                        data.map(item =>(
                            <Grid item xs={12} sm ={4}>
                                <ThemeProvider theme = {theme2}>
                                <div>
                                <Card className={classes.card}>
                                    <CardMedia
                                    className={classes.media}
                                        image={item.image} name = "image" value = {item._id}
                                    />
                                    {!voted.includes(item._id)
                                    
                                    ?<CardContent>
                                        <IconButton aria-label="vote">
                                        <BallotOutlinedIcon />
                                        </IconButton>
                                            <Typography> Which mushroom do you identify in this image?</Typography>
                                            
                                         <div className="scroll-container">  
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
                                        <p></p>
                                            <label>
                                            <button className="btn waves-effect waves-light" type="submit" name = "submit" value = {item._id}  onClick = {(e)=>setSubmit(e.target.value)}>Submit
                                                <i className ="material-icons right">send</i>
                                            </button>
                                            </label>
                                    </CardContent> :
                                    <CardContent>
                                        <Typography gutterBottom variant = "h5" component = "div">
                                            Thank you for voting!
                                        </Typography>
                                        <Typography gutterBottom variant = "h6" component = "div">
                                            Results will be posted on the Vote Results page.
                                        </Typography>
                                    </CardContent>}
                                </Card></div></ThemeProvider>
                            </Grid>
                        ))
                    }
                </Grid>:
                <ThemeProvider theme = {theme2}>
                    <div className='center'>
                        <img src= {mushbike} width="290"/>
                    </div>
                <div>
                <Card className="message">
                        <CardContent>
                            <Typography gutterBottom variant = "h5" component = "div">
                                There currently aren't any unidentified images.
                            </Typography>
                            <Typography gutterBottom variant = "h6" component = "div">
                                <button className="btn waves-effect waves-light #a1887f brown lighten-2" onClick={()=>{navigate('/voteresults')}}>
                                    View results!
                                </button>
                                {" "}or{" "}
                                <button className="btn waves-effect waves-light #a1887f brown lighten-2" onClick={()=>{navigate('/uploadimage')}}>
                                    Upload a photo!
                                </button>
                            </Typography>
                        </CardContent>
                    </Card></div></ThemeProvider>
            }
            </Container>
        </div>
    );
}



export default Home;