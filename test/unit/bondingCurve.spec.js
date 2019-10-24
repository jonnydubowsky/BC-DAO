// Import all required modules from openzeppelin-test-helpers
const { BN, constants, expectRevert } = require("openzeppelin-test-helpers");

const expectEvent = require("../helpers/expectEvent");
require("../config");

// Import preferred chai flavor: both expect and should are supported
const expect = require("chai").expect;
const should = require("chai").should();

const deploy = require("../../scripts/oz-deploy");

const {
  bondedTokenValues,
  paymentTokenValues
} = require("../constants/tokenValues");
const contractConstants = require("../constants/contractConstants.js");

const {
  shouldBehaveLikeBondingCurve
} = require("../behaviors/BondingCurve.behavior.js");
/*
  Uses StaticCurveLogic for simpler tests.
*/

describe("Bonding Curve", async () => {
  let accounts;
  let adminAccount;
  let curveOwner;
  let tokenMinter;
  let userAccounts;
  let miscUser;
  let deployParams;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    adminAccount = accounts[0];
    curveOwner = accounts[1];
    tokenMinter = accounts[2];
    userAccounts = accounts.slice(3, accounts.length);
    miscUser = userAccounts[0];

    deployParams = {
      owner: curveOwner,
      beneficiary: curveOwner,
      buyCurveParams: new BN(100000000), //1 bondedToken minted for every 100 collateralTokens sent
      sellCurveParams: new BN(10000000), //10 collateralTokens returned for every bondedToken burned
      collateralToken: null,
      splitOnPay: new BN(50),
      bondedTokenName: "BondedToken",
      bondedTokenSymbol: "BND"
    };
  });

  it("Bonding Curve - Average Paramters, StaticCurveLogic", async () => {
    await shouldBehaveLikeBondingCurve(
      {
        adminAccount,
        curveOwner,
        tokenMinter,
        userAccounts,
        miscUser
      },
      { deployParams, bondedTokenValues, paymentTokenValues }
    );
  });

  // context("Bonding Curve - Average Paramters, StaticCurveLogic", async () => {
  //   await shouldBehaveLikeBondingCurve(
  //     {
  //       adminAccount,
  //       curveOwner,
  //       tokenMinter,
  //       userAccounts,
  //       miscUser
  //     },
  //     { deployParams, bondedTokenValues, paymentTokenValues }
  //   );
  // });

  // context("SplitOnPay 0%", async () => {
  //   deployParams.splitOnPay = new BN(0);
  //   await shouldBehaveLikeBondingCurve(
  //     {
  //       adminAccount,
  //       curveOwner,
  //       tokenMinter,
  //       userAccounts,
  //       miscUser
  //     },
  //     { deployParams, bondedTokenValues, paymentTokenValues }
  //   );
  // });

  // context("SplitOnPay 100%", async () => {
  //   deployParams.splitOnPay = new BN(100);
  //   await shouldBehaveLikeBondingCurve(
  //     {
  //       adminAccount,
  //       curveOwner,
  //       tokenMinter,
  //       userAccounts,
  //       miscUser
  //     },
  //     { deployParams, bondedTokenValues, paymentTokenValues }
  //   );
  // });
});
