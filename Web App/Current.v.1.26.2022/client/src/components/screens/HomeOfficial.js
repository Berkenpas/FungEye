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
            <div className = 'card-content'>
                Hello
            </div>
        </div>
    )
}

export default HomeOfficial;