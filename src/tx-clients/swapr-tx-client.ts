const BigNum = require('bn.js')
import fs from 'fs'
import {
  makeSmartContractDeploy,
  makeContractCall,
  TransactionVersion,
  FungibleConditionCode,

  serializeCV,
  deserializeCV,
  standardPrincipalCV,
  uintCV,

  BooleanCV,
  PrincipalCV,
  UIntCV,

  ChainID,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  StacksTestnet,
  broadcastTransaction,
} from '@blockstack/stacks-transactions'

import {
  wait,
  waitForTX,
} from '../tx-utils'
import { replaceKey } from '../utils'

export class SwaprTXClient {
  constructor(token1, token2, keys, network) {
    this.keys = keys
    this.network = network
    this.token1 = token1
    this.token2 = token2
    this.contract_name = `swapr-${token1}-${token2}`
  }

  async deployContract() {
    const fee = new BigNum(13681)
    const contract_swapr_body = replaceKey(replaceKey(fs.readFileSync('./contracts/swapr.clar').toString(), 'SP2NC4YKZWM2YMCJV851VF278H9J50ZSNM33P3JM1.my-token', `${this.keys.stacksAddress}.${this.token1}`), 'SP1QR3RAGH3GEME9WV7XB0TZCX6D5MNDQP97D35EH.my-token', `${this.keys.stacksAddress}.${this.token2}`)

    console.log("contract_swapr_body", this.token1, this.token2, contract_swapr_body)

    console.log("deploying swapr contract")
    const transaction_deploy_trait = await makeSmartContractDeploy({
      contractName: this.contract_name,
      codeBody: contract_swapr_body,
      senderKey: this.keys.secretKey,
      network: this.network,
      fee,
      // nonce: new BigNum(0),
    })
    const tx_id = await broadcastTransaction(transaction_deploy_trait, this.network)
    const tx = await waitForTX(this.network.coreApiUrl, tx_id, 10000)
    return tx
  }

}