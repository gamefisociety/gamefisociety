import React, { useEffect, useState } from "react";
import "./GSearch.scss";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { parseId } from "nostr/Util";

const filterOp = createFilterOptions();

const GSearch = () => {

  const navigate = useNavigate();
  const [value, setValue] = React.useState(null);

  let top100Films = [
    { title: '#BTC' },
    { title: '#18Ban' },
    { title: '#nostr' },
  ];

  const handleSearch = (v) => {
    console.log('handleSearch', v);
    if (!v) {
      return;
    }
    if (v.title.startsWith("npub") && v.title.length === 63) {
      let pub = parseId(v.title);
      navigate("/userhome/" + pub);
    } else if (v.title.length === 64) {
      // navigate("/notethread", {
      //   state: {
      //     note: { ...msg },
      //     info: null,
      //   },
      // });
    } else if (v.title.startsWith("#")) {
      let tmp_tag = v.title.substring(1);
      navigate('/global/' + tmp_tag);
      // setValue(null);
    }
  };

  useEffect(() => {
    handleSearch(value);
  }, [value]);

  // loggedOut, publicKey 
  return (
    <Stack className={'search_bg'} flexDirection="row" alignItems={'center'}>
      <Autocomplete className={'search'}
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
              title: `Add "${inputValue}"`,
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

export default React.memo(GSearch);
