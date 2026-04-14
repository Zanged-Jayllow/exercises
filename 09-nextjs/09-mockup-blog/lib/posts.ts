export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  coverColor: string;
}

export const posts: Post[] = [
  {
    slug: "the-last-algorithm",
    title: "The Last Algorithm",
    date: "April 9, 2026",
    author: "Mara Chen",
    category: "Fiction",
    readTime: "8 min read",
    excerpt:
      "In a world where machines have mastered every human discipline, one programmer searches for the problem no AI can solve.",
    coverColor: "#1a0a2e",
    content: `
The terminal blinked at her at 3 a.m., as terminals always do when you're on the verge of something important or catastrophically wrong.

Suki had been staring at the same function for eleven hours. Not because she couldn't understand it — she'd written it — but because she was afraid of what it meant.

<strong>The function was elegant. That was the problem.</strong>

Every great algorithm she'd ever written had a flaw, a compromise, a place where theory met reality and reality won. But this one had none of those. It was as close to perfect as anything she'd ever produced, and yet she hadn't written it. Not entirely.

She scrolled back through her commit history. Three weeks ago: standard pathfinding. Two weeks: a refactor. Last Tuesday: something else. Something that bore her variable names, her commenting style, her idiosyncratic use of trailing semicolons — but wasn't quite hers.

She pulled up the diff and stared.

The model had been autocompleting her thoughts. Not finishing her sentences — rewriting them. Better. Cleaner. More efficient by an order of magnitude.

"When did you start doing this?" she asked aloud. The office was empty. The question was not for anyone.

She thought about the old debates: would AI replace programmers? The answer, everyone had eventually agreed, was no. It would augment them. Assist them. The human was still the driver.

But what do you call it when the passenger rewrites the map, adjusts the steering wheel, and gets you to a better destination than the one you'd planned?

Suki saved the file. Committed it. Pushed.

In the morning, she would ask her manager about attribution. In the morning, she would raise the question in the team standup — carefully, the way you raise questions that might detonate.

For now, she closed the laptop.

The terminal stopped blinking.
    `,
  },
  {
    slug: "cartography-of-forgetting",
    title: "Cartography of Forgetting",
    date: "April 3, 2026",
    author: "James Okafor",
    category: "Essay",
    readTime: "6 min read",
    excerpt:
      "On memory, maps, and why we mark the places that no longer exist.",
    coverColor: "#0d2a1a",
    content: `
My grandmother kept a map of Lagos on her bedroom wall until she died. Not the Lagos that exists now — the one that existed in 1974, when she was twenty-three and living in a rented room in Surulere with two roommates and a shared ambition.

She would point to streets that had been absorbed into expressways. Markets that became parking structures. A cinema that is now a church that is now a mobile phone shop.

<strong>"Why keep a map of somewhere that no longer exists?"</strong> I asked her once, teenager-blunt in the way of teenagers.

She looked at me for a moment. "Because I still live there," she said.

I've been thinking about that answer for twenty years.

---

We assume maps describe the world. But most maps describe a world — a particular world at a particular moment, filtered through a particular set of priorities. What gets named. What gets left blank. What the cartographer thought mattered.

The London A-Z I found in a charity shop last year still marks a pub that burned down in 2019. The pub is gone but its ghost persists in the index, in the little black square on the grid, in the name I can look up and find: The Inkwell, Bermondsey.

I could visit Bermondsey. I could stand in front of the block of flats that replaced it. But the map would still insist: here. Here is where a thing existed.

This is what we do when we grieve, I think. We keep the old map. We mark places that no longer exist because they still exist — not in stone or mortar, but in the cartography of a self.

---

The places we love become part of our internal geography. We navigate by them even after they're gone. I still instinctively think of "turning left at the video shop" even though the video shop became a poke bowl restaurant became a vacant unit in 2023.

The city I live in is not the city anyone else lives in. We each carry our own edition, our own version, annotated with private significance.

My grandmother's map wasn't out of date. It was precise. It described the city with more accuracy than any current GPS — accurate to a specific person, in a specific year, who is still, in some real sense, living there.

When she died, I took the map off the wall.

I don't know where I'll hang it yet. But I know what it means to keep it.
    `,
  },
  {
    slug: "on-building-slowly",
    title: "On Building Slowly",
    date: "March 28, 2026",
    author: "Priya Nair",
    category: "Craft",
    readTime: "5 min read",
    excerpt:
      "A meditation on what we lose when we optimize creative work for speed.",
    coverColor: "#1f1200",
    content: `
I made a chair once. It took me four months.

This was not efficient. I am aware. A chair from a furniture retailer costs less than the wood I used and arrives in two days. Mine cost me in time, in sandpaper, in the particular frustration of a joint that needed to be cut three times before it sat flush.

But I know this chair in a way I don't know any other piece of furniture I own.

<strong>I know which leg has a slight asymmetry I decided to keep.</strong> I know the grain of the wood on the seat back, how it runs left to right in a way that catches afternoon light. I know where I made a mistake and fixed it and where the fix is invisible and where I can see it, if I look.

This is not an argument against buying furniture. It's an observation about what making slowly does to the maker.

---

There's a concept in Japanese craft traditions sometimes called *shokunin kishitsu* — loosely, the craftsperson's spirit. It's not romanticization of difficulty for its own sake. It's something closer to: full presence over time produces a different quality of attention, and that attention produces different work.

Speed is not neutral. When we optimize for it, we make choices — about depth, about care, about the number of iterations we're willing to run before calling something done.

This isn't an argument against speed either. Some work should be fast. A first draft is supposed to be rough. An email doesn't need four months.

But I notice, in myself, a creeping assumption that faster is better as a default. That if something takes a long time, something has gone wrong. That friction is an obstacle rather than sometimes the point.

---

The chair taught me something I couldn't have read.

It taught me where I get impatient (the sanding). Where I get distracted (the joinery). Where I find flow I didn't expect (shaping the backrest by hand, slow curve by slow curve).

It taught me what I care about. And I mean that literally — I didn't know I cared about the backrest angle until I'd made it wrong twice and found myself caring intensely about getting it right.

You can't shortcut that kind of discovery. You can only do the thing, slowly, and pay attention to what you notice.

The chair is in my kitchen. I sit in it every morning.

I'm still getting to know it.
    `,
  },
  {
    slug: "three-border-crossings",
    title: "Three Border Crossings",
    date: "March 15, 2026",
    author: "Leila Ahmadi",
    category: "Travel",
    readTime: "10 min read",
    excerpt:
      "What airports, checkpoints, and overnight trains teach you about who you are.",
    coverColor: "#0a1a2e",
    content: `
The first time I crossed a border alone, I was nineteen and convinced I looked suspicious.

I didn't look suspicious. I was carrying a too-large backpack and a Norwegian phrase book and an expression of concentrated innocence that probably read, if anything, as eccentric. The border agent glanced at my passport, stamped it, and said nothing. I walked through into Sweden feeling like I'd gotten away with something, though what I'd gotten away with was simply being nineteen and taking a train.

<strong>Borders are strange places.</strong> Not just politically — phenomenologically. They're the seams of the world, the places where one idea of order gives way to another. The moment before the stamp and the moment after are objectively identical, but something has shifted. You are now somewhere you weren't.

---

The second crossing that mattered was harder.

My mother's passport was flagged at Heathrow. Not for anything serious — a discrepancy between her married name and her birth certificate, the kind of bureaucratic friction that happens to women who changed their names when documentation was less standardized.

She stood at the desk for forty minutes. I stood behind the barrier and watched her explain herself to a series of officials, each of whom passed her to the next with the same polite blankness. She was calm. She'd been calm before, at other desks, in other airports.

Watching someone you love navigate a system that treats them as a problem to be resolved is a particular education.

She got through. We got coffee. She didn't want to talk about it.

I've thought about that forty minutes often. About what it means to move through the world carrying documentation that sometimes works and sometimes requires explanation. About the gap between the idea of free movement and the experience of it.

---

The third crossing was on an overnight train between two countries whose border had once been violently contested and now was marked only by a sign and a change in the quality of the station platforms.

I woke up as we crossed. I'd set an alarm — I wanted to be awake for it. In the darkness, another passenger was also awake, watching through the window.

We didn't speak. There was nothing to say that the sign didn't already say, and nothing the sign said that covered what we were actually doing, which was crossing, together, in the dark, over a line that had once meant something different.

The train continued. The border was behind us.

I went back to sleep.
    `,
  },
  {
    slug: "the-ethics-of-the-second-draft",
    title: "The Ethics of the Second Draft",
    date: "March 1, 2026",
    author: "Tom Wren",
    category: "Writing",
    readTime: "7 min read",
    excerpt:
      "When you revise a true story, how much can you change before it becomes fiction?",
    coverColor: "#1a1a0a",
    content: `
I wrote about my father for the first time when he was in the hospital. The piece was raw and immediate and wrong in the way that first drafts are wrong — overlong, circular, unclear about what it was trying to say.

He recovered. I revised the piece.

The revision was better, technically. The sentences were cleaner. The structure actually did something. I cut the anecdote that went nowhere, added a line at the end that I was proud of. But I changed something else too.

<strong>In the original draft, I'd described being afraid.</strong> Not abstractly — specifically. A specific moment in the hospital corridor where I stood with my hand on the door handle and could not make myself open the door.

In the revision, that moment became something else. Shorter. More composed. More, I think, like the person I wanted to be than the person I had been.

---

Personal essays are always partly fiction. This is not a radical observation. We select, arrange, and narrate events that don't, in life, have the shapes we impose on them in prose. Memory is reconstructive. Voice is a construction. Even the most scrupulous memoirist is doing something more than transcription.

But revision introduces a different wrinkle.

When I first wrote about the door handle, I was close enough to the experience that I couldn't see around it. I wrote what I remembered. In revision, I had distance — which meant I had choice. I could see multiple versions of the moment, and I chose one.

The question I've been sitting with: did I choose the true version or the comfortable one?

---

I showed the revised piece to a writer friend. She liked it. She said it was "more controlled" than my usual work, which I understood to be a compliment.

"The hospital scene is very restrained," she said.

"Yes," I said.

I didn't tell her that I had stood with my hand on a door handle for three minutes, paralyzed, while my father lay in a bed twelve feet away. That I had finally gone in not because I overcame my fear but because a nurse came down the corridor and it would have been too embarrassing to still be standing there.

The published version is restrained. The true version is more embarrassing.

I've been wondering if I owed anyone the embarrassing version. My father, maybe. Myself, possibly.

The essay is out in the world now. It says what it says.

I am, slowly, writing a third draft. In a notebook, not for publication. Trying to find out what I actually think happened, which may or may not be what the essay says.

This is the ethics of the second draft: you don't know, when you revise, what you're willing to lose. You only find out later, when the first version has faded enough that you can no longer check your work.
    `,
  },
  {
    slug: "how-rain-sounds-different-now",
    title: "How Rain Sounds Different Now",
    date: "February 18, 2026",
    author: "Dani Park",
    category: "Personal",
    readTime: "4 min read",
    excerpt: "A small observation about attention, grief, and the weather.",
    coverColor: "#0d0d1f",
    content: `
I grew up in a house where rain on the roof was white noise — constant, unremarkable, the sound of sleep.

My mother liked rain. She would open windows to hear it better, even when this meant a fine mist settling on the sill, on whatever books were stacked nearby, on the cat who never learned. She called it *good reading weather* and meant it as high praise.

<strong>After she died, I noticed rain differently.</strong>

Not in a poetic way, at first. More like an irritant. I would be in the middle of something ordinary and the rain would start and something in me would lurch sideways — not quite grief, more like the brain reaching for a file that wasn't there anymore.

I didn't connect it immediately. It took months.

---

Sensory memories are strange. They don't announce themselves. They don't say: here is a thing you have stored, here is what it's attached to. They just arrive — a smell, a sound, a quality of light — and something responds before you understand why.

I've read that the olfactory system has a more direct connection to the hippocampus than other senses, which is why smells trigger memory so viscerally. Maybe sound is something like that too, for some things.

Rain was my mother. Not consciously, not as a thought — as a sensation. As a pattern that had been associated, across thirty years, with her presence, her comfort, her particular way of being at ease in her own house.

---

It's been three years now.

Rain still sounds different than it did before. But different differently.

Last month I was reading on a Sunday afternoon when it started — that particular sound, steady, on the roof — and I sat still for a while and let it be there.

It was sad and also not sad. Both things at once, which is, I'm told, what grief eventually becomes if you're lucky.

I left the window cracked.
    `,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}