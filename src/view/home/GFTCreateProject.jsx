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
            boxShadow: `${alpha('#fff', 0.25)} 0 0 0 1px`,
            borderColor: `#333`,
            color: `#fff`
        },
    },
}));

function GFTCreateProject() {

    const [project, setProject] = useState({
        thumb: "",
        banner: []
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

    const uploadBanner = (event) => {
        if (event.target.files && event.target.files[0]) {
            let data = event.target.files[0];
            uploadFile(data, (event) => {
                console.log(event);
                console.log(Math.round(event.loaded / event.total * 100) + '% done');
            }).then(res => {
                console.log(res);
                let obj = { ...project }
                obj.banner.push({ url: ipfsUrl + res.hash });
                setProject(obj);
            })
        }
    }

    const delBanner = (index) => {
        console.log(index);
        let obj = { ...project };
        obj.banner.splice(index, 1);
        setProject(obj);
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
            <div className='title_layout'>
                <span className='thumbnail'>Thumbnail</span>
                <span className='info'>Upload instructions</span>
            </div>
            <div className='layout_img_upload'>
                {Array.from(project.banner).map((item, index) => (
                    <div key={"banner" + index} className='box_layout'>
                        <div className='img_close' onClick={() => delBanner(index)}></div>
                        <img className='img' src={item.url}></img>
                    </div>
                ))}
                <div className='box_up' >
                    <input className='upload_banner' onChange={(e) => uploadBanner(e)} id="fileContact1" accept="image/*" multiple type="file" />
                    <div className='img_up'></div>
                    <div className='txt'>
                        UPLOAD
                        <br />
                        PRODUCT
                        <br />
                        SCREENSHOT
                    </div>
                </div>
            </div>
            <div className='title_layout'>
                <span className='thumbnail'>Social</span>
                <span className='info'>Upload instructions</span>
            </div>
            <div className='social_layout'>
                <div className='item'>
                    <div className='img_youtube'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter Youtube links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_twitter'></div>
                    <RedditTextField
                        hiddenLabel
l                      placeholder="Enter Twitter links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_dicord'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter dicord links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_reddit'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter Reddit links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_facebook'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter Facebook links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_telegram'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter Telegram links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_github'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter Github links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_ins'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter instagram links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
                <div className='item'>
                    <div className='img_medium'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter Medium links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        style={{ marginTop: 0 ,marginLeft:13}}
                    />
                </div>
            </div>
        </div>
    );

}

export default GFTCreateProject;