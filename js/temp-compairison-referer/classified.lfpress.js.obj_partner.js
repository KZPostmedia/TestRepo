document.write("<!-- /postmedia_obj_partner.inc -->");

var Postmedia = Postmedia || {};
Postmedia.adConfig = Postmedia.adConfig || {};
document.write("<!--^^^^^^^^^^^ CREATIVE WRAPPER ^^^^^^^^^^^^-->");
document.write("<!--Ad Server: DFP Premium (3081) -->");
document.write("<!--DFP Order ID: %ebuy! -->");
document.write("<!--DFP Line Item ID: %eaid! -->");
document.write("<!--DFP Creative ID: %ecid! -->");
document.write("<!--DFP Advertiser ID: %eadv! -->");
document.write("<!--CK Value: %%PATTERN:CK%! -->");
document.write("<!--SCK Value: %%PATTERN:SCK%%! -->");
document.write("<!--IMP Value: %%PATTERN:IMP%%! -->");
document.write("<!--LOC Value: %%PATTERN:LOC%%! -->");
document.write("<!--PAGE Value: %%PATTERN:PAGE%%! -->");
document.write("<!--^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^-->");

function get_aamCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
x=x.replace(/^\s+|\s+$/g,"");
if (x==c_name)
{
return unescape(y);
}
}
}
Postmedia = typeof(Postmedia) != 'undefined' ? Postmedia : {};
Postmedia.Weather = {};
if (Postmedia.hasOwnProperty("adConfig")) {
Postmedia.adConfigPartner=Postmedia.adConfig;
}

Postmedia.adConfig = {
"zone": "index",
"async": true,
"sra": true,
"networkId": "3081",
"site": "ccn_classifieds.com/lfp",
"enablelazy": true,
"enablerefresh": true,
"disableInitialLoad": false,
"burt": {
},
"keys": {
"pr":  ["gc","lfp"],
"imp":  "index",
"ck":  "index",
"nk":  "class"
},
"adslots":[
{
"name": "gpt-leaderboard",  "type": "leaderboard",  "isCompanion": false,  "lazy": true,  "refresh": true
},
{
"name": "gpt-bigboxtop",  "type": "bigboxtop",  "isCompanion": false,  "lazy": true,  "refresh": true
},
{
"name": "gpt-bigboxbot2",  "type": "bigboxbot2",  "isCompanion": false,  "lazy": true,  "refresh": true
},
{
"name": "gpt-oop",  "type": "oop",  "isCompanion": false,  "lazy": true,  "refresh": true
}
]
};
document.write("<!-- DisableBrowserCache -->");
document.write("<script type=\"text/javascript\" src=\"https://cdn.jsdelivr.net/gh/KZPostmedia/TestRepo/js/postmedia_obj_init.js?v=1\"></script>");
document.write("<script type=\"text/javascript\" src=\"https://cdn.jsdelivr.net/gh/KZPostmedia/TestRepo/js/analytics/VisitorAPI.js?v=4\"></script>");
document.write("<!-- Sourcepoint breaks in our 3rd party include method. -->");
document.write("<!-- /postmedia_obj_partner.inc -->");
