import fg from 'figlet'
import fs from 'node:fs'
import Table from 'cli-table3'

export const ABI = {
    checkIn: [{
        "inputs": [],
        "name": "checkIn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },],
    getToken: [{
        "inputs": [
            {
                "internalType": "string",
                "name": "token",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "getToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },],
    ERC20_ABI: [
        {
            "constant": false,
            "inputs": [
                { "name": "_spender", "type": "address" },
                { "name": "_value", "type": "uint256" }
            ],
            "name": "approve",
            "outputs": [{ "name": "success", "type": "bool" }],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
        },
    ],
    stake: [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "stake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}

export const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
}
export function Info() {
    fg.text(
        "Plume Testnet",
        {
            font: "Epic",
            horizontalLayout: "full",
            verticalLayout: "universal smushing",
            width: 80,
            whitespaceBreak: true,
            printDirection: 20
        },
        async function (err, data: any) {
            if (err) {
                console.log("Something went wrong...");
                console.dir(err);
                return;
            }
            LOG(data)
            var table = new Table({});
            table.push(
                ['author : 0xquicksilver', 'github : 0xquicksilver', 'twitter : 0x01day']
            );
            LOG(table.toString());
        }
    );
}

export function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function demo() {
    await sleep(500);
}

export function RandomNum(x: number, y: number) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

export async function LOG(message: string) {
    console.clear()
    const isExist = fs.existsSync('./log.txt')
    if (!isExist) return fs.writeFileSync('log.txt', message);
    var oldlog = fs.readFileSync('log.txt', 'utf8') + '\n' + message
    fs.writeFileSync('log.txt', oldlog)
    console.log(oldlog)
}