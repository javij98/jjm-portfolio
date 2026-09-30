# Website redesign goals

## Primary goal

Update Javier's portfolio so that his current DevOps / Platform Engineering
profile is represented more accurately.

## Positioning hierarchy

The visitor should understand within a few seconds:

1. Javier is a DevOps Engineer.
2. His strongest areas are Kubernetes, CI/CD, containers, Linux and automation.
3. He has a software development background.
4. He is evolving toward Platform / Cloud Engineering.
5. He builds substantial personal projects outside work.

## Professional experience

Update the experience section to properly represent:

- Krimda
- Capgemini

Capgemini should show the evolution:

Software Development
→ Automation
→ CI/CD
→ DevOps

Do not make it appear that Javier worked as a pure DevOps Engineer during the
entire Capgemini period.

## Projects

Projects should have more visibility. Show all documented personal projects in a
filterable, non-scrolling gallery: MoneyFlow, Self-hosted Knowledge Platform,
Print Studio, Hermes Agent, Personal Portfolio and Services Site. Work examples
remain separate under experience, anonymized and with their actual status.

Work examples use a compact list: title, a short description and a Details
action. Full context, status, technologies and qualified impact figures appear
in dialogs using the same style as personal project dialogs. Show four cases
initially and expand the others in place, with the expansion control below the
entire visible list. Pointer clicks should release the control's focus, while
keyboard interaction keeps a visible focus indicator.

Prioritize:

1. MoneyFlow
2. Self-hosted Knowledge Platform
3. Print Studio
4. Personal portfolio / related infrastructure projects

MoneyFlow should explicitly show:
- Web version
- React Native version
- Supabase
- AI integration
- Shared architecture / monorepo

## Skills

Separate skills conceptually into:

- DevOps & CI/CD
- Containers & Platform
- Observability
- Development
- Cloud / Infrastructure
- Automation
- Applied AI / Harness Engineering (clearly marked as developing)

A restrained automatic strip may show technologies with applied experience,
with a pause control and a static presentation when reduced motion is requested.

Do not visually imply the same expertise level for every technology.

AWS and Terraform should appear as technologies being developed, not primary
expertise.

## About and contact

Include a concise About me section that explains Javier's path from development
to DevOps, his way of working and a small amount of personal context. Keep
LinkedIn and GitHub on a separate line below the email actions at every width.

## General style

Desired feeling:

- Technical
- Modern
- Clean
- Engineering-focused
- Professional but personal
- Not a generic developer portfolio

Avoid:
- Excessive animations
- Generic AI-generated marketing text
- Overclaiming expertise
- Very long paragraphs

## Human and LLM reading modes

Offer a Human / LLM selector next to ES / EN using the same restrained style.
The LLM view presents the entire published portfolio as plain Markdown in both
languages, including all projects, complete work examples, skill levels and
articles. Preserve case status and all qualifications on impact figures.

Generate the exports from the same public content as the visual site. Provide
static Markdown files and a public llms.txt index that work without JavaScript.
Keep the language when switching modes, and allow copying or downloading the
complete document. Avoid claims that these formats guarantee AI discovery.
