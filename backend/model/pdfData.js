/**
 * pdfData is a custom object that contains the user's answers to the quiz questions.
 */
exports.getPdfDataModel = function () {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.gender = '';
    this.address = '';
    this.city = '';
    this.state = '';
    this.postalCode = '';
    this.birthMonth = '';
    this.birthDay = new CustomDate();
    this.birthYear = '';
    this.maritalStatus = '';
    this.marriageDate = new CustomDate();
    this.spouseType = '';
    this.spouseName = '';
    this.personalRep1 = '';
    this.personalRep1Relationship = '';
    this.personalRep2 = '';
    this.personalRep2Relationship = '';
    this.guardian1 = '';
    this.guardian1Relationship = '';
    this.guardian2 = '';
    this.guardian2Relationship = '';
    this.hasChildren = '';
    this.numSons = '0';
    this.hasGrandchildren = '';
    this.numGrandsons = '0';
    this.numGranddaughters = '0';
    this.numDaughters = '0';
    this.numKids = '0';
    this.hasSiblings = '';
    this.numBrothers = '0';
    this.numSisters = '0';
    this.hasFather = '';
    this.fatherName = '';
    this.hasMother = '';
    this.motherName = '';
    this.hasPaternalGrandfather = '';
    this.grandFatherName = '';
    this.hasFatherHalfSiblings = '';
    this.numFatherHalfBrothers = '0';
    this.numFatherHalfSisters = '0';
    this.hasMotherHalfSiblings = '';
    this.numMotherHalfSiblings = '0';
    this.hasNephews = '';
    this.numNephews = '0';
    this.hasUncles = '';
    this.numUncles = '0';
    this.profession = '';
    this.hasArbitration = '';
    this.arbitratorName = '';
    this.hasDebt = '';
    this.hasDonations = '';
    this.assetClass = '';
    this.assets = '';
    this.sonNames = [];
    this.sonBirthdays = [];
    this.grandsonNames = [];
    this.granddaughterNames = [];
    this.daughterNames = [];
    this.daughterBirthdays = [];
    this.brotherNames = [];
    this.fatherHalfBrotherNames = [];
    this.fatherHalfSisterNames = [];
    this.motherHalfSiblingNames = [];
    this.nephewNames = [];
    this.uncleNames = [];
    this.sisterNames = [];
    this.bequestArr = [];
    this.bequestLen = 0;
    this.numDebts = 0;
    this.numDonations = 0;
    this.debtNames = [];
    this.debtRecipientTypes = [];
    this.debtAddresses = [];
    this.debtAmounts = [];
    this.debtReasons = [];
    this.donationNames = [];
    this.donationRecipientTypes = [];
    this.donationAddresses = [];
    this.donationTypes = [];
    this.donationAmounts = [];
    this.lastEdited = '';
}

function CustomDate() {
    this.month = '';
    this.day = '';
    this.year = '';
}