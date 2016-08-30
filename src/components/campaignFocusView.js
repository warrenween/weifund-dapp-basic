const web3 = require('../web3').web3;
const getLocale = require('../environment').getLocale;
const oneDay = require('../utils/').oneDay;

const campaignFocusOverviewView = require('./campaignFocusOverviewView');
const campaignFocusDetailsView = require('./campaignFocusDetailsView');
const campaignFocusContractsView = require('./campaignFocusContractsView');
const campaignFocusQRView = require('./campaignFocusQRView');
const campaignFocusNav = require('./campaignFocusNav');

const parseDisambiguatedDescription = function(campaignDataObject) {
  return campaignDataObject.hasValidData && campaignDataObject.data.i18n[getLocale()].disambiguatedDescription || `A crowdfund that is valid enough to be listed, but does not have a description.`;
}

const campaignFocusView = function(campaignObject) {
  return `<div class="campaign-focus" style="margin-top: 40px;">

    <div class="row center-block container text-center" style="margin-bottom: 60px;">
      <h1 style="font-size: 40px; font-weight: 500;">${campaignObject.name}</h1>
      <h4>by ${campaignObject.owner}</h4>
    </div>

    <div class="container row center-block">
      <div class="col-xs-12 col-sm-8">
        ${
           `<iframe style="width: 100%; height: 410px;" src="${campaignObject.mainEntityIsVideo && campaignObject.mainEntityVideo.embedUrl || `https://www.youtube.com/embed/kn-1D5z3-Cs?showinfo=0`}" frameborder="0" allowfullscreen></iframe>`
        }
      </div>
      <div class="col-xs-12 col-sm-4">
        <h1><b>${campaignObject.progress}%</b></h1>
        <h4>progress</h4>
        <h1><b>${web3.fromWei(campaignObject.amountRaised, 'ether').toFixed(4)} <small>ETH</small></b></h1>
        <h4>contributed of ${web3.fromWei(campaignObject.fundingGoal, 'ether').toFixed(4)} ETH goal</h4>
        <h1><b>${Math.round(Math.abs((campaignObject.expiry.toNumber(10) * 1000 - (new Date()).getTime()) / (oneDay)))} </b></h1>
        <h4>days to go</h4>

        <br /><br />



        ${campaignObject.hasSucceeded
          && `<a id="campaign_payoutButton" href="/campaign/${campaignObject.id}/payout">
          <button class="btn btn-lg btn-success">Payout This Project</button>
        </a>`
          || `<a id="campaign_contributeButton" ${campaignObject.active && `href="/campaign/${campaignObject.id}/contribute"` || ``}>
          <button ${campaignObject.active && `class="btn btn-lg btn-primary"` || `disabled="disabled" class="btn btn-lg btn-primary"` }>Back This Project</button>
        </a>`}

        <a id="campaign_refundButton" href="/campaign/${campaignObject.id}/refund" ${campaignObject.hasFailed && `` || `style="display: none;"`}>
          <button class="btn btn-lg btn-warning">Claim Refund</button>
        </a>
      </div>
    </div>

    <div class="container row center-block" style="margin-top: 20px;">
      <div class="col-xs-12 col-sm-8">
        <h4>Overview</h4>
        <h3>${parseDisambiguatedDescription(campaignObject)}</h3>
      </div>
      <div class="col-xs-12 col-sm-4">
        <div class="alert alert-warning" id="campaign_contributeFailureMessage" ${(campaignObject.active || campaignObject.hasSucceeded) && `style="display: none;"` || ``}>
          You can no longer contribute to this campaign as it is no longer active.
        </div>

        <br />

        <small>This project will expire at ${(new Date(campaignObject.expiry.toNumber(10) * 1000)).toString()}.</small>
      </div>
    </div>

    <br /><br />

    <div style="background-color: #FFF; padding-bottom: 150px;">
      ${campaignFocusNav({campaignObject: campaignObject, getLocale: getLocale})}

      ${campaignFocusOverviewView({campaignObject: campaignObject, getLocale: getLocale})}      ${campaignFocusDetailsView({campaignObject: campaignObject, getLocale: getLocale, web3: web3})}      ${campaignFocusContractsView({campaignObject: campaignObject, getLocale: getLocale})}      ${campaignFocusQRView({campaignObject: campaignObject, getLocale: getLocale})}
    </div>
  </div>`;
};

module.exports = campaignFocusView;
