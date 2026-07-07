NEO AUTOMATION — BACKEND UPDATE (upload to your cPanel Node.js app)
====================================================================

WHAT THIS IS
------------
Updated backend that adds X-HTTP-Method-Override support so the admin panel's
save/update/delete (PUT/PATCH/DELETE) can tunnel over POST. The only code that
changed is dist/index.js.

WHERE IT GOES
-------------
Your Node app folder on the server, i.e. the "neo_website_backend" folder
(the same place that already has your dist/, package.json, node_modules, .env).

HOW TO UPLOAD
-------------
1. Upload the contents of THIS folder into your neo_website_backend folder,
   OVERWRITING the existing files.
   (At minimum you only NEED to replace: dist/index.js — that's the only file
    that changed. Uploading the rest is harmless.)

2. cPanel -> Setup Node.js App -> your app -> RESTART.

*** DO NOT UPLOAD A .env FILE ***
--------------------------------
This package intentionally does NOT include .env. Your server's existing .env
holds your real DB password, CORS_ORIGIN, PASSENGER_BASE_URI, and JWT_SECRET.
Keep it exactly as-is. If you overwrite it, the site breaks.

NO npm install NEEDED
---------------------
No new dependencies were added, so your existing node_modules on the server
works fine. Do NOT delete node_modules.

VERIFY AFTER RESTART
--------------------
Open in a browser:  https://cidev.in/neo_website_backend/api/health
It should show:     {"ok":true,"service":"neo-automation-api"}

IMPORTANT — IF SAVING A PRODUCT STILL FAILS WITH "302 Found"
------------------------------------------------------------
That 302 is NOT from this app (Express never sends a redirect). It is your
host's firewall (ModSecurity) blocking the request body. To fix:

  cPanel -> Security -> ModSecurity -> find cidev.in -> turn it OFF -> test save.

Better (keeps security on): cPanel -> Metrics -> Errors, reproduce the failed
save, copy the "ModSecurity: Access denied ... [id "NNNNNN"]" line, and send it
to me for a surgical whitelist instead of a full disable.

OPTIONAL BUT RECOMMENDED (security)
-----------------------------------
In your server .env, change JWT_SECRET from the placeholder to a long random
string, then restart the app. Suggested value already generated for you:
JWT_SECRET=v3CVZUNJ8FPR7b7IA8512T4xZbdgcny48U4LM4elmbXRpPo5MTLdWVkASjrlt_vN
