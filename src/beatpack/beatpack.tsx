import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { emptyBp } from "../interfaces/beats";
import BeatPackInfo from "../components/beatpack/BeatpackInfo";
import ProducerInfo from "../components/beatpack/ProducerInfo";
import {
  useMoralis,
  useMoralisCloudFunction,
  useTokenPrice,
  useWeb3Transfer,
} from "react-moralis";
import { dataToBeatpackPage, dataToUser } from "../helpers/database";
import { emptyUser } from "../interfaces/users";
import SimilarEntities from "../components/beatpack/SimilarEntities";
import { Link, useParams } from "react-router-dom";
import LoadingWidget from "../components/general/loadingwidget";
import { PopUp } from "../components/general/PopUpModal";
import { CheckoutModal } from "./CheckoutModal";


///Beatpack page
const BeatPackPage = () => {
  const { Moralis } = useMoralis();
  const [modalIsOpen, setIsOpen] = useState(true);
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
        <PopUp
          isOpen={modalIsOpen}
          close={closeModal}
        >
          <CheckoutModal
            Moralis={Moralis}
            bp={bp}
            matic={matic}
            producer={producer}
            transfer={transfer}
            closeModal={closeModal}
          />
        </PopUp>
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
            <div className="hidden lg:block">
              <SimilarEntities bp={bp} setLoaded={setSimilarLoaded} />

            </div>
            <VStack w="100%" gap={10}>
              <div className="flex flex-row gap-5 justify-start w-full">
                <div>
                  <img
                    src={bp.imageUrl}
                    className=" object-cover h-32 w-32 md:h-60 md:w-60 rounded-xl"
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
                      ? "transition-all underline text-2xl md:text-3xl font-bold"
                      : "transition-all text-2xl md:text-3xl font-bold text-gray-500"
                  }
                  onClick={() => setActiveTab("beat")}
                >
                  Beatpack
                </div>
                <div
                  className={
                    activeTab !== "beat"
                      ? "transition-all underline text-2xl md:text-3xl font-bold"
                      : "transition-all text-2xl md:text-3xl font-bold text-gray-500"
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

