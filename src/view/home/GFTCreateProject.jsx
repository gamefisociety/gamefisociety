import { React, useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import fleekStorage from '@fleekhq/fleek-storage-js'
import { alpha, styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import './GFTCreateProject.scss';

const ipfsUrl = "https://ipfs.io/ipfs/";

const RedditTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
    '& label': {
        fontFamily: ['Saira'],
        fontWeight: 500,
        fontSize: 18,
        color: '#666666',
        '&.Mui-focused': {
            color: '#666666',
        },
    },
    '& .MuiFilledInput-root': {
        border: '1px solid #333333',
        overflow: 'hidden',
        borderRadius: 4,
        fontFamily: ['Saira'],
        fontWeight: 500,
        color: '#333',
        fontSize: 20,
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused': {
            backgroundColor: 'transparent',
            boxShadow: `${alpha('#fff', 0.25)} 0 0 0 2px`,
            borderColor: `#333`,
            color: `#fff`
        },
    },
}));

function GFTCreateProject() {

    const [project, setProject] = useState({
        thumb: ""
    });

    useEffect(() => {

        return () => {

        }

    }, [])

    const uploadThumb = (event) => {
        if (event.target.files && event.target.files[0]) {
            let data = event.target.files[0];
            uploadFile(data, (event) => {
                console.log(event);
                console.log(Math.round(event.loaded / event.total * 100) + '% done');
            }).then(res => {
                console.log(res);
                setProject({ ...project, thumb: ipfsUrl + res.hash })
            })

        }
    }

    const uploadFile = (file, callback) => {

        return fleekStorage.upload({
            apiKey: 'ezr3dn1gduKDeR0Rgjx6eQ==',
            apiSecret: 'g7m+KcmVcJ6Qo/qQtdOG7RYKoZYQexoPZITE5BebwnE=',
            key: 'gamefiSociety/' + file.name,
            ContentType: file.type,
            data: file,
            httpUploadProgressCallback: callback
        });

    }


    return (
        <div className='nft_create_project_bg'>
            <div className='title_layout'>
                <span className='thumbnail'>Thumbnail</span>
                <span className='info'>(200 pix*200pix, 1MB)</span>
            </div>
            <div className='upload_tumb'>
                {
                    project.thumb ?
                        <img className='img_bg' src={project.thumb}></img>
                        :
                        <div className='upload_layout'>
                            <div className='img'></div>
                            <div className='txt'>UPLOAD ICON</div>
                        </div>
                }
                <input className='upload' onChange={(e) => uploadThumb(e)} id="fileContact1" accept="image/*" multiple type="file" />
            </div>
            <span className='title_head'> Details</span>

            <RedditTextField
                label="Title (required) "
                defaultValue=""
                id="reddit-input"
                variant="filled"
                multiline
                rows={2}
                style={{ marginTop: 11 }}
            />
            <RedditTextField
                label="Description"
                defaultValue=""
                id="reddit-input"
                variant="filled"
                multiline
                rows={4}
                style={{ marginTop: 20 }}
            />
            <span className='title_head'> Chain address</span>

            <RedditTextField
                label="Enter the chain address"
                defaultValue=""
                id="reddit-input"
                variant="filled"
                multiline
                rows={2}
                style={{ marginTop: 11 }}
            />



        </div >
    );

}

export default GFTCreateProject;