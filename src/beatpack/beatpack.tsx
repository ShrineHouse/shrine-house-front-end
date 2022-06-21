import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import JsFileDownloader from "js-file-downloader";
import BeatPack, { emptyBp } from "../interfaces/beats";
import BeatPackInfo from "../components/beatpack/BeatpackInfo";
import ProducerInfo from "../components/beatpack/ProducerInfo";
import {
  MoralisObjectSaveData,
  useMoralis,
  useMoralisCloudFunction,
  useNewMoralisObject,
  useTokenPrice,
  useWeb3Transfer,
} from "react-moralis";
import { dataToBeatpackPage, dataToUser } from "../helpers/database";
import { DbUser, emptyUser } from "../interfaces/users";
import SimilarEntities from "../components/beatpack/SimilarEntities";
import { Link, useParams } from "react-router-dom";
import web3, { getWallets } from "../helpers/web3";
import factory from "../Eth/factory";
import Modal from "react-modal";
import LoadingWidget from "../components/general/loadingwidget";

///Beatpack page
const BeatPackPage = () => {
  const { Moralis } = useMoralis();
  const [modalIsOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const [bp, setBp] = useState(emptyBp);
  const getBp = useMoralisCloudFunction("getBeatpack", { id: id });
  const [activeTab, setActiveTab] = useState("beat");
  const { fetch } = useMoralisCloudFunction("getUser", {
    wallet: bp.ownerWallet,
  });
  const [producer, setProducer] = useState(emptyUser);
  const [similarLoaded, setSimilarLoaded] = useState(false);
  const matic = useTokenPrice({
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    chain: "eth",
  });

  useEffect(() => {
    if (bp.artistName === "") {
      getBp.fetch({
        onSuccess(res) {
          const result = res as any;
          const _bp = dataToBeatpackPage(result as any);
          setBp(_bp);
        },
      });
      return;
    }
    fetch({
      onSuccess(results) {
        setProducer(dataToUser(results as any));
      },
    });
  }, [bp]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  //Styles for the popup modal
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
    },
  };

  ///Create the transfer of funds for the NFT / beatpack
  const transfer = useWeb3Transfer({
    amount: Moralis.Units.ETH(
      matic.data === null ? 0 : bp.beatPackPrice / matic.data.usdPrice
    ),
    receiver: bp.ownerWallet,
    type: "native",
  });

  ///If the page is not loaded, show progressindicator
  if (producer.fullName === "No name") {
    return <LoadingWidget />;
  }

  return (
    <div
      className={!similarLoaded ? " invisible" : "visible container mx-auto"}
    >
      <>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          shouldCloseOnOverlayClick={false}
        >
          <CheckoutModal
            Moralis={Moralis}
            bp={bp}
            matic={matic}
            producer={producer}
            transfer={transfer}
            closeModal={closeModal}
          />
        </Modal>
      </>
      <Box padding={10} className="m-5">
        <div className="flex flex-col">
          <Link to={"/"}>
            <div className="flex flex-row gap-2 items-center mb-5 cursor-pointer">
              <ChevronLeftIcon height={50} width={50} />
              <div className="text-xl font-bold">Back</div>
            </div>
          </Link>
          <div className="flex flex-row gap-20">
            <SimilarEntities bp={bp} setLoaded={setSimilarLoaded} />
            <VStack w="100%" gap={10}>
              <div className="flex flex-row gap-5 justify-start w-full">
                <div>
                  <img
                    src={bp.imageUrl}
                    className=" object-cover h-60 w-60 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-4xl font-bold">{bp.beatPackName}</div>
                  <div className="text-4xl font-bold primaryColor">
                    {producer.fullName}
                  </div>
                  <div className="text-xl text-gray-400">{bp.genre}</div>
                </div>
              </div>
              <div className="flex flex-row w-full gap-10">
                <div
                  className={
                    activeTab === "beat"
                      ? "transition-all underline text-3xl font-bold"
                      : "transition-all text-3xl font-bold text-gray-500"
                  }
                  onClick={() => setActiveTab("beat")}
                >
                  Beatpack
                </div>
                <div
                  className={
                    activeTab !== "beat"
                      ? "transition-all underline text-3xl font-bold"
                      : "transition-all text-3xl font-bold text-gray-500"
                  }
                  onClick={() => setActiveTab("producer")}
                >
                  Producer info
                </div>
              </div>
              <div className="w-full">
                {activeTab === "beat" && (
                  <BeatPackInfo bp={bp} onDownload={openModal} />
                )}
              </div>
              {activeTab === "producer" && <ProducerInfo producer={producer} />}
            </VStack>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default BeatPackPage;

//checkout modal
function CheckoutModal(props: {
  bp: BeatPack;
  producer: DbUser;
  matic: any;
  Moralis: any;
  transfer: any;
  closeModal: Function;
}) {
  const [transferDone, setTransferStatus] = useState(false);
  const { user } = useMoralis();
  const [nameValue, setNameValue] = useState(`${props.producer.fullName} X ${(user as any).attributes.fullName}`)
  const { save } = useNewMoralisObject('muses');

  function onDownload() {
    new JsFileDownloader({
      url: props.bp.beatPackUrl,
      filename: `${props.bp.beatPackName}.zip`
    });
  }

  const myAsync = async (
    name: string,
    symbol: string,
    URI: string,
    producerRoyalty: number,
    artistRoyalty: number,
    artist: string,
    cost: string,
    maxSupply: string
  ): Promise<any> => {
    if (user !== null) {
      console.log(user.attributes.wallet);
      let response = await factory.methods
        .createBeatpack(
          name,
          symbol,
          URI,
          producerRoyalty,
          artistRoyalty,
          artist,
          cost,
          maxSupply
        )
        .send({
          from: user.attributes.wallet,
        });
      return response;
    }
  };

  async function mintNft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    ////Mint the NFT here
    if (user !== null) {
      const artistWallet = user.attributes.wallet;
      const producerWallet = props.producer.wallet;
      const producerRoyalties = props.bp.royaltyIndex;
      const artistRoyalties = (event.target as any)[0].value;
      const nftName = (event.target as any)[1].value;
      const nftPrice = (event.target as any)[2].value;
      const nftEditions = (event.target as any)[3].value;
      const ticker = "Shrine";
      const URI = `ipfs://QmQdPYTY8yArgVmMJK319e75rsi91bwtUF5JsSF9CLnEYe/`;


      await myAsync(
        nftName,
        ticker,
        URI,
        producerRoyalties,
        artistRoyalties,
        artistWallet,
        nftPrice,
        nftEditions
      ).then(() => {

        let uploadData: MoralisObjectSaveData = {
          minter: user.attributes.fullName,
          producer: props.producer.fullName,
          minterWallet: artistWallet,
          producerWallet: producerWallet,
          ////NFTADDRESS SHOULD BE HERE
          nftAddress: "0x000",
          image: props.bp.imageUrl,
          nftName: nftName,
          minterImage: user.attributes.image,
          claimed: 0,
          nftData: {
            nftName: nftName,
            ticker: ticker,
            URI: URI,
            producerRoyalties: producerRoyalties,
            artistRoyalties: artistRoyalties,
            artistWallet: artistWallet,
            nftPrice: nftPrice,
            nftEditions: nftEditions
          }
        }

        ///This saves it to the DB
        save(uploadData, {
          onError(error) {
            alert('Your beatpack could not be uploaded')
          },

          onComplete: () => {
            console.log('ready')
            props.closeModal();
          }

        })
      })
    }
  }

  if (transferDone && user !== null) {
    return (
      <div className=" modalWidth modalHeight my-5">
        <div
          className="top-0 right-0 text-xl absolute z-50 text-gray-600 pt-5 pr-5 cursor-pointer"
          onClick={() => props.closeModal()}
        >
          close
        </div>
        <form
          onSubmit={(event) => {
            mintNft(event);
          }}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl text-center font-bold">Mint your NFT</h2>
            <div className="divider  mb-10"></div>
            <div className="mx-auto">
              <img
                src={props.bp.imageUrl}
                className=" object-cover h-32 w-32 rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <label>Your royalty percentage</label>
              <input
                type="number"
                max={12}
                min={0}
                id="royalty"
                required={true}
                placeholder="Royalty split"
                className="inputFieldText"
              />
            </div>
            <div className="flex flex-col">
              <label>NFT Name</label>
              <input
                type="text"
                id="nftName"
                required={true}
                placeholder="NFT Name"
                className="inputFieldText"
                onChange={(e) => setNameValue(e.target.value)}
                value={nameValue}
              />
            </div>
            <div className="flex flex-col">
              <label>NFT price</label>
              <input
                type="number"
                id="nftprice"
                required={true}
                placeholder="Price in USD"
                className="inputFieldText"
              />
            </div>
            <div className="flex flex-col">
              <label>NFT editions</label>
              <input
                type="number"
                id="nfteditions"
                required={true}
                placeholder="Amount of editions"
                className="inputFieldText"
              />
            </div>
            <div className="flex flex-row justify-between w-full items-center">
              <div className="flex flex-row gap-5">
                <div className="flex flex-col justify-center">
                  <div className="font-bold primaryColor text-2xl">
                    {props.producer.fullName}
                  </div>
                  <div className="font-bold text-xl">
                    {props.bp.beatPackName}
                  </div>
                  <div className=" text-gray-400">
                    royalties: {props.bp.royaltyIndex}%
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-end">
                <div
                  className="primaryButton bg-gray-500 text-white cursor-pointer"
                  onClick={() => {
                    onDownload();
                  }}
                >
                  Download beats
                </div>
              </div>
            </div>
            <div className="divider mb-10"></div>
            <input type="submit" className="primaryButton mb-10" value="Mint NFT" />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 modalWidth">
      <div
        className="top-0 right-0 text-xl absolute z-50 text-gray-600 pt-5 pr-5 cursor-pointer"
        onClick={() => props.closeModal()}
      >
        close
      </div>

      <h2 className="text-3xl text-center font-bold">Complete checkout</h2>
      <div className=" bg-gray-100 w-full h-1 mb-10"></div>
      <div className="flex flex-row w-full justify-between">
        <div className="font-bold">Item</div>
        <div className="font-bold">Total</div>
      </div>

      <div className=" bg-gray-100 w-full h-1"></div>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-row gap-5">
          <img
            src={props.bp.imageUrl}
            className=" object-cover h-32 w-32 rounded-xl"
          />
          <div className="flex flex-col justify-center">
            <div className="font-bold primaryColor text-2xl">
              {props.producer.fullName}
            </div>
            <div className="font-bold text-xl">{props.bp.beatPackName}</div>
            <div className=" text-gray-400">
              royalties: {props.bp.royaltyIndex}%
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-end">
          <div className="font-bold text-2xl">${props.bp.beatPackPrice}</div>
          <div className="text-gray-400">
            Matic:{" "}
            {props.matic.data === null
              ? 0
              : Math.round(props.bp.beatPackPrice / props.matic.data.usdPrice)}
          </div>
        </div>
      </div>
      <div className=" bg-gray-100 w-full h-1 mb-10"></div>

      <button
        className="primaryButton"
        onClick={() => {
          //Authenticate, if complete init transfer of funds

          setTransferStatus(true);
        }}
      >
        Confirm checkout
      </button>
    </div>
  );
}
