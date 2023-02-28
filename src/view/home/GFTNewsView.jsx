import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { System } from 'nostr/NostrSystem';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
  }));

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const GFTNewsView = () => {

    const [newsList, setNewsList] = useState([]);
    const TextNotePro = useTextNotePro();
   

    const navigate = useNavigate();
    useEffect(() => {
        requsetData();
        // fetchAllNFTs();
        return () => {
        }
    }, [])

    const requsetData = () => {
    
        fetchNewsNote("1bfacfa9f38d387d0950c92bda863385a05284d04342f93ae45df93efcbcd7d8");
    }

    const fetchNewsNote = (pub) => {
        //
        const curRelays = [];
        curRelays.push('wss://nos.lol');
        const textNote = TextNotePro.get();
        textNote.Authors = [pub];

        System.Broadcast(textNote, 1, (msgs) => {
            console.log('user sub', msgs);
            if (msgs && msgs.length > 0) {
                setNewsList(msgs.concat());
            }
        }, curRelays);
    }

    return(
        <Grid container spacing={1}>
        {
          <Grid  sx={{
            boxSizing: 'border-box',    
            }} item xs={10}>
            <ThemeProvider theme={darkTheme}>
              <Box
                sx={{
                  boxSizing: 'border-box',    
                  p: 1,
                  bgcolor: 'background.default',
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr' },
                  gap: 1,
                }}
              >
                {newsList.map((elevation,index) => (
                  <Item sx={{
                    padding:'10px',
                    width: '100%',
                    height: 'auto',
                    fontSize: '12px',
                    fontFamily: 'Saira',
                    lineHeight:'14px',
                    textAlign:'left',
                  }} key={index} >
                    {elevation.content}
                  </Item>
                ))}
              </Box>
            </ThemeProvider>
          </Grid>
        }
      </Grid>);

}
export default GFTNewsView;