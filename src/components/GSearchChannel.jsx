import React, { useEffect, useState } from "react";
import "./GSearchChannel.scss";

import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { parseId } from "nostr/Util";

const filterOp = createFilterOptions();

const GSearchChannel = (props) => {
  const { callback } = props;

  const navigate = useNavigate();
  const [value, setValue] = React.useState(null);

  let top100Films = [
    { title: 'GFS' },
  ];

  const handleSearch = (v) => {
    console.log('handleSearch', v);
    if (!v) {
      return;
    }
    if (v.title.length === 64) {
      if (callback) {
        callback('msg-channel-id', v.title);
      }
    }
    // else if (v.title.startsWith("#")) {
    //   let tmp_tag = v.title.substring(1);
    //   navigate('/global/' + tmp_tag);
    // }
  };

  useEffect(() => {
    handleSearch(value);
  }, [value]);

  // loggedOut, publicKey 
  return (
    <Stack className={'search_channel_bg'} flexDirection="row" alignItems={'center'}>
      <Autocomplete className={'search_in'}
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue({ title: newValue, });
          } else if (newValue && newValue.inputValue) {
            setValue({ title: newValue.inputValue, });
          } else {
            setValue(newValue);
          }
          console.log('onChange', newValue);
        }}
        filterOptions={(options, params) => {
          const filtered = filterOp(options, params);
          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option.title);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              title: `CHANNEL: "${inputValue}"`,
            });
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        freeSolo
        // handleHomeEndKeys
        options={top100Films}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        renderInput={(params) => <TextField {...params} placeholder={'search'} />}
      />
    </Stack>
  );
};

export default React.memo(GSearchChannel);
