function getAdConfig() {
  windowLoc = window.location
  //TODO: For testing, remove when live
  windowLoc = getMockLocation()
  const site = windowLoc.hostname
  conf = {}
  keys = {}

  // get constant valued keys
  conf["async"] = "true"
  conf["sra"] = "true"
  conf["networkId"] = "3081"
  conf["enablelazy"] = "true"
  conf["enablerefresh"] = "true"
  conf["disableInitialLoad"] = "false"

  //TODO: for testing, remove when live
  keys["adtest"] = "qa"

  // add all ad slots
  conf["adslots"] = getAdsBySite(windowLoc.hostname, windowLoc.pathname)

  // new ad config:
  pathFrags = windowLoc.pathname.split("/")
  if (pathFrags[pathFrags.length - 1] === "") pathFrags.pop()

  if (site.indexOf("remembering") !== -1) {

    // ad missing site id
    siteName = site.split(".")[0]
    conf["site"] = "remembering.com"
    conf["site"] += getPropertyValueForAdUnit(siteName)
    keys["pr"] = ["rem"].concat(getPropertyValueForKey(siteName))
    keys["prtn"] = "adperfect"

    // [''] for homepage
    // ['', 'obituary', 'pauline-livingstone-1086278630'] for random obit
    // ['', 'learn-and-prepare'] for learn and prepare
    // ['', 'learn-and-prepare', 'how-to-prepare-a-eulogy', '22'] for learn and prepare story
    // ['', 'obituaries', 'all-categories', 'search'] for obit search
    //    ['', 'funeral-home-directory'] 
    // or ['', 'funeral-home-directory', 'search']
    // or ['', 'funeral-home-directory', 'ab']
    //for funeral home directory

    keys["page"] = "index"
    if (pathFrags.length === 1) {
      keys["ck"] = "index"
      keys["imp"] = "index"
    }
    else if (pathFrags.length > 1) {
        if (pathFrags[1] === "obituaries") {
          keys["ck"] = "obituaries"
          keys["sck"] = pathFrags.slice(2)
          keys["imp"] = pathFrags.slice(-1)[0]
        }
        else if (pathFrags[1] === "learn-and-prepare") {
          if (pathFrags.length === 2) {
            keys["ck"] = "learn-and-prepare"
            keys["imp"] = "learn-and-prepare"
          }
          else {
            keys["ck"] = "learn-and-prepare"
            keys["page"] = "story"
          }
        }
        else if (pathFrags[1] === "funeral-home-directory") {
          keys["ck"] = "funeral-home-directory"
          keys["sck"] = "search"
          keys["imp"] = "search"
        }
    }
  }
  else if (site.indexOf("classifieds") !== -1) {

    siteName = site.split(".")[1]
    conf["site"] = "ccn_classifieds.com"
    conf["site"] += getPropertyValueForAdUnit(siteName)
    keys["pr"] = ["gc"].concat(getPropertyValueForKey(siteName))
    keys["prtn"] = "adperfect"

    // get ck, sck, and imp from URL
    // ['', 'london'] or [''] for homepage
    // ['', 'london', 'accounting-finance'] for category page
    // ['', 'london', 'accounting-finance', 'search'] for category search page
    // ['', 'london', 'community', 'getting-the-most-from-your-healthcare-appointment', '94875617cf46434d8e7a6ce306bb'] for story page

    keys["page"] = "index"
    if (pathFrags.length <= 2) {
      keys["ck"] = "index"
      keys["imp"] = "index"
    }
    else if (pathFrags.length === 3) {
      keys["ck"] = pathFrags[2]
      keys["imp"] = pathFrags[2]
    }
    else if (pathFrags.length > 3) {
      if (pathFrags[3].indexOf("search") !== -1) {
        keys["ck"] = pathFrags[2]
        keys["sck"] = "search"
        keys["imp"] = "search"
      }
      else {
        keys["ck"] = pathFrags[2]
        keys["page"] = "story"
      }
    }
  }
  else if (site.indexOf("working") !== -1) {
    workingCats = getWorkingCategories()
    workingPaths = getWorkingPathStrings()

    // add missing pr and site id value:
    siteName = pathFrags[1]
    conf["site"] = "ccn_working.com"
    conf["site"] += getPropertyValueForAdUnit(siteName)
    keys["pr"] = ["wk"].concat(getPropertyValueForKey(siteName))
    keys["prtn"] = "wehaa"

    // ["", "nationalpost"] for homepage
    //    ['', 'nationalpost', 'str:', 'categories:7'] 
    // or ['', 'nationalpost', 'categories:7']
    // for category page
    //    ["", "nationalpost", "view", "4482", "careers", "crew_leader.html"]
    // or ["", "nationalpost", "view", "4482", "careers"]
    // or ["", "nationalpost", "view", "4482"]
    // for story page

    cat = windowLoc.pathname.match(/categories:\d{1,2}/)
    path_regex = Object.keys(workingPaths).join('|')
    path = windowLoc.pathname.match(path_regex)
    if (cat !== null) {
      keys["ck"] = workingCats[cat]
      keys["imp"] = workingCats[cat]
    }
    else if (path !== null) {
      keys["ck"] = workingPaths[path]
      // This should only be story pages, no imp key for story pages
    }
    else {
      keys["ck"] = "index"
      keys["imp"] = "index"
    }
    if (windowLoc.pathname.indexOf("/view") !== -1) {
      keys["page"] = "story"
    }
    else {
      keys["page"] = "index"
    }
  }
  conf["zone"] = keys["page"]
  conf["keys"] = keys

  return conf

}

