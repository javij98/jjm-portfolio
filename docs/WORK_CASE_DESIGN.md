# Work-case presentation — 2026-09-30

Reviewed official personal sites and their rendered layouts, with particular
attention to infrastructure and SRE engineers. These observations informed the
layout choice; they are not claims that those sites use our dialog pattern.

| Reference | Observed approach | Application here |
| --- | --- | --- |
| [Alex Ellis](https://alexellis.io/) | Dark, restrained typography; cloud-native tools grouped with short explanations. | Make the purpose of each automation immediately readable. |
| [Liz Fong-Jones](https://lizthegrey.com/) | SRE topics with titles, short summaries and an expandable archive. | Show a concise selection and provide access to deeper material. |
| [Brendan Gregg](https://www.brendangregg.com/overview.html) | A curated overview of systems work, with descriptive lists leading to detailed resources. | Use a compact technical index for operational cases. |
| [Mitchell Hashimoto](https://mitchellh.com/) | Restrained personal introduction and direct links to infrastructure projects and writing. | Keep the hierarchy clear and the presentation economical. |
| [Brittany Chiang](https://brittanychiang.com/) | Dark background, compact experience/project entries, technical tags and a project archive. | Preserve the existing palette, quiet hover and clear text hierarchy. |
| [Lee Robinson](https://leerob.com/) | Concise biography and a list of writing with secondary detail. | Keep each preview brief. |
| [Josh Comeau](https://www.joshwcomeau.com/) | Titles and summaries with an explicit action to read further. | Make Details a clear action rather than expanding every case inline. |
| [Bruno Simon](https://bruno-simon.com/) | A portfolio built around driving through an interactive world. | An example of a different creative positioning; our cases stay focused on readable operational work. |

The chosen format is a numbered list with one short description and a Details
button per case. The full challenge, solution, outcome, status, stack and impact
figures move into a dialog. The dialog reuses the personal-project appearance
and behavior. No work content is removed. Four cases appear initially; the
remaining cases expand above the control, leaving it at the bottom of the list.
Mouse clicks release that control's focus; keyboard activation retains focus.
Without JavaScript, all cases and their full content remain readable inline.

Javier clarified the scope of configuration changes: approximately ten projects
with ten microservices each, and four to five weekly changes per developer and
microservice. With ten to fifteen minutes per build, one change stream per
service represents approximately 67–125 hours of aggregate CI execution per
week, or 13–25 hours per working day over five days. The dialog identifies this
as a potential aggregate estimate and includes its assumptions. The unknown
number of developers is not an additional multiplier. The figure does not
represent personal working hours or a measured production result.
