# Deploying Currency Converter to GitHub Pages with a custom domain

The app is configured to keep working at `https://arjunn-git.github.io/currency/` by default. Do not change DNS or add a `CNAME` file until you have purchased/selected the exact domain.

## 1. Choose the domain

Buy or use a domain you own, for example `www.example.com`. Replace that example with your actual domain in the steps below. GitHub Pages cannot configure a domain you do not control.

## 2. Configure the domain in GitHub

In the repository, open **Settings → Pages → Custom domain**, enter your exact domain, and save it. Follow the DNS records GitHub displays for your chosen apex (`example.com`) or `www` hostname. DNS record values depend on which hostname you choose; do not copy records from an unrelated domain. Enable **Enforce HTTPS** after DNS verification becomes available.

## 3. Build assets for the domain root

The Vite config supports a `VITE_BASE_PATH` environment variable. For the existing project URL, leave it unset (default `/currency/`). For a custom domain, build with the base `/`.

PowerShell:

```powershell
$env:VITE_BASE_PATH = "/"
npm.cmd run build
Remove-Item Env:VITE_BASE_PATH
```

If deploying through GitHub Actions, configure `VITE_BASE_PATH=/` in the build job's environment. If you use the `gh-pages` script from a local terminal, set the variable for that same terminal session before running the deploy command.

## 4. Add the CNAME file

Create `public/CNAME` containing only your exact hostname, for example `www.example.com`. Do not include `https://`, a path, or a trailing slash. Commit this file after choosing your domain. Vite will copy it into the build output.

## 5. Verify before announcing the launch

- Open the custom domain over HTTPS.
- Confirm the background image, favicon, JavaScript and CSS load without 404s.
- Convert at least USD → INR, EUR → USD and GBP → INR.
- Swap the currencies and verify the result changes correctly.
- Turn off the network and refresh to confirm the saved-rate warning is clear.
- Check browser developer tools for failed requests or console errors.
- Confirm the repository's Pages source/workflow is publishing the latest `dist` output.

## Exchange-rate freshness note

The selected public endpoint supplies provider update timestamps and is cached locally for 30 minutes to reduce repeat requests. Rates are reference exchange rates and may not match the final rate or fees offered by a bank, card network or money-transfer provider. If the provider is unreachable, the app can show previously saved rates with a warning.