function parsePrs() {
  const adConfig = getAdConfigJSON()
  prClass = {}
  prRem = {}
  for (let s of adConfig.site) {
    site = s["@domain"]
    pr = []
    for (let p of s["keyValues"]) {
      if (p["@name"] === "pr") pr = p["#text"]
    }
    if (site.indexOf("remembering") !== -1) {
      siteName = site.split('.')[0]
      prRem[siteName] = pr.split(',').slice(1)
    }
    else if (site.indexOf("classifieds") !== -1) {
      siteName = site.split('.')[1]
      prClass[siteName] = pr.split(',').slice(1)
    }
  }
  return [prClass, prRem]
}

//regex for replacing old links with new (testing directory)
// str.replaceAll(/(?:secure|www)\.canada\.com.*\/(.*)\.(?:js|inc)/g, "storage.googleapis.com/pmd-dev-northamerica-northeast1-asset-ads-pub/test-assets/legacyAdConfig/$1.js")

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

//TODO: for testing, remove when live
function getMockLocation() {  // for use on testing environments

  if (getCookie("wp_dev_hostname") !== undefined) {
    test_domain = getCookie("wp_dev_hostname").replace("test", "")
    console.log(`got cookie, using test_domain = ${test_domain}`)
  }
  else {
    //default to tsun classifieds
    test_domain = "classifieds.torontosun.com"
    console.log(`could not get cookie, using test_domain = ${test_domain}`)
  }

  return {
    "ancestorOrigins": {},
    "href": "https://" + test_domain + window.location["pathname"],
    "origin": "https://" + test_domain,
    "protocol": "https:",
    "host": test_domain,
    "hostname": test_domain,
    "port": "",
    "pathname": window.location["pathname"],
    "search": "",
    "hash": ""
  }
}

function getWorkingCategories() {
  return {
    "categories:1": "accounting-financial",
    "categories:2": "admin-clerical",
    "categories:3": "agriculture",
    "categories:4": "architecture",
    "categories:5": "arts-entertainment",
    "categories:6": "careers",
    "categories:7": "construction-trades",
    "categories:8": "customer-service",
    "categories:9": "drivers",
    "categories:10": "education-training",
    "categories:11": "energy",
    "categories:12": "engineering",
    "categories:14": "general-help",
    "categories:15": "healthcare-pharma",
    "categories:16": "hospitality-food",
    "categories:17": "human-resources",
    "categories:18": "insurance-financial",
    "categories:19": "lawenforce-surveil",
    "categories:20": "legal",
    "categories:21": "media-publishing",
    "categories:23": "pr-advertising",
    "categories:24": "real-estate",
    "categories:25": "retail",
    "categories:26": "sales",
    "categories:27": "scientific",
    "categories:28": "social-care",
    "categories:29": "tech-telecomm",
    "categories:30": "travel-tourism",
    "categories:31": "volunteers",
    "categories:32": "employment-wanted",
    "categories:33": "other"
  }
}

