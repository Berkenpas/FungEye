import React, {useState, useEffect} from 'react';
import mush from './mushroom.jpg';

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
                            <h5>{item.postedBy.name}</h5>
                        <div className = 'card-image'>
                            <img src = {item.image}/>
                        </div>
                        <div className = 'card-content'>
                            <i className="material-icons">equalizer</i>
                                <h6>
                                    {item.title}
                                </h6>
                            <p> {item.body}</p>
                            <input type='text' placeholder = 'add a comment'/>
                        </div>
                    </div>  
                    )
                })
            }
        </div>

    );
}



export default Home;