import React, {useState, useEffect} from 'react';
import "../../App.css";
import VoteForm from "../voteForm";
import { IconButton} from '@mui/material';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';

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

    return(
        <div className = 'home'> 
            {
                data.map((item) =>{
                    
                    return(
                        <div className = 'card home-card' key = {item._id}>
                            
                        <div className = 'card-image'>
                            <img src = {item.image}/>
                        </div>
                        <div className = 'card-content'>
                            <IconButton aria-label="vote">
                                <BallotOutlinedIcon />
                            </IconButton>

                            <VoteForm/>
                            </div>
                    </div>  
                    )
                })
            }
        </div>

    );
}



export default Home;
