import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { System } from 'nostr/NostrSystem';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

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

  const renderContent = (elevation, index) => {
    if (!elevation.content) {
      return null;
    }
    //
    const title = elevation.content.slice(0, elevation.content.indexOf('\n'));
    const context = elevation.content.slice(elevation.content.indexOf('\n'));
    return (
      <Box
        sx={{
          backgroundColor: '#151515',
          borderRadius: '16px',
          px: '18px',
          py: '24px',
          // boxSizing: 'border-box',
          // bgcolor: 'background.default',
          // display: 'grid',
          // gridTemplateColumns: { md: '1fr' },
        }}
      >
        <Typography sx={{

        }}
          color={"white"}
          variant={"h6"}>
          {title}
        </Typography>
        <Typography sx={{
          mt: '6px',
          width: '100%',
          // fontFamily: 'Saira'
        }} color={"white"} variant={"body2"} align={'left'}>
          {context}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
    }}>
      <Grid container spacing={1}>
        {
          newsList.map((elevation, index) => (
            <Grid item xs={12} key={'news-index-' + index}>
              {renderContent(elevation)}
            </Grid>
          ))
        }
      </Grid>
    </Box>);

}
export default GFTNewsView;