import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";

import { Contract, providers, utils } from "ethers";
import Web3Modal from "web3modal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // Keep track of whether wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);

  // used when waiting on txs
  const [loading, setLoading] = useState(false);

  // keep track of number of tokenids minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Need to be connected to the mumbai network");
      throw new Error("Please connect to the mumbai network");
    }

    if (needSigner) {
      const signer = await web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  return (
    <>
      <Head>
        <title>LW3Punks</title>
        <meta name="description" content="LW3Punks dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
