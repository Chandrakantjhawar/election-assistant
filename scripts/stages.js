/**
 * stages.js — All 8 election stage data objects
 * Matches the schema defined in the tech spec (Section 4)
 */

const STAGES = [
  {
    id: 1,
    slug: "announcement",
    label: "Announcement",
    emoji: "📢",
    timing: "6–12 months before election",
    color: "#1A73E8",
    description:
      "The election cycle begins with an official announcement that an election will be held. In presidential systems, this is often done by the head of state or a constitutional deadline that automatically triggers the process. In parliamentary systems, the ruling government may \"call\" an election by dissolving parliament. The announcement sets the official electoral calendar — the backbone that every candidate, political party, and election official will follow.",
    keyPoints: [
      { label: "Who announces", value: "Head of state, parliament, or electoral commission per constitutional rules" },
      { label: "Legal basis",   value: "Constitutional provision, electoral law, or parliamentary resolution" },
      { label: "Duration",      value: "1 day (announcement event) to several weeks of formal filing periods" },
      { label: "Key action",    value: "Official electoral calendar published for all stakeholders and the public" }
    ],
    callout:
      "💡 A \"snap election\" is called earlier than scheduled — often a strategic move by a government that believes current public sentiment favors them.",
    suggestedQuestions: [
      "Who has the power to call an election?",
      "What is a snap election?",
      "Can an election date be changed after it's announced?"
    ]
  },
  {
    id: 2,
    slug: "registration",
    label: "Voter Registration",
    emoji: "📋",
    timing: "4–6 months before election",
    color: "#0F9D58",
    description:
      "Before citizens can vote, they must be on the official voter roll — the list of eligible voters maintained by election authorities. Some countries use automatic registration (every eligible citizen is registered by default), while others require active registration (citizens must apply). Voter registration deadlines are strictly enforced, so missing them means being unable to vote on election day. Election commissions conduct registration drives to encourage maximum participation.",
    keyPoints: [
      { label: "Who registers",     value: "All eligible citizens (age, citizenship, and residency requirements vary)" },
      { label: "How to register",   value: "Online, by mail, in person at government offices, or automatic enrollment" },
      { label: "Deadline",          value: "Typically 15–30 days before election day; varies by jurisdiction" },
      { label: "Verification",      value: "Identity documents, address proof, and citizenship verification required" }
    ],
    callout:
      "💡 In countries like Australia and Belgium, voting is compulsory — failing to vote can result in a fine. Registration is automatic for all adults.",
    suggestedQuestions: [
      "What documents do I need to register to vote?",
      "What is automatic voter registration?",
      "Can I vote if I missed the registration deadline?"
    ]
  },
  {
    id: 3,
    slug: "nominations",
    label: "Candidate Nominations",
    emoji: "🏛️",
    timing: "2–4 months before election",
    color: "#F4B400",
    description:
      "During the nomination phase, political parties select their candidates through primaries, caucuses, or internal party decisions. Independent candidates can also file to run by collecting signatures and paying filing fees. All candidates must meet eligibility requirements — typically minimum age, citizenship, and residency criteria. Once nominations close, the ballot is finalized and cannot be changed (with rare exceptions).",
    keyPoints: [
      { label: "Eligibility",        value: "Age, citizenship, residency, and no disqualifying criminal convictions" },
      { label: "Party nomination",   value: "Via primary elections, caucuses, or internal party selection processes" },
      { label: "Independent filing", value: "Signature collection (often thousands) + filing fee + eligibility forms" },
      { label: "Filing deadline",    value: "Typically 30–60 days before election; ballot finalized after this date" }
    ],
    callout:
      "💡 In the US, presidential primaries run months before the general election — essentially a separate election to choose each party's nominee.",
    suggestedQuestions: [
      "How do political parties choose their candidates?",
      "Can anyone run for office as an independent?",
      "What makes a candidate ineligible to run?"
    ]
  },
  {
    id: 4,
    slug: "campaigning",
    label: "Campaigning",
    emoji: "🎙️",
    timing: "1–3 months before election",
    color: "#DB4437",
    description:
      "The campaign period is when candidates and parties actively try to win voter support through speeches, debates, advertisements, rallies, and door-to-door outreach. Campaign finance laws regulate how much money can be raised and spent, and often require public disclosure of donors. In many democracies, there is a mandatory campaign silence period (blackout period) of 24–48 hours before election day, during which no new campaign activity is allowed.",
    keyPoints: [
      { label: "Campaign activities",  value: "Rallies, TV ads, debates, social media, canvassing, and endorsements" },
      { label: "Finance rules",        value: "Donation caps, spending limits, and mandatory public financial disclosure" },
      { label: "Media coverage",       value: "Broadcasters often required to provide equal airtime to major candidates" },
      { label: "Blackout period",      value: "48–24 hrs before polls open — no new campaign ads or activities allowed" }
    ],
    callout:
      "💡 Campaign finance transparency laws require candidates to publicly disclose who donated money and how it was spent — a key accountability mechanism.",
    suggestedQuestions: [
      "How are political campaigns funded?",
      "What is a campaign finance limit?",
      "What happens during a campaign blackout period?"
    ]
  },
  {
    id: 5,
    slug: "polling",
    label: "Polling Day",
    emoji: "🗳️",
    timing: "Election day",
    color: "#AB47BC",
    description:
      "Polling day is when registered voters cast their ballots. Polling stations open at set times (typically 7am–8pm) and are staffed by trained election workers. Voters identify themselves, receive a ballot, mark their choice in a private booth, and submit their vote. Exit polls (surveys of voters leaving polling stations) give early indications of results but are not official. Poll workers, party representatives, and independent observers monitor proceedings to ensure fairness.",
    keyPoints: [
      { label: "Polling hours",     value: "Typically 7:00 AM – 8:00 PM local time; anyone in line at closing can vote" },
      { label: "Identification",    value: "Varies: photo ID, voter card, signature match, or no ID required by law" },
      { label: "Secret ballot",     value: "Voting is done in a private booth — no one can see how you voted" },
      { label: "Observers",         value: "Party representatives and independent monitors can watch but not interfere" }
    ],
    callout:
      "💡 Mail-in and early voting allow people to cast ballots before election day — making participation accessible to those who can't visit a polling station.",
    suggestedQuestions: [
      "What happens if I can't vote in person?",
      "Can I be turned away at the polls?",
      "What is a provisional ballot?"
    ]
  },
  {
    id: 6,
    slug: "counting",
    label: "Vote Counting",
    emoji: "🔢",
    timing: "Evening of election day through following days",
    color: "#00ACC1",
    description:
      "After polls close, election officials count ballots under strict observation. Modern elections use a combination of electronic counting machines and manual hand counts, especially for close races. Ballots must be authenticated, tallied, and reconciled — the number of ballots must match the number of voters checked in. Any ballot that cannot be clearly interpreted (an \"overvote\" or \"undervote\") is set aside for review by a canvassing board.",
    keyPoints: [
      { label: "Counting method",   value: "Electronic tabulators for speed, with hand counts for verification or audits" },
      { label: "Transparency",      value: "Party observers and independent auditors present during the entire process" },
      { label: "Reconciliation",    value: "Total votes counted must match total voters checked in at each precinct" },
      { label: "Challenged ballots","value": "Damaged, ambiguous, or questioned ballots reviewed by canvassing boards" }
    ],
    callout:
      "💡 A margin that falls below a legally defined threshold (often 0.5%) automatically triggers a recount — an independent re-tallying of all ballots.",
    suggestedQuestions: [
      "How are votes counted and verified?",
      "What is an election audit?",
      "What triggers an automatic recount?"
    ]
  },
  {
    id: 7,
    slug: "results",
    label: "Results & Declaration",
    emoji: "📊",
    timing: "Hours to days after polling",
    color: "#FF7043",
    description:
      "Once counting is complete, election officials certify the results — the formal legal act of confirming that the tally is accurate and final. Media organizations often \"project\" a winner before official certification, but the legal winner is only determined by the official count. Losing candidates may concede (acknowledge defeat) as a democratic tradition, but concession is not legally required. Results are then published in official government gazettes and election commission records.",
    keyPoints: [
      { label: "Media projection",  value: "News organizations call winners based on vote counts — not legally binding" },
      { label: "Certification",     value: "Election commission formally certifies results after full count and audit" },
      { label: "Concession",        value: "Tradition, not law — losing candidates may publicly acknowledge defeat" },
      { label: "Dispute window",    value: "Legal timeframe (often 7–30 days) to file formal electoral challenges" }
    ],
    callout:
      "💡 Electoral disputes go through courts, not executive decisions. Judges examine evidence and apply electoral law — not political preference.",
    suggestedQuestions: [
      "When are election results officially final?",
      "What can a losing candidate do to challenge results?",
      "What is the difference between a projection and certified results?"
    ]
  },
  {
    id: 8,
    slug: "inauguration",
    label: "Inauguration",
    emoji: "🏛️",
    timing: "Days to weeks after certification",
    color: "#43A047",
    description:
      "The inauguration (also called swearing-in or investiture) is the formal ceremony that transfers power from the outgoing officeholder to the winner. The new officeholder takes an oath of office — a solemn promise to uphold the constitution and faithfully execute the duties of the position. This ceremony marks the peaceful transfer of power, widely considered the hallmark of a healthy democracy. After inauguration, the new government officially begins its term.",
    keyPoints: [
      { label: "Oath of office",    value: "Constitutionally mandated promise to uphold the law and serve the public" },
      { label: "Timing",            value: "Constitutionally set date, regardless of when the election was held" },
      { label: "Transfer of power", value: "Outgoing officials relinquish access, documents, and authority to successors" },
      { label: "Tradition",         value: "Public ceremony, often with speeches, symbolizing democratic continuity" }
    ],
    callout:
      "💡 The US presidential inauguration always takes place on January 20th — a date set by the 20th Amendment to the Constitution, regardless of election day.",
    suggestedQuestions: [
      "What is the significance of the oath of office?",
      "What is a peaceful transfer of power?",
      "What happens if the winner refuses to be inaugurated?"
    ]
  }
];
