import { React, useState } from 'react'
import { Buffer } from 'buffer'

// romanesco broccoli
// sunflower
// aloe

const media = [
  {
    name: "Romanesco Broccoli (photo)",
    price: 200,
    source: "romanesco-broccoli.jpeg",
    invoice: "",
    paymentHash: "",
    buyButton: false,
    checkButton: true,
    fileDownloadUrl: ""
  },
  {
    name: "Sunflower (photo)",
    price: 200,
    source: "sunflower.jpeg",
    invoice: "",
    paymentHash: "",
    buyButton: false,
    checkButton: true,
    fileDownloadUrl: ""
  },
  {
    name: "Aloe (video)(photo)",
    price: 1000,
    source: "aloe.jpeg",
    invoice: "",
    paymentHash: "",
    buyButton: false,
    checkButton: true,
    fileDownloadUrl: ""
  }
]

const Media = () => {

  const [mediaList, setMedia] = useState(media);

  function generateInvoice(source, price) {
    fetch(`/generate-invoice/${source}/${price}`)
      .then(res => res.json())
      .then(data => {
        const updateMedia = mediaList.map((m) => {
          if (m.source === source) {
            const updatedMedia = {
              ...m,
              invoice: data.payment_request,
              paymentHash: Buffer.from(data.r_hash).toString('hex'),
              buyButton: true,
              checkButton: false
            };
            return updatedMedia;
          }
          return m;
        });
        console.log(updateMedia)
        setMedia(updateMedia);
        }
      )
  }

  function checkInvoice(paymentHash) {
      fetch(`/check-invoice/${paymentHash}`)
        .then(res => res.json())
        .then(data => {
          if (data.settled === true) {
            getContent(data.memo).then(
              (res) => {
                const updateMedia = mediaList.map((m) => {
                  if (m.source === data.memo) {
                    return {
                      ...m,
                      invoice: 'THANK YOU',
                      checkButton: true,
                      fileDownloadUrl: res
                    };
                  }
                  return m;
                });
                setMedia(updateMedia);
              }
            )
          }
          else {
            alert("Payment not yet received")
          }
        })
    }

  async function getContent(source) {
    return await fetch(`/file/${source}`)
      .then(res => res.blob())
      .then(blob => URL.createObjectURL(blob))
  }
  return (
    <div>
    { mediaList.map((m) => {
      return(
        <div key={m.source} style={{border:'3px solid gray', borderRadius: "5px", margin:'10px', padding: '10px', width:'350px', display:'inline-block', height: "550px", whiteSpace: "nowrap"}}>
          <div style={{margin:'auto', width:'80%'}}>
            <p>{m.name}</p>
            <p>Price: {m.price} sats</p>
            {/* <img src={"assets/" + m.source + "small.jpg"} height="220px" alt={m.name} /> */}
            <img src={"assets/" + m.source} height="220px" style={{margin:'auto', maxWidth:'100%'}} alt={m.name} />
            <br />
            <button disabled={m.buyButton} style={{padding: '10px', margin: '10px'}} type="button" onClick={ () => { generateInvoice(m.source, m.price) } }>Buy</button>
            <button disabled={m.checkButton} style={{padding: '10px', margin: '10px'}} type="button" onClick={ () => { checkInvoice(m.paymentHash) } }>Check Payment</button>
            <br></br>
            <textarea style={{ resize: "none" }}rows="9" cols="32" value={m.invoice} readOnly></textarea>
            <br></br>
            <a style={{visibility: (!m.checkButton || !m.buyButton) ? "hidden" : "visible" }} href={m.fileDownloadUrl} rel="noreferrer" target="_blank">View</a>
            <br></br>
            <a style={{visibility: (!m.checkButton || !m.buyButton) ? "hidden" : "visible" }} href={m.fileDownloadUrl} rel="noreferrer" target="_blank" download>Download</a>
          </div>
        </div>
      )})
    }
    </div>
  )
}

export default Media