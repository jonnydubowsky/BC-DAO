// Import all required modules from openzeppelin-test-helpers
const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("openzeppelin-test-helpers");

// Import preferred chai flavor: both expect and should are supported
const expect = require("chai").expect;
const should = require("chai").should();

require("../config");
const {
  deployProject,
  deployBancorFormula
} = require("../../scripts/oz-deploy.js");

const { values } = require("../constants/bancorValues");

describe("BancorFormula", async () => {
  let tx;
  let result;
  let project;

  let accounts;
  let creator;
  let initializer;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    creator = accounts[0];
    initializer = accounts[1];
  });

  beforeEach(async function() {
    project = await deployProject();
    this.bancorFormula = await deployBancorFormula(project);
  });

  it("calculates correct buy results for all value sets", async function() {
    for (let i = 0; i < values.length; i++) {
      let valueSet = values[i];
      const result = await this.bancorFormula.methods
        .calculatePurchaseReturn(
          valueSet.supply,
          valueSet.connectorBalance,
          valueSet.connectorWeight,
          valueSet.depositAmount
        )
        .call({ from: initializer });

      expect(new BN(result)).to.be.bignumber.equal(valueSet.expectedBuyResult);
    }
  });

  it("calculates correct sale results for all value sets", async function() {
    for (let i = 0; i < values.length; i++) {
      let valueSet = values[i];
      const result = await this.bancorFormula.methods
        .calculateSaleReturn(
          valueSet.supply,
          valueSet.connectorBalance,
          valueSet.connectorWeight,
          valueSet.depositAmount
        )
        .call({ from: initializer });

      expect(new BN(result)).to.be.bignumber.equal(valueSet.expectedSaleResult);
    }
  });
});
