import React, { useState } from "react";
import BeatPack from "../interfaces/beats";
import {
    useMoralis,

} from "react-moralis";
import { DbUser } from "../interfaces/users";
import { FirstCheckout } from "./checkout-steps/First";
import { Minted } from "./checkout-steps/Minted";
import { MintingInfo } from "./checkout-steps/MintingInfo";

//checkout modal
export function CheckoutModal(props: {
    bp: BeatPack;
    producer: DbUser;
    matic: any;
    Moralis: any;
    transfer: any;
    closeModal: Function;
}) {
    const [transferDone, setTransferStatus] = useState(false);
    const { user } = useMoralis();
    const [minted, setMinted] = useState(false);
 
  
    if (minted) {
        return (
            <Minted bp={props.bp} />
        )
    }

    if (transferDone && user !== null) {
        return (
           <MintingInfo bp={props.bp} producer={props.producer} setMinted={setMinted} />
        );
    }

    return (<FirstCheckout bp={props.bp} matic={props.matic} producer={props.producer} setTransferStatus={setTransferStatus} />)
}
