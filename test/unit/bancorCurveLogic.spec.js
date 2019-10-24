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
  deployBancorCurveService,
  deployBancorCurveLogic
} = require("../../scripts/oz-deploy");

const { values } = require("../constants/bancorValues");

describe("BancorCurveLogic", async () => {
  let tx;
  let project;

  let accounts;
  let creator;
  let initializer;

  let curve;
  let bancorCurveService;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    creator = accounts[0];
    initializer = accounts[1];
  });

  const reserveRatio = new BN(1000);
  beforeEach(async function() {
    project = await deployProject();
    bancorCurveService = await deployBancorCurveService(project);
    curve = await deployBancorCurveLogic(project, [
      bancorCurveService.address,
      reserveRatio.toString()
    ]);
  });

  it("initializes reserve ratio parameter correctly", async function() {
    const result = await curve.methods
      .reserveRatio()
      .call({ from: initializer });

    expect(new BN(result)).to.be.bignumber.equal(reserveRatio);
  });

  it("initializes curve service parameter correctly", async function() {
    const result = await curve.methods
      .bancorService()
      .call({ from: initializer });

    expect(result).to.be.equal(bancorCurveService.address);
  });

  it("calculates correct buy results for all value sets", async function() {
    for (let i = 0; i < values.length; i++) {
      const valueSet = values[i];
      const result = await curve.methods
        .calcMintPrice(
          valueSet.supply,
          valueSet.connectorBalance,
          valueSet.depositAmount
        )
        .call({ from: initializer });

      expect(new BN(result)).to.be.bignumber.equal(valueSet.expectedBuyResult);
    }
  });

  it("calculates correct sell results for all value sets", async function() {
    let valueSet = values[0];
    const result = await curve.methods
      .calcBurnReward(
        valueSet.supply,
        valueSet.connectorBalance,
        valueSet.depositAmount
      )
      .call({ from: initializer });

    expect(new BN(result)).to.be.bignumber.equal(valueSet.expectedSaleResult);
  });
});
