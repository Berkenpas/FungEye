import React from 'react';
import "../../App.css";
import {Typography} from '@mui/material';
import { Container } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import { createTheme } from '@mui/material/styles';





const HomeOfficial = ()=>{

    const theme1 = createTheme({
        typography: {
            fontFamily:[
                'Quicksand',
                'sans-serif'
            ].join(',')
        }
    });

    return(
        <div className='homepage-bimage'>
            
                <div className = 'home-position'>Effortless mushroom hunting begins here. </div>
                <br></br>
                <div className = 'home2-position'>
                    FungEye provides mushroom identification, image polling, NFT rewards, and community building. Join us today
                    to add some fun to your foraging endeavours! 
                </div>
        </div>
    )
}

export default HomeOfficial;