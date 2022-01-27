import React, {useState} from 'react';
import { FormGroup, FormControl, FormLabel, Checkbox, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';


const VoteForm = ()=>{

    return(
        
        <FormControl component="fieldset">
        <RadioGroup
          aria-label="gender"
          defaultValue="female"
          name="radio-buttons-group"
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>

        
    );
    
}

export default VoteForm; 