function getWorkingPathStrings() {
  return {
    "accounting_and_financial": "accounting-financial",
    "admin_and_clerical": "admin-clerical",
    "agriculture": "agriculture",
    "architecture": "architecture",
    "arts_and_entertainment": "arts-entertainment",
    "careers": "careers",
    "construction_and_trades": "construction-trades",
    "customer_service": "customer-service",
    "drivers": "drivers",
    "education_and_training": "education-training",
    "employment_wanted": "employment-wanted",
    "energy": "energy",
    "engineering": "engineering",
    "general_help": "general-help",
    "healthcare_and_pharma": "healthcare-pharma",
    "hospitality_and_food_services": "hospitality-food",
    "human_resources_and_recruitment": "human-resources",
    "insurance_and_financial": "insurance-financial",
    "law_enforcement_and_surveillance": "lawenforce-surveil",
    "legal": "legal",
    "media_publishing": "media-publishing",
    "other": "other",
    "pr_and_advertising": "pr-advertising",
    "real_estate": "real-estate",
    "retail": "retail",
    "sales": "sales",
    "scientific": "scientific",
    "social_care": "social-care",
    "tech_and_telecomm": "tech-telecomm",
    "travel_and_tourism": "travel-tourism",
    "volunteers": "volunteers"
  }
}

function getPropertyValueForAdUnit(name) {
  namePRDict = {
    "airdrieecho": "/ade",
    "altona": "/rre",
    "brantfordexpositor": "/brx",
    "calgary": "",
    "calgaryherald": "/ch",
    "calgarysun": "/csun",
    "carman": "/tvl",
    "carmanvalleyleader": "/tvl",
    "chathamdailynews": "/cdn",
    "chathamthisweek": "/ctw",
    "clintonnewsrecord": "/cnr",
    "cochranetimes": "/cct",
    "cochranetimespost": "/cbe",
    "coldlakesun": "/clk",
    "communitypress": "/cpa",
    "countyweeklynews": "/cwn",
    "dailyheraldtribune": "/dht",
    "delhinewsrecord": "/dnr",
    "devondispatch": "/dvd",
    "draytonvalleywesternreview": "/dvw",
    "edmonton": "",
    "edmontonexaminer": "/edx",
    "edmontonjournal": "/ej",
    "edmontonsun": "/esun",
    "edson": "/edl",
    "edsonleader": "/edl",
    "elliotlakestandard": "/els",
    "fairviewpost": "/fvp",
    "fortmcmurraytoday": "/fmt",
    "fortsaskatchewanrecord": "/fsr",
    "gananoquereporter": "/gqr",
    "gimli": "/tis",
    "goderichsignalstar": "/gss",
    "grandprairie": "",
    "hannaherald": "/hnh",
    "highrivertimes": "/hrt",
    "hinton": "/htp",
    "hintonparklander": "/htp",
    "intelligencer": "/bvi",
    "interlakespectator": "/tis",
    "kenoradailyminerandnews": "/kdm",
    "kenoraminerandnews": "/kdm",
    "kincardinenews": "/kcn",
    "lacombe": "/lmg",
    "lacombeglobe": "/lmg",
    "lakeshoreadvance": "/lsa",
    "leaderpost": "/rlp",
    "leducrep": "/ldr",
    "lfpress": "/lfp",
    "lucknowsentinel": "/lus",
    "mayerthorpefreelancer": "/myf",
    "melfortjournal": "/mfj",
    "melfortnipawinjournal": "/mfj",
    "midnorthmonitor": "/emm",
    "mitchelladvocate": "/mta",
    "montrealgazette": "/mg",
    "morden": "/mts",
    "mordentimes": "/mts",
    "nantonnews": "/nan",
    "napaneeguide": "/nap",
    "nationalpost": "/np",
    "nipawinjournal": "/npj",
    "norfolkandtillsonburgnews": "/tbn",
    "northernnews": "/kln",
    "nugget": "/nbn",
    "ontariofarmer": "/ws",
    "ottawa": "",
    "ottawacitizen": "/oc",
    "ottawasun": "/osun",
    "owensoundsuntimes": "/ows",
    "parisstaronline": "/prs",
    "peacecountrysun": "/pcs",
    "pembrokeobserver": "/pem",
    "pinchercreekecho": "/pce",
    "portagedailygraphic": "/ppg",
    "prrecordgazette": "/rcg",
    "recorder": "/bkr",
    "redrivervalleyecho": "/rre",
    "sarniathisweek": "/slw",
    "saultstar": "/ssw",
    "seaforthhuronexpositor": "/shx",
    "selkirk": "/tsl",
    "selkirkjournal": "/tsl",
    "sherwoodparknews": "/swp",
    "shorelinebeacon": "/slb",
    "simcoereformer": "/srf",
    "sprucestony": "/syp",
    "standard-freeholder": "/csf",
    "stonewall": "/sat",
    "stonewallargusteulontimes": "/sat",
    "stratfordbeaconherald": "/sbh",
    "strathroyagedispatch": "/sad",
    "stthomastimesjournal": "/stj",
    "thebeaumontnews": "/bmn",
    "thechronicle-online": "/wlc",
    "thecragandcanyon": "/bvc",
    "thegraphicleader": "/ppg",
    "thelondoner": "/tlo",
    "theobserver": "/sob",
    "thepost": "/hnp",
    "theprovince": "/vp",
    "thestarphoenix": "/ssp",
    "thesudburystar": "/sus",
    "thewhig": "/kin",
    "tillsonburgnews": "/tbn",
    "timminspress": "/tdp",
    "torontosun": "/tsun",
    "trentonian": "/ttt",
    "vancouversun": "/vs",
    "vancouversunandprovince": "",
    "vermilionstandard": "/vms",
    "vulcanadvocate": "/vla",
    "wallaceburgcourierpress": "/wcn",
    "wetaskiwintimes": "/wtt",
    "whitecourtstar": "/wcs",
    "wiartonecho": "/wie",
    "windsorstar": "/ws",
    "winkler": "/twt",
    "winklertimes": "/twt",
    "winnipegsun": "/wsun",
    "woodstocksentinelreview": "/wsr",
    "www": "/tsun"
  }
  if (name in namePRDict) {
    return namePRDict[name]
  }
  return ""
}

