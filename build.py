# Generates the HTML pages from one shared template (run: python3 build.py)
NAV=[("index.html","Home"),("subjects.html","Subjects"),("about.html","Who we are"),("help.html","Help"),("feedback.html","Have your say")]
def page(fn,title,body):
    nav="".join(f'<li><a href="{f}"{" aria-current=\"page\"" if f==fn else ""}>{n}</a></li>' for f,n in NAV)
    open(fn,"w").write(f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | All Friction</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Special+Elite&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="nav" aria-label="Main"><a class="brand" href="index.html">AF</a><ul>{nav}</ul></nav>
<main>
{body}
</main>
<footer>All Friction. Built to learn. Not to entertain.</footer>
<script src="script.js"></script>
</body>
</html>
''')
def head(h,p): return f'<header class="page-head pop"><h1>{h}</h1><p>{p}</p></header>'
def card(inner,i=0): return f'<article class="card pop" style="--i:{i}">{inner}</article>'

page("index.html","Home",'''<section class="hero">
<h1 class="title" aria-label="All Friction"><span id="typed" aria-hidden="true">All Friction</span><span class="caret" aria-hidden="true"></span></h1>
<p class="slogan">Built to learn. Not to entertain.</p>
</section>
<section class="wrap stack" aria-label="What we stand for">
'''+card("<h2>Content built for students, by students.</h2><p>Nobody knows what a late-night revision session needs like someone who has just survived one.</p>")
+card("<h2>Making learning the priority.</h2><p>Every page, every tool, every decision starts with one question: does this help you learn?</p>")
+card("<h2>No feeds. No noise. Just the work.</h2><p>Nothing here is designed to keep you scrolling. It's designed to get you finished.</p>")+"</section>")

subs=[("Chemistry",["Atomic structure","Bonding","Reactions and rates"]),("Biology",["Cells","Genetics","Ecosystems"]),("Physics",["Forces and motion","Energy","Waves"]),("Maths",["Algebra","Calculus","Statistics"])]
cards="".join(card(f"<h2>{n}</h2><p>Placeholder: a one-line summary of what students will learn in {n}.</p><ul>"+"".join(f"<li>{t}</li>" for t in ts)+"</ul><small>Coming soon</small>",i) for i,(n,ts) in enumerate(subs))
page("subjects.html","Subjects",head("Subjects","Pick a subject and get straight to the work. Placeholder intro text.")+f'<section class="wrap"><div class="grid">{cards}</div></section>')

people="".join(card(f'<div class="avatar"></div><h3>Student Name</h3><p>Role, course. One line about what they built.</p>',i) for i in range(3))
page("about.html","Who we are",head("Who we are","A small team of students who wanted better study tools. Placeholder intro text.")
+'<section class="wrap">'+card("<h2>Our story</h2><p>Placeholder: why All Friction started, what was missing, and what we are building to fix it. Two or three short paragraphs work best.</p>")
+'<h2 class="section-title pop">The team</h2><div class="grid">'+people+'</div></section>')

faq="".join(f'<details class="pop" style="--i:{i}"><summary>{q}</summary><p>Placeholder answer. Keep it short, plain and useful.</p></details>' for i,q in enumerate(["How do I get started?","Is All Friction free?","How do I report a mistake in a lesson?","Can I suggest a new subject?"]))
page("help.html","Help",head("Help","Quick answers to common questions. Placeholder intro text.")+f'<section class="wrap">{faq}'
+'<div style="margin-top:3rem;max-width:420px">'+card("<h3>Still stuck?</h3><p>Placeholder: contact details or support email.</p>")+'</div></section>')

page("feedback.html","Have your say",head("Have your say","Tell us what to build next. The most requested ideas go to the top of the list.")+'''<section class="wrap pop">
<form id="feedback">
<label>What should we work on?<select><option>A new subject</option><option>A new feature</option><option>Something is broken</option><option>Something else</option></select></label>
<label>Your idea<textarea placeholder="Tell us more..." required></textarea></label>
<label>Email (optional)<input type="email" placeholder="you@example.com"></label>
<button type="submit">Send feedback</button>
</form>
<p class="thanks" id="thanks">Thanks. Your feedback has been noted.</p>
</section>''')
