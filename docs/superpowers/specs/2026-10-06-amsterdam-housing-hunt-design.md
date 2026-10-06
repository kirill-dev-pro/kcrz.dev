# Design Spec: Amsterdam Housing Hunt Article (September 2025)

## Overview
A first-person, authentic blog post for `kcrz.dev` documenting the author's real experience searching for rental housing in Amsterdam in September 2025. The article breaks down the Dutch rental market, regulations, corporate lotteries, applicant competition, and why hiring a tenant agent becomes the practical solution.

## Tone & Voice Requirements
- **Authentic speech**: Retain the author's conversational cadence, irony, and expat/tech perspective. Do not sanitize or over-formalize phrasing.
- **Speech-to-text corrections**: Fix obvious dictation/transcription errors without changing stylistic flavor (e.g. "характерные ворота" → "характерные обороты", "в Хельсинках" → "в Хельсинки", "от полутора тысяч евро там какое-то начальство небольшую" → "от полутора тысяч евро какую-то начальную небольшую", "отвлекался на 100 квартир" → "откликался на 100 квартир").
- **No robotic/AI clichés**: Avoid corporate filler, overused transition words ("в заключение", "стоит отметить"), and formal lecturing.

## Project & Editorial Guidelines (from AGENTS.md)
- **No eyebrows**: Never place category text, kickers, or small labels above section headings.
- **No numbered sections**: Headings must be descriptive and unnumbered.
- **Descriptive titles**: Single clear title and description; no subtitles that repeat the title.

## Technical Architecture & File Layout
- **Target Article File**: `src/content/blog/amsterdam-housing-hunt-ru.mdx`
- **Assets**:
  - Uploaded screenshot copied to `src/assets/blog/amsterdam-housing/expat-chat-warning.jpg`.
- **Components Used**:
  - `astro:assets` (`Image`) for responsive, optimized rendering of the chat screenshot.
  - `src/components/LinkCard.astro` for structured link previews (Funda.nl, Pararius.nl, Kamernet).
  - `src/components/TelegramEmbed.astro` (with placeholders/comments) for embedding Telegram channel posts.

## Article Structure & Content Plan

### Frontmatter
- `title`: 'Поиск жилья в Амстердаме: как устроена сломанная система'
- `description`: 'Личный опыт аренды в Нидерландах в сентябре 2025-го: госрегулирование, двухуровневые лотереи, 200 откликов на квартиру и почему без агента почти не выжить.'
- `pubDate`: 'Sep 30 2025'

### Sections

#### 1. Сентябрь 2025-го и отель на один месяц
- **Narrative**: Relocation in September 2025; employer paid for 1 month in a hotel to sort out paperwork, local registration (BSN), and lease an apartment.
- **Prior experience & mindset**: Rented in Moscow, St. Petersburg, Helsinki, short-term tourist stays elsewhere. Prior experience made rental feel like a solvable, predictable task. Friends warned it was hard, but the true scale was incomprehensible beforehand.
- **Expat chat onboarding**: Joined local Russian expat chats to collect info and tips.
- **Visual**: Insert `<Image src={expatChatWarning} alt="..." />` showing the real Telegram message ("НЕ ПРИЕЗЖАЙТЕ В ЭТУ РАКОВУЮ СТРАНУ... БОЛЬШЕ НЕТ ДОМОВ ДЕШЕВЛЕ 2500 ЕВРО...").

#### 2. Витрина рынка и ложные ориентиры
- **Components**:
  - `<LinkCard>` Funda.nl (Netherlands' primary real estate portal).
  - `<LinkCard>` Pararius.nl (Focus on rental listings).
  - Brief mention of Kamernet (niche, mostly student/flatshare rooms, little long-term apartment supply).
- **The Initial Illusion**: Listings exist starting from €1 500 for a 1-bedroom apartment within Amsterdam / inside the A10 ring road, decent energy label, even modern developments. Naive belief that prices and listing turnaround times can be read directly off the market like anywhere else.

#### 3. Госрегулирование: почему квартиры дешевые на бумаге
- **System breakdown**: Dutch government regulations and rent controls (WWS point system) cap rent prices below free-market equilibrium for many apartments.
- **Consequence**: Artificially low price creates astronomical excess demand. Renting through standard supply-and-demand is impossible because the price mechanism is frozen.
- **The "Chosen One" syndrome**: To qualify, an applicant must either win pure Russian roulette or have lived in the Netherlands for 10 years with a flawless local tax/salary history that a Dutch agent finds worthy.

#### 4. Двухуровневая лотерея корпораций
- **The Mechanism**: Housing corporations and large landlords owning hundreds of units manage overflowing demand with actual lotteries.
- **Two levels**:
  1. *Level 1 (Lottery for viewings)*: 200 applicants in the first day. Agents collect applications for up to a week, pick candidates, and offer viewing slots during strict working hours. The applicant must drop everything to attend.
  2. *Level 2 (Lottery after viewing)*: Once applicants inspect the place and confirm they want it, a second random (or "random") draw chooses the tenant.
- **Interactive embed slot**: Placeholder for `<TelegramEmbed />` (e.g. slot booking confirmation or lottery result).

#### 5. Гонка вооружений: интерактивные резюме и миф о звонках
- **Desperate measures**: Applicants create personal websites, interactive pitch decks, and thick printed portfolios of recommendation letters and bank statements to hand over at viewings.
- **Debunking the "just call them" myth**: Popular chat advice says "call immediately for a viewing". Reality after 100+ applications: only ~10% of listings have a working phone number, and those numbers lead to automated answering machines explaining agency intake policies.
- **Interactive embed slot**: Placeholder for `<TelegramEmbed />` (chat discussion or personal case).

#### 6. Спектр решений: от серой зоны к агенту за €2 000
- **Grey market**: Whispers of "fake lotteries" and side-deals with deciding realtors for steep kickbacks (heard about, but untrustworthy).
- **Legal safeguards**: Dutch law prohibits charging tenant fees to the listing agency, and security deposits are capped at maximum 2 months (preventing landlords from asking for 6 months upfront even if they want to).
- **The pragmatic exit**: Hiring an *aanhuurmakelaar* (tenant search agent) starting from €2 000. Why this becomes the only realistic way to shift from endless unreturned lottery entries to an apartment you can actually rent.

#### 7. Итог первого месяца
- Honest reflection: how Amsterdam housing changes your perspective on "free markets" vs "overregulated markets", and what to prepare for if you are relocating.
