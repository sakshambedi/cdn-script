(function () {
  console.log("[dyn-blog][init] Tag started");

  function getParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]+)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }

  function loadSupabase(cb) {
    if (window.supabase && window.supabase.createClient) {
      console.log("[dyn-blog][load-supabase] supabase-js already present");
      return cb(null);
    }
    console.log("[dyn-blog][load-supabase] Loading supabase-js...");
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.async = true;
    s.onload = function () {
      console.log("[dyn-blog][load-supabase] supabase-js loaded");
      cb(null);
    };
    s.onerror = function () {
      cb(new Error("Failed to load supabase-js"));
    };
    document.head.appendChild(s);
  }

  function injectTitle(title) {
    if (!title) return;

    var titleSelectors = [".page-title h1 span", ".page__title"];
    var titleElement = null;
    var usedSelector = null;

    for (var i = 0; i < titleSelectors.length; i++) {
      titleElement = document.querySelector(titleSelectors[i]);
      if (titleElement) {
        usedSelector = titleSelectors[i];
        console.log(
          "[dyn-blog][inject-title] Title element found with selector:",
          usedSelector,
        );
        break;
      }
    }

    if (titleElement) {
      console.log("[dyn-blog][inject-title] Updating title block");
      titleElement.textContent = title;
    } else {
      console.log(
        "[dyn-blog][inject-title] Title element not found. Tried selectors:",
        titleSelectors.join(", "),
      );
    }

    // Update browser tab title as well
    document.title = title;
  }

  function injectContent(html) {
    if (!html) return;

    var selectors = [".primary-wrapper .primary.col", ".page__content"];
    var container = null;
    var usedSelector = null;

    for (var i = 0; i < selectors.length; i++) {
      container = document.querySelector(selectors[i]);
      if (container) {
        usedSelector = selectors[i];
        console.log(
          "[dyn-blog][inject-content] Container found with selector:",
          usedSelector,
        );
        break;
      }
    }

    if (container) {
      console.log("[dyn-blog][inject-content] Injecting HTML content");
      container.innerHTML = html;
    } else {
      console.log(
        "[dyn-blog][inject-content] Content container not found. Tried selectors:",
        selectors.join(", "),
      );
    }
  }

  function pushDL(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    console.log("[dyn-blog][data-layer] dataLayer push:", payload);
  }

  var slug = getParam("slug");
  console.log("[dyn-blog][init] slug:", slug);

  if (!slug) {
    pushDL({
      event: "sb_seo_loaded",
      sb_slug: null,
      sb_found: false,
      sb_error: "Missing slug param",
    });
    return;
  }

  loadSupabase(function (err) {
    if (err) {
      console.log("[dyn-blog][load-supabase] load error:", err);
      pushDL({
        event: "sb_seo_loaded",
        sb_slug: slug,
        sb_found: false,
        sb_error: String(err),
      });
      return;
    }

    try {
      console.log("[dyn-blog][supabase-client] Creating client");
      var client = window.supabase.createClient(
        "https://qtdmojmizwncsmdspbgk.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZG1vam1penduY3NtZHNwYmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODcyNzcsImV4cCI6MjAyMTI2MzI3N30.XVcYZ50zyYUh4uHdGcBZaP0fumIt9vF58K_D4_G8sk4",
      );

      console.log("[dyn-blog][query] Querying crm.seo_pages for slug:", slug);

      client
        .schema("crm")
        .from("seo_pages")
        .select("title, html")
        .eq("slug", slug)
        .maybeSingle()
        .then(function (res) {
          console.log("[dyn-blog][query] query response:", res);

          var row = res && res.data ? res.data : null;
          var qerr = res && res.error ? res.error : null;

          if (qerr || !row) {
            pushDL({
              event: "sb_seo_loaded",
              sb_slug: slug,
              sb_found: false,
              sb_error: qerr ? String(qerr.message || qerr) : "No matching row",
            });
            return;
          }

          // Inject into the specific blocks you asked for
          // (Some themes render late; a tiny delay makes it more reliable.)
          setTimeout(function () {
            injectTitle(row.title);
            injectContent(row.html);
          }, 50);

          // Push to dataLayer for other tags
          pushDL({
            event: "sb_seo_loaded",
            sb_slug: slug,
            sb_found: true,
            sb_title: row.title || null,
          });

          console.log("[dyn-blog][complete] SEO content injected");
        })
        .catch(function (e) {
          console.log("[dyn-blog][query] query exception:", e);
          pushDL({
            event: "sb_seo_loaded",
            sb_slug: slug,
            sb_found: false,
            sb_error: String(e),
          });
        });
    } catch (e2) {
      console.log("[dyn-blog][error] Exception:", e2);
      pushDL({
        event: "sb_seo_loaded",
        sb_slug: slug,
        sb_found: false,
        sb_error: String(e2),
      });
    }
  });
})();
