# MojeRecepty

Soukroma webova aplikace pro ukladani rodinnych receptu. Frontend je postaveny jako SPA ve Vue 3 a data i prihlaseni obsluhuje Supabase.

## Aktualni stack

- `Vue 3`
- `Vite`
- `Vue Router`
- `Pinia`
- `Vuetify`
- `Tailwind CSS`
- `Supabase`

## Struktura projektu

Samotna aplikace je ve slozce `app/`.

- `app/src/main.js` - vstupni bod aplikace
- `app/src/router/index.js` - trasy a auth guard
- `app/src/stores/auth.js` - prihlaseni uzivatele
- `app/src/stores/recipes.js` - nacitani a sprava receptu
- `app/src/views/` - jednotlive obrazovky aplikace
- `app/src/lib/supabase.js` - inicializace Supabase klienta

V koreni repozitare je pouze pomocny `package.json`. Vyvojove skripty jsou definovane v `app/package.json`.

## Funkce

- seznam receptu s filtrovani podle kategorii
- detail receptu s prepocitem porci
- pridani noveho receptu
- uprava a smazani receptu
- prihlaseni pres e-mail a heslo
- synchronizace dat pres Supabase

## Lokalni spusteni

Pozor: `npm run dev` v koreni projektu nefunguje, protoze `dev` script je definovany jen ve slozce `app`.

### Varianta 1

```bash
cd app
npm install
npm run dev
```

### Varianta 2

```bash
npm --prefix app install
npm --prefix app run dev
```

Po spusteni bude aplikace dostupna typicky na `http://localhost:5173`. Pokud je port obsazeny, Vite pouzije jiny, napriklad `5174`.

## Build

```bash
npm --prefix app run build
```

Vystup se generuje do `app/dist`.

## Environment promenne

Frontend ocekava tyto promenne v `app/.env`:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Pouzivej pouze anonymni klic urceny pro frontend. Service role key do klienta nepatri.

## Datovy model

Aplikace pracuje s tabulkou `recipes` v Supabase. V kodu se pouzivaji zejmena tato pole:

- `id`
- `user_id`
- `title`
- `description`
- `categories`
- `minutes`
- `servings`
- `ingredients`
- `steps`
- `notes`
- `created_at`

## Bezpecnost

Bezpecnost dat stoji na autentizaci v Supabase a na spravne nastavenych RLS policy pro tabulku `recipes`.

Doporuceni:

- povol `SELECT`, `INSERT`, `UPDATE` a `DELETE` jen prihlasenemu uzivateli nad jeho vlastnimi zaznamy
- vaz data pres `user_id = auth.uid()`
- neukladej zadne tajne serverove klice do `VITE_*` promennych

Priklad logiky pro RLS:

```sql
create policy "Users can read own recipes"
on public.recipes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own recipes"
on public.recipes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own recipes"
on public.recipes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own recipes"
on public.recipes
for delete
to authenticated
using (auth.uid() = user_id);
```

## Stav projektu

Projekt je nasazeny a bezici. Dokumentace v tomto souboru odpovida aktualnimu kodu v repozitari, zejmena aplikaci ve slozce `app/`.
