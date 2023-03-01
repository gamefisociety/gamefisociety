import { React, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import './GGamePage.scss';

const GGamePage = () => {

    useEffect(() => {
        return () => {

        }
    }, [])

    return (
        <div className='nft_detail_bg'>
            <div className='layout'>
                <div className='tab_layout'>
                    <Link className="txt" to="/">Home</Link>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> Society</span>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> {'Test'} </span>
                </div>
            </div>
        </div >
    );

}

export default GGamePage;