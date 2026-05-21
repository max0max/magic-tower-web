# Goal Contract

```yaml
Goal Contract:
  goal: "Deliver a pure frontend Magic Tower V1 game hosted from a public GitHub Pages or equivalent GitHub static URL, so players can click the public link and play in a browser without cloning the repository, installing dependencies, logging in, or starting a local service."
  scope:
    in_scope:
      - "A GitHub repository with source files, static publishing files, and a clear online play entry point."
      - "A public URL that opens directly into a playable game page."
      - "A pure frontend implementation. Build tools may be used by maintainers, but players must not need Node, npm, a package manager, or any local dependency."
      - "Magic Tower core mechanics: grid map, player movement, floor or area transitions, keys and doors, items, monster combat, player stats, death, and completion state."
      - "At least one V1 level with a complete route from start to completion."
      - "A README or repository homepage with a prominent online play link."
    out_of_scope:
      - "Requiring players to clone the repository, download an archive, install dependencies, run commands, or start a local server."
      - "Backend services, databases, accounts, cloud saves, leaderboards, payments, and multiplayer."
      - "Commercial art quality, full narrative systems, large level sets, a level editor, mobile app packaging, and live operations."
  success_criteria:
    - "The GitHub repository contains a public online play link that opens the game page."
    - "The online page can enter gameplay without login, local installation, or command-line steps."
    - "After the game page loads, a player can start a new game within 3 clicks or key presses."
    - "Core mechanics work: movement, key pickup, door opening, item pickup, floor or area transition, combat, death, completion, and restart."
    - "At least one complete playable route exists from new game to completion."
    - "The game is playable on desktop browser and mobile viewport sizes without major UI overlap."
    - "After refreshing the online page, the game can still start or return to an operable state."
    - "The README clearly shows the online play entry point and does not make clone, dependency install, or local startup required for players."
  evidence:
    - criterion: "Public online play entry point"
      proof:
        - "Screenshot of the README or repository homepage showing a clickable online play link."
        - "Successful load of the public URL."
    - criterion: "No local environment required"
      proof:
        - "Recording or screenshots from a fresh browser session that opens the public URL without running git, npm, yarn, pnpm, or a local server."
    - criterion: "Fast start"
      proof:
        - "Recording or manual test note proving the route from public URL to operable game state takes no more than 3 interactions."
    - criterion: "Core mechanics"
      proof:
        - "Test notes or automated tests covering movement, keys, doors, items, floor or area transition, combat, death, completion, and restart."
    - criterion: "Complete route"
      proof:
        - "A complete playthrough recording or test script from new game to completion."
    - criterion: "Desktop and mobile usability"
      proof:
        - "Desktop and mobile viewport screenshots showing the map, status area, and controls visible without major overlap."
    - criterion: "Refresh behavior"
      proof:
        - "Test note showing the public URL remains usable after browser refresh."
    - criterion: "README player instructions"
      proof:
        - "README excerpt showing the online play entry point and no player-side install requirement."
  guardrails:
    - "Player experience is more important than developer convenience: build tools and dependencies may exist only for development or publishing, not as player prerequisites."
    - "Default to GitHub Pages style static hosting unless a future decision explicitly approves a continuously running server."
    - "If a framework or build tool is introduced later, the final deployed artifact must remain static-hostable."
    - "Do not depend on private APIs, secrets, login state, or local machine paths to load the game."
    - "For V1, prioritize click-to-play publishing and a closed loop of core mechanics over expanded art, story, or complex systems."
```
