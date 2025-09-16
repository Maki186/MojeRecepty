<artifact identifier="awesome-readme" type="text/markdown" title="README.md - MojeRecepty">
# 🍲 MojeRecepty
<p><image-card alt="Vue.js" src="https://img.shields.io/badge/Vue.js-4F46E5?logo=vue.js"></image-card> <image-card alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3B82F6?logo=tailwind-css"></image-card> <image-card alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase"></image-card> <image-card alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?logo=vercel"></image-card></p>
<p><strong>MojeRecepty</strong> je osobní webová aplikace, která uchovává a sdílí recepty od mé mámy a babičky. 🌟 Je navržená pro jednoduché přidávání, vyhledávání a prohlížení receptů – ideální pro vaření na mobilu nebo plánování na notebooku. Aplikace synchronizuje data přes Firebase, takže recepty jsou vždy po ruce, ať jsi kdekoliv.</p>
<p>Tento projekt jsem vytvořila, abych zachovala rodinné tradice v kuchyni. Každý recept je plný lásky a historek – od klasických českých knedlíků po tajné dezerty. 😊</p>
<h2>✨ Funkce</h2>
<ul>
<li><strong>Přidávání receptů</strong>: Jednoduchý formulář pro název, ingredience (oddělené čárkami) a kroky. Automaticky se synchronizuje do cloudu.</li>
<li><strong>Seznam receptů</strong>: Responsivní grid s kartami – snadno prohlížej na mobilu během vaření.</li>
<li><strong>Vyhledávání a filtry</strong>: Rychlé hledání podle názvu nebo ingrediencí (plánováno na rozšíření).</li>
<li><strong>Synchronizace mezi zařízeními</strong>: Díky Firebase Firestore jsou recepty dostupné na notebooku i mobilu – bez složité autentizace (anonymní přihlášení).</li>
<li><strong>Mobilní-friendly</strong>: Plně responsivní design s Tailwind CSS, optimalizovaný pro vaření v kuchyni.</li>
<li><strong>Offline podpora</strong>: Základní načítání z cache (díky Firebase).</li>
</ul>
<h2>🛠 Technologie</h2>

























<table><thead><tr><th>Frontend</th><th>Backend/Database</th><th>Build &#x26; Deploy</th></tr></thead><tbody><tr><td>Vue.js 3 + Vite</td><td>Firebase Firestore (pro synchronizaci)</td><td>Vercel (pro hosting)</td></tr><tr><td>Pinia (state management)</td><td>Firebase Authentication (anonymní)</td><td>GitHub Actions (CI/CD)</td></tr><tr><td>Tailwind CSS (styling)</td><td>-</td><td>-</td></tr></tbody></table>
<p>Proč tyto tech? Vue je rychlé a intuitivní, Firebase je zdarma pro malé appky a zajišťuje synchronizaci bez serveru. Všechno je nastavené pro rychlý vývoj s AI nástroji jako Cursor.</p>
<h2>🚀 Rychlý start</h2>
<h3>Předpoklady</h3>
<ul>
<li>Node.js (v18+)</li>
<li>Git</li>
<li>Účet na <a href="https://console.firebase.google.com/">Firebase Console</a> (zdarma)</li>
<li>Účet na <a href="https://vercel.com/">Vercel</a> (zdarma pro osobní projekty)</li>
</ul>
<h3>Instalace</h3>
<ol>
<li><strong>Naklonuj repozitář</strong>:
<pre><code class="language-bash">git clone https://github.com/tvoje-username/MojeRecepty.git
cd MojeRecepty
</code></pre>
</li>
<li><strong>Nainstaluj závislosti</strong>:
<pre><code class="language-bash">npm install
</code></pre>
</li>
<li><strong>Nastav Firebase</strong>:
<ul>
<li>Vytvoř projekt na Firebase Console.</li>
<li>Povol Firestore a Authentication (anonymní).</li>
<li>Zkopíruj <code>firebaseConfig</code> do <code>src/firebase.js</code> (nahraď placeholder hodnoty).</li>
<li>Nastav Firestore pravidla (viz níže pro bezpečnost).</li>
</ul>
</li>
<li><strong>Spusť lokálně</strong>:
<pre><code class="language-bash">npm run dev
</code></pre>
Otevři <a href="http://localhost:5173">http://localhost:5173</a> a začni přidávat recepty!</li>
</ol>
<h3>Nasazení na Vercel</h3>
<ol>
<li>Pushni změny na GitHub: <code>git push origin main</code>.</li>
<li>Na Vercel: <strong>New Project</strong> → Import z GitHubu → Nastav Environment Variables (VITE_FIREBASE_* z tvého configu).</li>
<li>Deploy – hotovo! Získej URL jako <code>moje-recepty.vercel.app</code>.</li>
</ol>
<h2>📱 Použití</h2>
<ul>
<li><strong>Přidání receptu</strong>: Jdi na <code>/add</code>, vyplň formulář a ulož – synchronizuje se okamžitě.</li>
<li><strong>Prohlížení</strong>: Na homepage uvidíš seznam. Klikni na kartu pro detail (plánováno: fotky a čas přípravy).</li>
<li><strong>Na mobilu</strong>: Přidej na home screen pro app-like zážitek.</li>
</ul>
<p>Příklad receptu (automaticky načtený):</p>
<ul>
<li><strong>Název</strong>: Babiččiny palačinky</li>
<li><strong>Ingredience</strong>: Mouka, mléko, vejce, cukr</li>
<li><strong>Kroky</strong>: 1. Smíchej těsto. 2. Smaž na pánvi. 3. Posyp cukrem. Dobrou chuť! 🍳</li>
</ul>
<h2>🔒 Bezpečnost a soukromí</h2>
<ul>
<li>Data jsou vázána na anonymní uživatele (nikdo jiný k nim nemá přístup).</li>
<li>Firestore pravidla (nastav v Console):
<pre><code>rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read, write: if request.auth != null &#x26;&#x26; request.auth.uid == resource.data.userId;
    }
  }
}
</code></pre>
</li>
<li>App je privátní – sdílej URL jen s sebou. Žádné cookies ani tracking.</li>
</ul>
<h2>📈 Plány a roadmap</h2>
<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" disabled> Přidání fotek k receptům (Firebase Storage).</li>
<li class="task-list-item"><input type="checkbox" disabled> Pokročilé filtry (např. podle diet: vegetariánské).</li>
<li class="task-list-item"><input type="checkbox" disabled> Export do PDF pro tisk.</li>
<li class="task-list-item"><input type="checkbox" disabled> Offline režim s PWA (Service Worker).</li>
<li class="task-list-item"><input type="checkbox" disabled> Integrace s externími API (např. nutriční info).</li>
</ul>
<p>Pokud chceš přispět, otevři issue nebo PR! 🌍</p>
<h2>📞 Kontakt a podpora</h2>
<ul>
<li><strong>Autorka</strong>: Markéta Nedělová</li>
<li><strong>Licence</strong>: MIT – volně používej a sdílej rodinné recepty.</li>
<li><strong>Otázky?</strong> Piš na email nebo v issues. Děkuji mámě a babičce za inspiraci! ❤️</li>
</ul>
<hr>
<p><em>Vyvinuto s láskou v Cursor AI a Vue.js. Poslední aktualizace: Září 2025.</em>
</p>
