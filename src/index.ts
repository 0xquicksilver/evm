import { ethers, Provider, Wallet, Contract } from "ethers";
import axios from "axios";
import { CrocEnv } from '@crocswap-libs/sdk'
import dotenv from "dotenv";
import { ABI, headers } from "./utils";

// Muat variabel lingkungan dari file .env
dotenv.config();

// Ambil variabel lingkungan
const providerUrl = process.env.RPC!;
const privateKey = process.env.PRIVATE_KEY!;
const contract_stake = process.env.STAKE!;
const contract_goon = process.env.GOON!;
const contract_goonusd = process.env.GOONUSD!;
const contract_faucet = process.env.FAUCET!;
const contract_checkin = process.env.CHECKIN!;

const provider = new ethers.JsonRpcProvider(providerUrl)
const wallet = new Wallet(privateKey, provider)
const croc = new CrocEnv("0x99c0a0f", wallet)

async function getAuth(address: string) {
    const response = await axios("https://faucet.plumenetwork.xyz/api/faucet", {
        "headers": headers,
        method: 'POST',
        data: `{\"walletAddress\":\"${address}\",\"token\":\"GOON\"}`
    });

    const data = await response.data
    return data
}
async function getTokenBalance(token_address: string) {
    const contract = new Contract(token_address, ABI.ERC20_ABI, wallet)
    const balance = await contract.balanceOf(wallet.address)
    return balance
}
async function Faucet() {
    try {
        const auth: { salt: string, signature: string, token: string } = await getAuth(wallet.address)
        const contract = new Contract(contract_faucet, ABI.getToken, wallet)
        const feeData = await provider.getFeeData()
        const gasPrice = feeData.gasPrice
        const tx = await contract.getToken(auth.token, auth.salt, auth.signature, {
            gasLimit: 500000,
            gasPrice: gasPrice,
        })
        console.log("Faucet hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Faucet confirmed ")
    } catch (error) { 
        console.error(error)
    }
}
async function CheckIn() {
    try {
        const contract = new Contract(contract_checkin, ABI.checkIn, wallet)
        const tx = await contract.checkIn()
        console.log("CheckIn hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("CheckIn confirmed");
    } catch (error) {
        console.log('CheckIn Error')
    }
}
async function Buy() {
    try {
        const buy = await croc.buy(contract_goonusd, '0.001').with(contract_goon).swap()
        console.log('swap success')
    } catch (error) {
        console.log('swap Error')
    }
}
async function Sell() {
    try {
        const sell = await croc.sell(contract_goonusd, '0.001').for(contract_goon).swap()
        console.log('swap success')
    } catch (error) {
        console.log('swap Error')
    }
}
async function Stake() {
    try {
        const contract_Token = new Contract(contract_goonusd, ABI.ERC20_ABI, wallet)
        const contract_Stake = new Contract(contract_stake, ABI.stake, wallet)
        const amount_to_stake = ethers.parseEther('1')

        const tx = await contract_Token.approve(contract_stake, amount_to_stake)
        const receipt = await tx.wait()
        if (receipt.status != 1) return console.log('Approve Failed!');
        console.log('Approve Success')

        const tx_stake = await contract_Stake.stake(amount_to_stake)
        const stake_tx = await tx_stake.wait()
        if (stake_tx.status != 1) return console.log('Stake Failed!');
        console.log('Stake Success')
    } catch (error:any) {
        console.log('stake Error: ', error.message)
    }
}

async function main() {
    await Faucet()
    await CheckIn()
    await Buy()
    await Sell()
    await Stake()
}

main().catch(err => console.log(err.message))