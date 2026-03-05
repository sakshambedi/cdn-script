const SUPABASE_URL = "https://qtdmojmizwncsmdspbgk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZG1vam1penduY3NtZHNwYmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODcyNzcsImV4cCI6MjAyMTI2MzI3N30.XVcYZ50zyYUh4uHdGcBZaP0fumIt9vF58K_D4_G8sk4";

const ALLOWED_URLS = [
  "https://www.murrayjeepram.ca/how-to-blog/",
  "https://www.murraychevrolet.ca/how-to-blog/",
];

(function () {
  var current = String(window.location.href || "")
    .toLowerCase()
    .trim()
    .replace(/\/$/, "");
  var allowed = ALLOWED_URLS.map(function (u) {
    return String(u).toLowerCase().trim().replace(/\/$/, "");
  });
  if (allowed.indexOf(current) === -1) return;

  function pushDL(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  var INJECT_SELECTOR = ".primary-wrapper .primary.col";
  var INJECT_TIMEOUT_MS = 10000;

  function injectContent(html) {
    if (!html) return;

    var container = document.querySelector(INJECT_SELECTOR);
    if (container) {
      container.innerHTML = html;
      return;
    }
    var resolved = false;
    var timer = setTimeout(function () {
      if (resolved) return;
      resolved = true;
      observer.disconnect();
    }, INJECT_TIMEOUT_MS);

    var observer = new MutationObserver(function () {
      if (resolved) return;
      var el = document.querySelector(INJECT_SELECTOR);
      if (el) {
        resolved = true;
        clearTimeout(timer);
        observer.disconnect();
        el.innerHTML = html;
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function normalizeUrl(u) {
    if (!u) return "";
    return String(u).toLowerCase().trim().replace(/\/$/, "");
  }

  // Store data localized in tag: normalized site_url -> { site_url, brands }
  var storeByUrl = {
    "https://www.murraychevrolet.ca": {
      site_url: "https://www.murraychevrolet.ca/",
      brands: ["Chevrolet"],
    },
    "https://www.murraychevbrandon.com": {
      site_url: "https://www.murraychevbrandon.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murraygmc.com": {
      site_url: "https://www.murraygmc.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murraykiaabbotsford.com": {
      site_url: "https://www.murraykiaabbotsford.com/",
      brands: ["Kia"],
    },
    "https://www.brandonchrysler.ca": {
      site_url: "https://www.brandonchrysler.ca/",
      brands: ["Chrysler", "Dodge", "Jeep", "RAM"],
    },
    "https://www.murrayhyundaiwhiterock.com": {
      site_url: "https://www.murrayhyundaiwhiterock.com/",
      brands: [],
    },
    "http://www.marshallusedcars.ca": {
      site_url: "http://www.marshallusedcars.ca",
      brands: [],
    },
    "https://www.murrayhyundai.com": {
      site_url: "https://www.murrayhyundai.com/",
      brands: ["Hyundai"],
    },
    "https://www.murraymazda.ca": {
      site_url: "https://www.murraymazda.ca/",
      brands: ["Mazda"],
    },
    "https://www.murraychev.ca": {
      site_url: "https://www.murraychev.ca/",
      brands: ["Chevrolet"],
    },
    "https://www.murraygm.com": {
      site_url: "https://www.murraygm.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murraychev.com": {
      site_url: "https://www.murraychev.com/",
      brands: ["Chevrolet"],
    },
    "https://www.deancooleygm.ca": {
      site_url: "https://www.deancooleygm.ca/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murraygmmerritt.com": {
      site_url: "https://www.murraygmmerritt.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murraychryslerwestman.com": {
      site_url: "https://www.murraychryslerwestman.com/",
      brands: ["Chrysler", "Dodge", "Jeep", "RAM"],
    },
    "https://www.littlechevrolet.ca": {
      site_url: "https://www.littlechevrolet.ca/",
      brands: [],
    },
    "https://www.murraydodgeyarmouth.ca": {
      site_url: "https://www.murraydodgeyarmouth.ca/",
      brands: [],
    },
    "https://www.murraygmabbotsford.com": {
      site_url: "https://www.murraygmabbotsford.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murrayhonda.ca": {
      site_url: "https://www.murrayhonda.ca/",
      brands: ["Honda"],
    },
    "https://www.cdmc.ca": {
      site_url: "https://www.cdmc.ca/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murrayjeepram.ca": {
      site_url: "https://www.murrayjeepram.ca/",
      brands: ["Chrysler", "Dodge", "Jeep", "RAM"],
    },
    "https://www.murraydunngm.com": {
      site_url: "https://www.murraydunngm.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murraydodgeram.ca": {
      site_url: "https://www.murraydodgeram.ca/",
      brands: ["Chrysler", "Dodge", "Jeep", "RAM"],
    },
    "https://www.dunnramtrucks.ca": {
      site_url: "https://www.dunnramtrucks.ca/",
      brands: ["Chrysler", "Dodge", "Jeep", "RAM"],
    },
    "https://www.murrayhyundaimedicinehat.com": {
      site_url: "https://www.murrayhyundaimedicinehat.com/",
      brands: ["Hyundai"],
    },
    "https://www.murraychryslerokotoks.ca": {
      site_url: "https://www.murraychryslerokotoks.ca/",
      brands: ["Chrysler", "Dodge", "Jeep", "RAM"],
    },
    "https://murrayfinancial.ca": {
      site_url: "https://murrayfinancial.ca/",
      brands: [],
    },
    "https://www.murraygmpenticton.ca": {
      site_url: "https://www.murraygmpenticton.ca/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.mclaughlingm.com": {
      site_url: "https://www.mclaughlingm.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.murrayestevan.com": {
      site_url: "https://www.murrayestevan.com/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://wpgcarloans.ca": {
      site_url: "https://wpgcarloans.ca/",
      brands: [],
    },
    "https://www.southlandhonda.com": {
      site_url: "https://www.southlandhonda.com/",
      brands: ["Honda"],
    },
    "https://murrayautofinanceab.ca": {
      site_url: "https://murrayautofinanceab.ca/",
      brands: [],
    },
    "https://www.greatnorthgm.ca": {
      site_url: "https://www.greatnorthgm.ca/",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://cantinautos.ca": {
      site_url: "https://cantinautos.ca/",
      brands: [],
    },
    "https://wpgautofinance.ca": {
      site_url: "https://wpgautofinance.ca/",
      brands: [],
    },
    "https://norwestautos.ca": {
      site_url: "https://norwestautos.ca/",
      brands: [],
    },
    "https://murraycreditfsj.ca": {
      site_url: "https://murraycreditfsj.ca/",
      brands: [],
    },
    "https://valuemycar.ca": { site_url: "https://valuemycar.ca", brands: [] },
    "https://www.dauphinford.ca": {
      site_url: "https://www.dauphinford.ca",
      brands: ["Ford"],
    },
    "https://winnipegautovalue.ca": {
      site_url: "https://winnipegautovalue.ca",
      brands: [],
    },
    "https://sellmycarmedhat.ca": {
      site_url: "https://sellmycarmedhat.ca/",
      brands: [],
    },
    "https://sellmycarabbotsford.ca": {
      site_url: "https://sellmycarabbotsford.ca",
      brands: [],
    },
    "https://www.lethbridgetrucktown.ca": {
      site_url: "https://www.lethbridgetrucktown.ca/",
      brands: [],
    },
    "https://www.cochranegm.com": {
      site_url: "https://www.cochranegm.com",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://www.shaganappi.com": {
      site_url: "https://www.shaganappi.com",
      brands: ["GMC", "Buick", "Chevrolet"],
    },
    "https://genesiswinnipeg.ca": {
      site_url: "https://genesiswinnipeg.ca/",
      brands: [],
    },
    "https://www.murraymaplecreek.ca": {
      site_url: "https://www.murraymaplecreek.ca/",
      brands: [],
    },
    "https://www.virdenchrysler.ca": {
      site_url: "https://www.virdenchrysler.ca/",
      brands: [],
    },
  };

  function searchStore(hostNoWww) {
    if (!hostNoWww) return null;
    var candidates = [
      "https://www." + hostNoWww + "/",
      "https://" + hostNoWww + "/",
      "http://www." + hostNoWww + "/",
      "http://" + hostNoWww + "/",
    ];
    for (var i = 0; i < candidates.length; i++) {
      var key = normalizeUrl(candidates[i]);
      if (storeByUrl[key]) return storeByUrl[key];
    }
    return null;
  }

  var hostNoWww = (function () {
    var host = window.location.hostname || "";
    host = String(host).toLowerCase().trim().split(":")[0];
    if (host.indexOf("www.") === 0) host = host.slice(4);
    return host;
  })();

  var candidates = hostNoWww
    ? [
        "https://www." + hostNoWww + "/",
        "https://" + hostNoWww + "/",
        "http://www." + hostNoWww + "/",
        "http://" + hostNoWww + "/",
      ]
    : [];

  var incomingHref = String(window.location.href || "");

  if (!hostNoWww) {
    pushDL({
      event: "sb_store_brands_loaded",
      sb_incoming_href: incomingHref || null,
      sb_found: false,
      sb_error: "Missing window.location.hostname",
    });
    return;
  }

  var row = searchStore(hostNoWww);

  if (!row) {
    pushDL({
      event: "sb_store_brands_loaded",
      sb_incoming_href: incomingHref,
      sb_candidates: candidates,
      sb_found: false,
      sb_error: "No matching row for any candidate site_url",
    });
    return;
  }

  var brandsRaw = row.brands;
  var brands = Array.isArray(brandsRaw)
    ? brandsRaw.filter(function (x) {
        return x != null && String(x).trim() !== "";
      })
    : brandsRaw != null && String(brandsRaw).trim() !== ""
      ? [String(brandsRaw)]
      : [];

  function done(htmlConcatenated) {
    pushDL({
      event: "sb_store_brands_loaded",
      sb_incoming_href: incomingHref,
      sb_candidates: candidates,
      sb_found: true,
      sb_store_site_url: row.site_url || null,
      sb_brands: brands,
      sb_primary_brand: brands[0] || null,
      sb_brands_string: brands.join(", "),
      sb_html_concatenated: htmlConcatenated || "",
    });
    injectContent(htmlConcatenated || "");
  }

  if (brands.length === 0) {
    done("");
    return;
  }

  function loadSupabase(cb) {
    if (window.supabase && window.supabase.createClient) return cb(null);
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.async = true;
    s.onload = function () {
      cb(null);
    };
    s.onerror = function () {
      cb(new Error("Failed to load supabase-js"));
    };
    document.head.appendChild(s);
  }

  function fetchHtmlForBrands(client, brandList, cb) {
    if (!brandList || brandList.length === 0) return cb(null, "");
    function processRes(res, cb2) {
      if (res && res.error) {
        console.warn(
          "[GTM][Brands] seo_html_list:",
          res.error.message || res.error,
        );
        return cb2(res.error, null);
      }
      var makeToHtml = {};
      ((res && res.data) || []).forEach(function (r) {
        makeToHtml[r.make] = r.html || "";
      });
      var htmlStr = brandList
        .map(function (m) {
          return makeToHtml[m] || "";
        })
        .join("");
      cb2(null, htmlStr);
    }
    client
      .schema("crm")
      .from("seo_html_list")
      .select("make, html")
      .in("make", brandList)
      .then(function (res) {
        processRes(res, cb);
      })
      .catch(function (e) {
        console.warn("[GTM][Brands] seo_html_list:", e);
        cb(e, null);
      });
  }

  loadSupabase(function (err) {
    if (err) {
      console.warn("[GTM][Brands] loadSupabase:", err);
      pushDL({
        event: "sb_store_brands_loaded",
        sb_incoming_href: incomingHref,
        sb_candidates: candidates,
        sb_found: true,
        sb_store_site_url: row.site_url,
        sb_brands: brands,
        sb_primary_brand: brands[0] || null,
        sb_brands_string: brands.join(", "),
        sb_html_concatenated: "",
        sb_error: String(err),
      });
      return;
    }
    var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    fetchHtmlForBrands(client, brands, function (qerr, htmlStr) {
      if (qerr) {
        console.warn("[GTM][Brands] fetch:", qerr);
        pushDL({
          event: "sb_store_brands_loaded",
          sb_incoming_href: incomingHref,
          sb_candidates: candidates,
          sb_found: true,
          sb_store_site_url: row.site_url,
          sb_brands: brands,
          sb_primary_brand: brands[0] || null,
          sb_brands_string: brands.join(", "),
          sb_html_concatenated: "",
          sb_error: String(qerr.message || qerr),
        });
        return;
      }
      done(htmlStr || "");
    });
  });
})();
