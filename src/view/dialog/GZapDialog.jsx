import React, { useEffect, useState,useMemo } from 'react';
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Helpers from 'view/utils/Helpers';
import { System } from "nostr/NostrSystem";
import QRCode from 'react-qr-code';

import { LNURL, LNURLError, LNURLErrorCode, LNURLInvoice, LNURLSuccessAction } from '../../module/utils/LNURL';
import './GZapDialog.scss';
import { useZapPro } from "nostr/protocal/ZapPro";

class ZapType {
    static PublicZap = 1;
    static AnonZap = 2;
    static  PrivateZap = 3;
    static  NonZap = 4;
  }

const GZapDialog = (props) => {
    
const zapPro = useZapPro();
const { note, recipient } = props;
const onClose = props.onClose || (() => undefined);
const defaultZapAmount = 1_000;
const amounts = [defaultZapAmount, 5_000, 10_000, 20_000, 50_000, 100_000, 1_000_000];
const [amount, setAmount] = useState(defaultZapAmount);
const [lnurl, setLnurl] = useState("");
const [canZap, setCanZap] = useState(false);
const [customAmount, setCustomAmount] = useState();
const [comment, setComment] = useState();
const [handler, setHandler] = useState();
const [invoice, setInvoice] = useState(props.invoice);
const [zapType, setZapType] = useState(ZapType.PublicZap);
const canComment = handler
? (canZap && zapType !== ZapType.NonZap) || handler.maxCommentLength > 0
: false;


 
const emojis= {
    1_000: '👍',
    5_000: '💜',
    10_000: '😍',
    20_000: '🤩',
    50_000: '🔥',
    100_000: '🚀',
    1_000_000: '🤯',
  };


  function chunks(arr, length) {
    const result = [];
    let idx = 0;
    let n = arr.length / length;
    while (n > 0) {
      result.push(arr.slice(idx, idx + length));
      idx += length;
      n -= 1;
    }
    return result;
  }

  useEffect(() => {
   let  meta = JSON.parse(props.meta);
   let url = meta.lud16 || meta.lud06;
   setLnurl(url);
   try {
    const h = new LNURL(url);
    setHandler(h);
    h.load()
      .then(() => {
        setCanZap(h.canZap);
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
  }, []);

  const selectAmount = (a) => {
    setAmount(a);
  };

  

function renderAmounts(amount, amounts) {
    return (
      <div className="amounts">
        {amounts.map((a) => (
          <div
            className={amount === a ? 'sat_amount active' : 'sat_amount'}
            key={a}
            onClick={() => selectAmount(a)}
          >
            {emojis[a] && <>{emojis[a]}&nbsp;</>}
            {Helpers.formatAmount(a, 0)}
          </div>
        ))}
      </div>
    );
  }

  const amountRows = useMemo(() => chunks(amounts, 3), [amounts]);

  function invoiceForm() {

    return (
      <>
        <h3>Zap amount in sats</h3>
        {amountRows.map((amounts) => renderAmounts(amount, amounts))}
    
      </>
    );
  }
  const  loadInvoice = async ()=>{
    console.log(props.note);
      const chatEv = await zapPro.sendZap(comment, {id:props.note.id,pubKey:props.note.pubkey,relays:System.getWRelays()});
    console.log(chatEv,"chat");
    try {
        const rsp = await handler.getInvoice(amount, comment, chatEv);
        console.log(rsp,"bbbbbbbb");
        if (rsp.pr) {
          setInvoice(rsp.pr);
        //   await payWithWallet(rsp);
        }
      } catch (e) {
        console.log(e);
      }
    }

  function custom() {
    if (!handler) return null;
    const min = handler.min / 1000;
    const max = handler.max / 1000;

    return (
      <div className="custom-amount">
        <input
          className='input_custom'
          type="number"
          min={min}
          max={max}
          placeholder={'Custom'}
          value={customAmount}
          onChange={(e) => setCustomAmount(parseInt(e.target.value))}
        />
        <button
          className="bt_custom"
          type="button"
          disabled={!customAmount}
          onClick={() => selectAmount(customAmount ?? 0)}
        >
          Confirm
        </button>
    
      </div>
    );
  }

    
    const renderContent=()=>{
        return<Box className="box_bg">
              <Typography className="purl">
              {lnurl }
            </Typography>
            <Typography className="title">
            Send sats to @{JSON.parse(props.meta).name }
            </Typography>
            {invoiceForm()}
            {custom()}
       
          {canComment && (
            <input
             className='input_comment'
              type="text"
              placeholder={'Comment'}
              maxLength={canZap && zapType !== ZapType.NonZap ? 250 : handler.maxCommentLength}
              onChange={(e) => setComment(e.target.value)}
            />
          )}
        {(amount ?? 0) > 0 && (
          <div>
            <div className='btn_send' width="100%" onClick={() => loadInvoice()}>
              Send {Helpers.formatAmount(amount, 0)} sats
            </div>
          </div>
        )}
        </Box>;
    }
    const renderwallet=()=>{
        return <div className="invoice">
            <Typography className="purl">
              {lnurl }
            </Typography>
            <Typography className="title">
            Send zap to  @{JSON.parse(props.meta).name }
            </Typography>
          {invoice && (
            <>
            <div style={{ height: "auto", margin: "0 auto", width: "90%" }}>
                <QRCode
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`lightning:${invoice}`}
                viewBox={`0 0 256 256`}
                />
            </div>
             
            <div className='copy_send'  onClick={() => {
                Helpers.copyToClipboard(invoice+"")
            }}>
            Copy invoice
            </div>
            <a className="link_open" href={`lightning:${invoice}`}>
                Open wallet
            </a>
             
            </>
          )}
        </div>
    }

 
    
    return (
        <Dialog
            className={'dialog_zap_bg'}
            onClose={onClose}
            open={props.show}
            fullWidth={true}
            PaperProps={{
                style: {
                    width: '400px',
                    height: 'auto',
                    backgroundColor: 'rgba(15, 15, 15, 1)',
                    boxShadow: 'none',
                },
            }}
        >

            {invoice!=null? renderwallet():renderContent()}
        </Dialog>
    );
}

export default React.memo(GZapDialog);