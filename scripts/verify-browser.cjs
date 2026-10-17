// Run with the Playwright CLI: run-code --filename scripts/verify-browser.cjs
// Requires local Astro preview on :4322 and dev on :4321. All POSTs are mocked.
async (page) => {
  const base = 'http://127.0.0.1:4322';
  const report = [];
  const capture = false; // Set true for one batched desktop/mobile screenshot pass.
  const check = (value, message) => { if (!value) throw new Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.context().unroute('**/*');
  await page.context().addInitScript(() => {
    if (window.__peakCapture) return;
    window.__peakCapture = true;
    window.__peakEvents = [];
    window.addEventListener('peak:interaction', event => window.__peakEvents.push(event.detail));
  });
  // Fail closed: never forward a POST, even if a test accidentally leaves localhost.
  let mode = 'hold';
  let posts = 0;
  let bodies = [];
  let release;
  let arrival;
  await page.context().route('**/*', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    check(new URL(route.request().url()).origin === base, 'Unexpected POST origin');
    posts++;
    bodies.push(new URLSearchParams(route.request().postData()));
    if (mode === 'hold') return new Promise(resolve => { release = async () => { await route.fulfill({status:500,body:'Simulated failure'}); resolve(); }; arrival(); });
    if (mode === 'network') return route.abort('failed');
    return route.fulfill({status:200,body:'Simulated receipt, no real submission'});
  });
  try {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base);
  await page.getByRole('heading', {name:'Geef je team ruimte. Laat AI het voorwerk doen.'}).waitFor();
  await page.keyboard.press('Tab');
  check(await page.locator('.skip-link').evaluate(el => el === document.activeElement), 'Skip link not first in tab order');
  await page.keyboard.press('Enter');
  check(await page.locator('main').evaluate(el => el === document.activeElement), 'Skip link does not focus content');
  for (const img of await page.locator('img[loading=lazy]').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(el => el.decode()); }
  await page.locator('main').evaluate(el => el.blur());
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({top:0,behavior:'instant'}); });
  if (capture) await page.screenshot({path:'output/playwright/home-desktop.png',fullPage:true});
  if (capture) await page.screenshot({path:'output/playwright/hero-desktop.png'});
  if (capture) await page.locator('#contact').screenshot({path:'output/playwright/contact-desktop.png',style:'.site-header,.skip-link {visibility:hidden}'});
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow at '+width);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.locator('h1').evaluate(el => getComputedStyle(el).animationName === 'none'), 'Reduced motion ignored');
  await page.emulateMedia({reducedMotion:'no-preference'});
  const question = page.locator('.faq-list summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  check(await question.evaluate(el => el.parentElement.open), 'FAQ keyboard interaction failed');
  await page.keyboard.press('Enter');
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  for (const img of await page.locator('img[loading=lazy]').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(el => el.decode()); }
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({top:0,behavior:'instant'}); });
  if (capture) await page.screenshot({path:'output/playwright/home-mobile.png',fullPage:true});
  if (capture) await page.screenshot({path:'output/playwright/hero-mobile.png'});
  if (capture) await page.locator('#contact').screenshot({path:'output/playwright/contact-mobile.png',style:'.site-header,.skip-link {visibility:hidden}'});
  const menu = page.getByRole('button',{name:'Menu'});
  await menu.focus();
  await page.keyboard.press('Enter');
  check(await menu.getAttribute('aria-expanded') === 'true', 'Mobile menu did not open');
  await page.keyboard.press('Escape');
  check(await menu.getAttribute('aria-expanded') === 'false', 'Escape did not close menu');
  check(await menu.evaluate(el => el === document.activeElement), 'Escape did not restore menu focus');
  await menu.click();
  await page.locator('nav a[href="#contact"]').click();
  check(new URL(page.url()).hash === '#contact', 'Primary CTA does not reach inline form');
  check(await menu.getAttribute('aria-expanded') === 'false', 'Anchor did not close menu');
  check((await page.evaluate(() => window.__peakEvents)).filter(e => e.name === 'primary_cta_click').length === 1, 'Duplicate CTA event');
  report.push('Desktop/mobile 320–1440px, anchors, keyboard skip/menu/FAQ, reduced motion');

  for (const path of ['/', '/contact']) {
    await page.goto(base+path+'?interesse=agentic-automatisering&utm_source=test-source&utm_medium=test-medium&utm_campaign=test-campaign');
    const form = page.locator('form');
    const submit = form.locator('button[type=submit]');
    check(await form.locator(':required').count() === 3, 'Unexpected required fields');
    const prior = posts;
    await submit.click();
    check(posts === prior, 'Invalid form submitted');
    check(await page.locator('#name').evaluate(el => el.validationMessage === 'Vul je naam in.'), 'Name validation message missing');
    await page.locator('#name').fill('LOKALE TEST');
    await page.locator('#email').fill('invalid');
    await submit.click();
    check(posts === prior, 'Invalid email submitted');
    check((await page.locator('#email').evaluate(el => el.validationMessage)).includes('geldig e-mailadres'), 'Email validation message missing');
    await page.locator('#email').fill('local-test@example.invalid');
    await page.locator('#context').fill('LOKALE TEST: offertevoorbereiding. Niet verzonden.');
    check(await page.locator('#interest').inputValue() === 'agentic-automatisering', 'Interest preselection broken');
    mode = 'hold';
    release = undefined;
    const arrived = new Promise(resolve => { arrival = resolve; });
    await submit.click();
    await arrived;
    await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') === 'true');
    check(await submit.isDisabled(), 'Pending submit not disabled');
    await form.evaluate(el => el.requestSubmit());
    await release();
    await page.locator('#form-error').waitFor({state:'visible'});
    check(posts === prior+1, 'Duplicate pending submission');
    check(await page.locator('#form-success').isHidden(), 'Failure displayed success');
    check(await page.locator('#context').inputValue() === 'LOKALE TEST: offertevoorbereiding. Niet verzonden.', 'Failure cleared input');
    check(await page.locator('#form-error').evaluate(el => el === document.activeElement), 'Failure not focused');
    check(await submit.isEnabled(), 'Retry not enabled');
    if (capture && path === '/') await page.locator('#contact').screenshot({path:'output/playwright/form-error-mobile.png'});
    mode = 'network';
    await submit.click();
    await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') !== 'true');
    check(await page.locator('#form-success').isHidden(), 'Network error displayed success');
    check(posts === prior+2, 'Network error request not intercepted');
    mode = 'success';
    await submit.click();
    await page.locator('#form-success').waitFor({state:'visible'});
    check(await form.isHidden(), 'Confirmed success did not replace form');
    check(await page.locator('#form-success').evaluate(el => el === document.activeElement), 'Success not focused');
    const last = bodies[bodies.length-1];
    check(last.get('form-name') === 'wf-form-Formulier', 'Form name changed');
    check(last.get('bot-field') === '', 'Honeypot missing');
    for (const [key,value] of [['utm_source','test-source'],['utm_medium','test-medium'],['utm_campaign','test-campaign']]) check(last.get(key) === value, 'Campaign field missing: '+key);
    const events = await page.evaluate(() => window.__peakEvents);
    check(events.filter(e => e.name === 'form_success').length === 1, 'Duplicate or missing form success event');
    check(events.filter(e => e.name === 'form_error').length === 2, 'Duplicate or missing form error event');
    check(!JSON.stringify(events).match(/example.invalid|LOKALE|test-source|test-campaign|utm_/), 'Personal data or UTM in analytics');
    if (capture && path === '/') await page.locator('#contact').screenshot({path:'output/playwright/form-success-mobile.png'});
    report.push(path+': validation, HTTP/network failure, preserved input, pending/duplicate protection, retry, confirmed success, focus, UTM and events');
  }
  for (const route of ['/diensten','/cases','/cases/offertevoorbereiding','/cases/projectopvolging','/cases/verkoopsignalen','/contact','/privacy']) {
    const response = await page.goto(base+route);
    check(response.ok(), 'Route failed: '+route);
    check(await page.locator('h1').count() === 1, 'Invalid heading structure: '+route);
    if (route === '/cases/verkoopsignalen') check((await page.locator('main').innerText()).includes('In ontwikkeling'), 'Development status missing');
  }
  await page.goto(base+'/?content-preview=1');
  check(await page.locator('.preview-content').count() === 0, 'Production preview exposed placeholders');
  await page.goto('http://127.0.0.1:4321/');
  check(await page.locator('.preview-slot').count() >= 4, 'Development content preview missing');
  check(await page.locator('.testimonial-placeholder').count() === 1, 'Review preview missing');
  report.push('Preserved routes, development status, dev-only placeholders and hidden production review section');

  const nojs = await page.context().browser().newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  let nativePosts = 0;
  try {
  const native = await nojs.newPage();
  await nojs.route('**/*', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    check(new URL(route.request().url()).origin === base, 'Unexpected no-JS POST origin');
    nativePosts++;
    const body = new URLSearchParams(route.request().postData());
    check(body.get('form-name') === 'wf-form-Formulier', 'No-JS form contract broken');
    return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="nl"><title>Lokale test</title><h1>Gesimuleerde ontvangst</h1></html>'});
  });
  for (const route of ['/', '/contact']) {
    await native.goto(base+route);
    check(await native.locator('nav').isVisible(), 'No-JS navigation hidden');
    check(await native.locator('form').isVisible(), 'No-JS form missing');
    check(await native.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No-JS overflow');
    if (route === '/') {
      check(await native.locator('.bento-link').count() === 3, 'No-JS featured cases missing');
      await native.locator('.faq-list summary').first().click();
      check(await native.locator('.faq-list details').first().getAttribute('open') !== null, 'No-JS FAQ broken');
      if (capture) await native.screenshot({path:'output/playwright/nojs-mobile.png',fullPage:true});
    }
    await native.locator('#name').fill('LOKALE TEST ZONDER JS');
    await native.locator('#email').fill('local-test@example.invalid');
    await native.locator('#context').fill('Volledig onderschepte test.');
    await native.getByRole('button',{name:'Verstuur je bericht'}).focus();
    await native.keyboard.press('Enter');
    await native.getByRole('heading',{name:'Gesimuleerde ontvangst'}).waitFor();
  }
  check(nativePosts === 2, 'Unexpected native POST count');
  } finally { await nojs.close(); }
  check(errors.length === 0, 'Browser errors: '+errors.join(', '));
  report.push('HTML content, navigation, FAQ and mocked native POST without JavaScript on both contact routes');
  await page.goto(base);
  return {passed:report,interceptedPosts:posts+nativePosts,browserErrors:errors};
  } finally { await page.context().unroute('**/*'); }
}