function getPropertyValueForKey(name) {
  namePRDict = {
    "airdrieecho": ["ade"],
    "altona": ["rre"],
    "brantfordexpositor": ["brx"],
    "calgary": ["ch", "csun"],
    "calgaryherald": ["ch"],
    "calgarysun": ["csun"],
    "carman": ["tvl"],
    "carmanvalleyleader": ["tvl"],
    "chathamdailynews": ["cdn"],
    "chathamthisweek": ["ctw"],
    "clintonnewsrecord": ["cnr"],
    "cochranetimes": ["cct"],
    "cochranetimespost": ["cbe"],
    "coldlakesun": ["clk"],
    "communitypress": ["cpa"],
    "countyweeklynews": ["cwn"],
    "dailyheraldtribune": ["dht"],
    "delhinewsrecord": ["dnr"],
    "devondispatch": ["dvd"],
    "draytonvalleywesternreview": ["dvw"],
    "edmonton": ["ej","esun"],
    "edmontonexaminer": ["edx"],
    "edmontonjournal": ["ej"],
    "edmontonsun": ["esun"],
    "edson": ["edl"],
    "edsonleader": ["edl"],
    "elliotlakestandard": ["els"],
    "fairviewpost": ["fvp"],
    "fortmcmurraytoday": ["fmt"],
    "fortsaskatchewanrecord": ["fsr"],
    "gananoquereporter": ["gqr"],
    "gimli": ["tis"],
    "goderichsignalstar": ["gss"],
    "grandprairie": ["dht","pcs"],
    "hannaherald": ["hnh"],
    "highrivertimes": ["hrt"],
    "hinton": ["htp"],
    "hintonparklander": ["htp"],
    "intelligencer": ["bvi"],
    "interlakespectator": ["tis"],
    "kenoradailyminerandnews": ["kdm"],
    "kenoraminerandnews": ["kdm"],
    "kincardinenews": ["kcn"],
    "lacombe": ["lmg"],
    "lacombeglobe": ["lmg"],
    "lakeshoreadvance": ["lsa"],
    "leaderpost": ["rlp"],
    "leducrep": ["ldr"],
    "lfpress": ["lfp"],
    "lucknowsentinel": ["lus"],
    "mayerthorpefreelancer": ["myf"],
    "melfortjournal": ["mfj"],
    "melfortnipawinjournal": ["mfj"],
    "midnorthmonitor": ["emm"],
    "mitchelladvocate": ["mta"],
    "montrealgazette": ["mg"],
    "morden": ["mts"],
    "mordentimes": ["mts"],
    "nantonnews": ["nan"],
    "napaneeguide": ["nap"],
    "nationalpost": ["np"],
    "nipawinjournal": ["npj"],
    "norfolkandtillsonburgnews": ["tbn"],
    "northernnews": ["kln"],
    "nugget": ["nbn"],
    "ontariofarmer": ["ws"],
    "ottawa": ["oc", "osun"],
    "ottawacitizen": ["oc"],
    "ottawasun": ["osun"],
    "owensoundsuntimes": ["ows"],
    "parisstaronline": ["prs"],
    "peacecountrysun": ["pcs"],
    "pembrokeobserver": ["pem"],
    "pinchercreekecho": ["pce"],
    "portagedailygraphic": ["ppg"],
    "prrecordgazette": ["rcg"],
    "recorder": ["bkr"],
    "redrivervalleyecho": ["rre"],
    "sarniathisweek": ["slw"],
    "saultstar": ["ssw"],
    "seaforthhuronexpositor": ["shx"],
    "selkirk": ["tsl"],
    "selkirkjournal": ["tsl"],
    "sherwoodparknews": ["swp"],
    "shorelinebeacon": ["slb"],
    "simcoereformer": ["srf"],
    "sprucestony": ["sgx", "syp"],
    "standard-freeholder": ["csf"],
    "stonewall": ["sat"],
    "stonewallargusteulontimes": ["sat"],
    "stratfordbeaconherald": ["sbh"],
    "strathroyagedispatch": ["sad"],
    "stthomastimesjournal": ["stj"],
    "thebeaumontnews": ["bmn"],
    "thechronicle-online": ["wlc"],
    "thecragandcanyon": ["bvc"],
    "thegraphicleader": ["ppg"],
    "thelondoner": ["tlo"],
    "theobserver": ["sob"],
    "thepost": ["hnp"],
    "theprovince": ["vp"],
    "thestarphoenix": ["ssp"],
    "thesudburystar": ["sus"],
    "thewhig": ["kin"],
    "tillsonburgnews": ["tbn"],
    "timminspress": ["tdp"],
    "torontosun": ["tsun"],
    "trentonian": ["ttt"],
    "vancouversun": ["vs"],
    "vancouversunandprovince": ["vp", "vs"],
    "vermilionstandard": ["vms"],
    "vulcanadvocate": ["vla"],
    "wallaceburgcourierpress": ["wcn"],
    "wetaskiwintimes": ["wtt"],
    "whitecourtstar": ["wcs"],
    "wiartonecho": ["wie"],
    "windsorstar": ["ws"],
    "winkler": ["twt"],
    "winklertimes": ["twt"],
    "winnipegsun": ["wsun"],
    "woodstocksentinelreview": ["wsr"],
    "www": ["tsun"]
  }
  if (name in namePRDict) {
    return namePRDict[name]
  }
  return []
}

