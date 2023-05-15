import { AxiosResponse } from 'axios'
import { reqUser, reqContract } from 'utils/request'
import { Buffer } from 'buffer'

export interface IMyResponse extends AxiosResponse {
  message: string
}

export interface IUserInfo extends AxiosResponse {
  message: string
  data: {
    signUserId: string
    address: string
    nodeType: string
  }
}

export interface IProduct {
  productName: string
  producerName: string
  productionDate: string
  location: string
  batchNumber: string
  ingredients: string[]
}

export interface IProductInfo {
  productHash: string
  productInfo:IProduct
  owner: string
  paused: boolean
  chainTraces: IChainTrace[]
}

export interface IChainTrace {
  node: {
    nodeAddress: string
    nodeType: number
    isRegistered: boolean
  }
  isVerified: boolean
  timestamp: number
}


const payload = {
  "groupId": 1,
  "contractName": "SupplyChain",
  "contractPath": "/SupplyChain",
  "version": "",
  "funcName": "isRegister",
  "contractAddress": "0x2193b14e975b761323f6b774e906765ebf815770",
  "contractAbi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "nodeAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "enum SupplyChain.NodeType",
          "name": "nodeType",
          "type": "uint8"
        }
      ],
      "name": "NodeCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "nodeAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "enum SupplyChain.NodeType",
          "name": "nodeType",
          "type": "uint8"
        }
      ],
      "name": "NodeRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "nodeAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "enum SupplyChain.NodeType",
          "name": "nodeType",
          "type": "uint8"
        }
      ],
      "name": "NodeVerified",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "productCode",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nodeAddress",
          "type": "address"
        }
      ],
      "name": "ProductInfoAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "productCode",
          "type": "string"
        }
      ],
      "name": "ProductInfoVerified",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_producerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_productionDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_batchNumber",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_ingredients",
          "type": "string[]"
        }
      ],
      "name": "addProduct",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_node",
          "type": "address"
        }
      ],
      "name": "cancelNode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllNode",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "nodeAddress",
              "type": "address"
            },
            {
              "internalType": "enum SupplyChain.NodeType",
              "name": "nodeType",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "isRegistered",
              "type": "bool"
            }
          ],
          "internalType": "struct SupplyChain.Node[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllProductHash",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productHash",
          "type": "uint256"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "productName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "producerName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "productionDate",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "batchNumber",
              "type": "string"
            },
            {
              "internalType": "string[]",
              "name": "ingredients",
              "type": "string[]"
            }
          ],
          "internalType": "struct SupplyChain.ProductInfo",
          "name": "productInfo",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "paused",
          "type": "bool"
        },
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "nodeAddress",
                  "type": "address"
                },
                {
                  "internalType": "enum SupplyChain.NodeType",
                  "name": "nodeType",
                  "type": "uint8"
                },
                {
                  "internalType": "bool",
                  "name": "isRegistered",
                  "type": "bool"
                }
              ],
              "internalType": "struct SupplyChain.Node",
              "name": "node",
              "type": "tuple"
            },
            {
              "internalType": "bool",
              "name": "isVerified",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct SupplyChain.ChainTrace[]",
          "name": "chainTraces",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_node",
          "type": "address"
        }
      ],
      "name": "isRegister",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "nodes",
      "outputs": [
        {
          "internalType": "address",
          "name": "nodeAddress",
          "type": "address"
        },
        {
          "internalType": "enum SupplyChain.NodeType",
          "name": "nodeType",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum SupplyChain.NodeType",
          "name": "_nodeType",
          "type": "uint8"
        }
      ],
      "name": "registerNode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_node",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_productHash",
          "type": "uint256"
        }
      ],
      "name": "transferProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productHash",
          "type": "uint256"
        }
      ],
      "name": "verifiedProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_node",
          "type": "address"
        }
      ],
      "name": "verifyNode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "useAes": false,
  "useCns": false,
  "cnsName": ""
}

const interact = (
  signUserId: string,
  funcName: string, funcParam?: string | string[] | number | IProduct) => {
  return reqContract.post('/trans/handleWithSign', {
    ...payload,
    signUserId,
    funcName,
    ...(typeof funcParam === 'string' || typeof funcParam === 'number') && {
      funcParam: [funcParam],
    },
    ...(Array.isArray(funcParam)) && {
      funcParam,
    },
    ...(typeof funcParam === 'object' && !Array.isArray(funcParam)) && {
      funcParam: Object.values(funcParam),
    },
  })
}

export const newUser = (signUserId: string, appId = 'test') =>
  reqUser.get('/user/newUser', {
    params: {
      signUserId,
      appId,
    },
  })

export const fetchUserInfo = (signUserId: string) => {
  return reqUser.get(`/user/${signUserId}/userInfo`)
}

export const sign = (signUserId: string, encodedDataStr: string) => {
  encodedDataStr = Buffer.from(encodedDataStr).toString('hex')

  return reqUser.post(`/sign`, {
    signUserId,
    encodedDataStr,
  })
}

export const isRegistered = (signUserId: string, addr: string) => {
  return interact(signUserId, 'isRegister', addr)
}

export const setRole = (signUserId: string, roleId: number) => {
  return interact(signUserId, 'registerNode', roleId)
}

export const getAllNode = () => {
  return interact('admin', 'getAllNode')
}

export const nodes = (signUserId: string, addr: string) =>{
  return interact(signUserId, 'nodes', addr)
}

export const getNodeStatus = (addr: string) => {
  return interact('admin', 'nodes', addr)
}

export const approveNode = (addr: string) => {
  return interact('admin', 'verifyNode', addr)
}

export const disapproveNode = (addr: string) => {
  return interact('admin', 'cancelNode', addr)
}

export const addProduct = (signUserId: string, product: IProduct) => {
  return interact(signUserId, 'addProduct', product)
}

export const getAllProducts = () => {
  return interact('admin', 'getAllProductHash')
}

export const getProduct = (productHash: string) => {
  return interact('admin', 'getProduct', productHash)
}

export const transferProduct = (signUserId: string, productHash: string[]) => {
  return interact(signUserId, 'transferProduct', productHash)
}

export const verifyProduct = (signUserId: string, productHash: string) => {
  return interact(signUserId, 'verifiedProduct', productHash)
}
