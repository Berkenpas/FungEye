import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import M from 'materialize-css';


const CreatePost = ()=>{
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const navigate = useNavigate()
    
    useEffect(() => {
        if(url){
            fetch("/createpost",{
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    pic: url
                })
            }).then(res=>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html: "Image Uploaded", classes: "#4caf50 green"})
                    navigate('/');
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }, [url])

    const postDetails = () =>{
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "fungeyecapstone")
        fetch("https://api.cloudinary.com/v1_1/fungeyecapstone/image/upload", {
            method: "post",
            body: data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })

    }

    return(
        <div className = 'card input-filed'
        style = {{
            margin: '10px auto',
            maxWidth: '500px',
            padding: '20px',
            textAlign: 'center'
        }}>
            
            <div className="file-field input-field">
                <h2 className = 'other-titles'>Upload An Image</h2>
                <body>
                    RULES OF SUBMISSION

                    <p></p>

                    Please upload an image that contains only one species of mushroom. If it contains more than one, 
                    the image will not be added to our database. Thank you!

                    <p></p>
                </body>
                <div className="btn waves-effect waves-light #a1887f brown lighten-2">
                    
                    <span>Upload</span>
                    <input type = "file" onChange = {(e)=>setImage(e.target.files[0])}/>
                    
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                
            </div>
            <button className="btn waves-effect waves-light #a1887f brown lighten-2" onClick ={()=>postDetails()}>
                    Submit
                </button>
        </div>
    )
}


export default CreatePost;