function getAdsBySite(site, path) {
  adTypes = []

  if (site.indexOf("remembering") !== -1) {
    if (path.length <= 1 || path.indexOf("/obituaries/all-categories") == 0) {
      adTypes = ['leaderboard', 'leaderboardbot', 'bigboxtop', 'bigboxbot', 'mobilebigboxtop', 'mobilebigboxbot2']
    }
    else if (path.indexOf("/obituaries") == 0 || path.indexOf("/news") == 0 || path.indexOf("/learn-and-prepare") == 0) {
      adTypes = ['bigboxtop', 'bigboxbot', 'mobilebigboxtop', 'mobilebigboxbot2', 'bigboxmid', 'mobilebigboxmid']
    }
  }

  else if (site.indexOf("classifieds") !== -1) {
    adTypes = ['leaderboard', 'bigboxtop', 'oop']
    // 12 classifieds sites randomly use a different ad slot
    if (site.match("winnipegsun|calgaryherald|edmontonjournal|leaderpost|montrealgazette|nationalpost|ottawacitizen|theprovince|thestarphoenix|vancouversun|windsorstar|ontariofarmer")) {
      adTypes.push('bigboxbot')
    }
    else adTypes.push('bigboxbot2')
  }

  else if (site.indexOf("working") !== -1) {
    adTypes = ["leaderboard", "bigboxbot", "bigboxtop"]
  }

  slots = []
  for (let ad of adTypes) {
    slots.push({
      "name": `gpt-${ad}`,
      "type": ad,
      "isCompanion": false,
      "lazy": true,
      "refresh": true
    })
  }
  return slots
}