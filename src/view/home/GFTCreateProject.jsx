import { React, useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import fleekStorage from '@fleekhq/fleek-storage-js'
import { alpha, styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import './GFTCreateProject.scss';
import GSTProjectBase from '../../web3/GSTProject';

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
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const [project, setProject] = useState({
        thumb: "",
        title: "",
        description: '',
        chainAddress: '',
        banner: [],
        youtube: '',
        twitter: '',
        discord: '',
        facebook: '',
        reddit: '',
        telegram: '',
        github: '',
        instagram: '',
        medium: '',
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

    function stringToBuffer(str) {
        return new Promise((resolve) => {
            var blob = new Blob([str], { type: "text/plain" });
            var reader = new FileReader();
            reader.onload = function (event) {
                const result = event.target.result;
                // console.log("result",result);
                resolve(result);
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    const createNFT = (uri) => {
   
        if (account) {
            GSTProjectBase.creatMintNFT(library, account,uri,project.title).then(res => {
                console.log(res,'res');
              
            }).catch(err => {
                console.log(err,'err');
            })
        } else {
            return 0;
        }
    }

    const uploadBuffer = (data) => {
        stringToBuffer(JSON.stringify(data)).then(buffer => {
            buffer.name=project.title+"NFT_PROJECT"
            uploadFile(buffer, (event) => {
                console.log(event);
                console.log(Math.round(event.loaded / event.total * 100) + '% done');
            }).then(res => {
                console.log(res);
                createNFT( ipfsUrl + res.hash);
            })
        });
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

    const onValueScial = (e, name) => {
        setProject({ ...project, [name]: e.target.value });
    }
    const clickCreate = () => {
        uploadBuffer(project);
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
                onChange={(e) => onValueScial(e, 'title')}
                style={{ marginTop: 11 }}
            />
            <RedditTextField
                label="Description"
                defaultValue=""
                id="reddit-input"
                variant="filled"
                multiline
                rows={4}
                onChange={(e) => onValueScial(e, 'description')}
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
                onChange={(e) => onValueScial(e, 'chainAddress')}
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
                        onChange={(e) => onValueScial(e, 'youtube')}
                        style={{ marginTop: 0, marginLeft: 13 }}
                    />
                </div>
                <div className='item'>
                    <div className='img_twitter'></div>
                    <RedditTextField
                        hiddenLabel
                        l placeholder="Enter Twitter links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        onChange={(e) => onValueScial(e, 'twitter')}
                        style={{ marginTop: 0, marginLeft: 13 }}
                    />
                </div>
                <div className='item'>
                    <div className='img_discord'></div>
                    <RedditTextField
                        hiddenLabel
                        placeholder="Enter discord links"
                        id="linked-input"
                        variant="filled"
                        rows={1}
                        onChange={(e) => onValueScial(e, 'discord')}
                        style={{ marginTop: 0, marginLeft: 13 }}
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
                        onChange={(e) => onValueScial(e, 'reddit')}
                        style={{ marginTop: 0, marginLeft: 13 }}
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
                        onChange={(e) => onValueScial(e, 'facebook')}
                        style={{ marginTop: 0, marginLeft: 13 }}
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
                        onChange={(e) => onValueScial(e, 'telegram')}
                        style={{ marginTop: 0, marginLeft: 13 }}
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
                        onChange={(e) => onValueScial(e, 'github')}
                        style={{ marginTop: 0, marginLeft: 13 }}
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
                        style={{ marginTop: 0, marginLeft: 13 }}
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
                        onChange={(e) => onValueScial(e, 'medium')}
                        style={{ marginTop: 0, marginLeft: 13 }}
                    />
                </div>
            </div>
            <div className='create_btn' onClick={() => clickCreate()}>
                CREATE
            </div>
        </div>
    );

}

export default GFTCreateProject;