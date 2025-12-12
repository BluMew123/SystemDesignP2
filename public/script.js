// Tarot Journal client-side logic

let cardSearch, autocompleteDropdown, positionContainer, cardPosition, selectedTags, spreadSelect, entryDate, notes, saveEntry, clearForm, addCardBtn
const calendarContainer = document.querySelector('#calendarContainer')
const formView = document.querySelector('#formView')
const detailView = document.querySelector('#detailView')
let selectedAutocompleteIndex = -1

// Local storage key
const STORAGE_KEY = 'tarot-journal-entries'

// List of tarot cards with descriptions
const tarotCards = [
  {
    "name": "The Magician",
    "description": "This card represents tapping into your **potential** and making things happen in the real world. Upright, it signifies having the **skill**, confidence, and resources to manifest your goals and use your willpower effectively. Reversed, be cautious of using your talents manipulatively, delays, or feeling **powerless** and uninspired to act."
  },
  {
    "name": "The High Priestess",
    "description": "She embodies **intuition**, hidden knowledge, and the subconscious mind; you're encouraged to look inward for answers. Upright, trust your gut feeling, listen to your inner wisdom, and embrace the **mystery** of what is yet to be revealed. Reversed, it suggests ignoring your intuition, suppressed feelings, or relying too much on surface-level knowledge, leading to secrets or **misunderstanding**."
  },
  {
    "name": "The Empress",
    "description": "The Empress symbolizes **fertility**, abundance, and connection with the natural world, representing creativity and nurturing. Upright, you're experiencing sensory pleasures, growth, creation, or stepping into your **powerful feminine energy**. Reversed, it can point to a creative block, neglecting self-care, financial issues, or dependence on others, indicating a lack of **nurturing** or stagnation."
  },
  {
    "name": "The Emperor",
    "description": "This card represents **authority**, structure, control, and paternal energy; it's about taking charge and setting boundaries. Upright, it means you have the **power** to realize your plans, showing leadership, stability, and establishing order. Reversed, watch out for inflexibility, a domineering attitude, abuse of power, or feeling **out of control** and disorganized."
  },
  {
    "name": "The Hierophant",
    "description": "The Hierophant represents tradition, social conventions, and structured belief systems or **spiritual guidance**. Upright, it encourages seeking counsel from an experienced mentor, adhering to established values, or committing to a **group** or marriage. Reversed, it warns against conventionality stifling your growth, challenging the status quo, or a misuse of authority within an established **system**."
  },
  {
    "name": "The Lovers",
    "description": "This card is all about relationships, values, and making a significant **choice** with deep implications. Upright, it signals harmony, perfect union, or facing a major decision that aligns with your **morals** and heart's true desire. Reversed, it suggests a poor choice, conflict, relationship breakdown, or misalignment of values and a lack of **attraction**."
  },
  {
    "name": "The Chariot",
    "description": "The Chariot signifies willpower, direction, and achieving **victory** through self-control and determination. Upright, it suggests moving forward with confidence, conquering obstacles, and having a clear **focus** on your ultimate goal. Reversed, it can mean a lack of direction, internal conflict hindering progress, being *blocked* from moving forward, or showing aggression and a lack of **control**."
  },
  {
    "name": "Fortitude",
    "description": "Fortitude (often called Strength) represents inner **resilience**, courage, and compassionately mastering your primal urges. Upright, you are asked to face challenges with gentle **power**, demonstrating patience, integrity, and self-discipline over raw force. Reversed, it warns of fear, self-doubt, weakness, or an abuse of power and a lack of **magnanimity**."
  },
  {
    "name": "The Hermit",
    "description": "The Hermit calls for introspection, solitude, and the search for **inner truth** and guidance. Upright, you may need to withdraw temporarily to reflect, seek **wisdom** through self-examination, or serve as a wise guide for others. Reversed, it can indicate isolation, loneliness, being afraid of introspection, or rejecting necessary guidance and feeling **lost**."
  },
  {
    "name": "Wheel Of Fortune",
    "description": "This card symbolizes the cycles of life, fate, and an inevitable turning point or **change** in circumstances. Upright, expect good luck, destiny unfolding, or a sudden, positive **break** in your current situation. Reversed, it may suggest bad luck, feeling stuck in a rut, resisting necessary change, or a sudden **downfall**."
  },
  {
    "name": "Justice",
    "description": "Justice represents fairness, **truth**, legal matters, and making rational, objective decisions based on cause and effect. Upright, expect balance, accountability, resolution of legal issues, or a need for a clear, honest **assessment** of a situation. Reversed, it warns of bias, injustice, unfair outcomes, or refusing to take **responsibility** for your actions."
  },
  {
    "name": "The Hanged Man",
    "description": "The Hanged Man represents **suspension**, sacrifice, and a new perspective gained through letting go and surrender. Upright, it asks you to pause, view things from a different angle, or make a conscious **sacrifice** for a greater spiritual or emotional gain. Reversed, it can mean unwillingness to change perspective, stubbornness, needless **martyrdom**, or fear of commitment."
  },
  {
    "name": "Death",
    "description": "Contrary to common belief, Death signifies **transformation**, necessary endings, and the inevitable cycle of rebirth, not physical death. Upright, a major, life-altering **change** is imminent, requiring you to release the past to make way for the new. Reversed, it suggests resisting change, fear of new beginnings, **stagnation**, or a prolonged, difficult transition."
  },
  {
    "name": "Temperance",
    "description": "Temperance is the card of **balance**, moderation, patience, and finding harmony by blending contrasting forces. Upright, you are successfully integrating different parts of your life, promoting good **health**, and practicing patience and self-control. Reversed, it signals imbalance, excess, going to **extremes**, or conflicting goals and energies causing disharmony."
  },
  {
    "name": "The Devil",
    "description": "The Devil represents **bondage**, materialism, shadow self, and feeling trapped by unhealthy attachments or addictions. Upright, it highlights where you feel powerless or restricted, often by your own self-imposed **limitations** and excessive focus on the material. Reversed, it's a sign of breaking free from harmful habits, realizing you have the power to **escape**, or confronting your darkest fears."
  },
  {
    "name": "The Tower",
    "description": "The Tower symbolizes sudden **upheaval**, crisis, and a dramatic, necessary breakdown of old structures that are no longer serving you. Upright, expect unforeseen change, exposure of falsehoods, or a major life event that shatters your sense of **security**. Reversed, the crisis is avoided but the foundations remain shaky, or you are **resisting** an inevitable change, delaying the necessary destruction."
  },
  {
    "name": "The Star",
    "description": "The Star is a beacon of **hope**, inspiration, serenity, and a feeling of being blessed by the universe. Upright, you are filled with optimism, receiving guidance, and entering a period of renewed **faith** and spiritual clarity after a difficult time. Reversed, it can mean feeling despair, a lack of faith, hopelessness, or being too **unrealistic** or focused on the negative."
  },
  {
    "name": "The Moon",
    "description": "The Moon represents **illusion**, fear, intuition, and the complex landscape of your subconscious mind. Upright, it signals a time of confusion, uncertainty, or trusting your deep inner instincts when reality is **unclear** or obscured by fear. Reversed, the fog may be lifting, revealing hidden truths, or it warns of letting fear take over and experiencing nightmares or profound **deception**."
  },
  {
    "name": "The Sun",
    "description": "This card is pure **joy**, vitality, success, and enlightenment; it represents clear, abundant, and vibrant energy. Upright, expect great happiness, celebration, brilliant **clarity**, and feeling fully alive and connected with your inner child. Reversed, it suggests a lack of enthusiasm, temporary unhappiness, feeling blocked from your **potential**, or a slight delay in achieving your goals."
  },
  {
    "name": "The Last Judgment",
    "description": "Judgment signifies a major spiritual **awakening**, a call to action, and honest self-evaluation leading to absolution. Upright, you are making an important life review, finding forgiveness, and experiencing a **rebirth** or definitive, positive outcome to a situation. Reversed, it may mean self-doubt, being too self-critical, avoiding necessary **reflection**, or being judged unfairly by others."
  },
  {
    "name": "The Fool",
    "description": "The Fool represents the beginning of a **journey**, spontaneity, innocence, and taking a leap of faith into the unknown. Upright, embrace new adventures, trust in the universe, and approach life with a sense of carefree **optimism** and beginner's enthusiasm. Reversed, it warns of recklessness, poor judgment, acting impulsively without looking, or a fear of taking the necessary **risk**."
  },
  {
    "name": "The World",
    "description": "The World symbolizes **completion**, integration, travel, and the ultimate achievement of your goals and ambitions. Upright, it indicates success, total fulfillment, a sense of belonging, and the **culmination** of a long phase or project. Reversed, it suggests unfinished business, a delay in success, feeling **incomplete**, or resisting a necessary final closure to a situation."
  },
  {
    "name": "Page of Wands",
    "description": "This Page embodies the first spark of **inspiration**, curiosity, and the arrival of exciting news or new projects. Upright, it signals receiving communication that initiates creativity, a sudden burst of **energy**, or a young, enthusiastic person entering your life. Reversed, it suggests a lack of direction, bad news, missed opportunities, or ideas that fizzle out due to poor **planning**."
  },
  {
    "name": "Knight of Wands",
    "description": "The Knight represents swift action, adventurous energy, and a headstrong, possibly **fiery** approach to a goal or journey. Upright, expect rapid movement, a thrilling change of residence or career, or a passionate, yet sometimes **hasty**, individual arriving. Reversed, it cautions against recklessness, arguments, delays in travel, or actions driven by anger and a lack of **forethought**."
  },
  {
    "name": "Queen of Wands",
    "description": "She is the Queen of **charisma**, creativity, and confident independence, representing an inspiring, vibrant personality. Upright, you embody or encounter a strong, self-assured woman who is friendly, honest, and successful in **business** or creative pursuits. Reversed, beware of jealousy, a demanding attitude, superficiality, or using your personal **power** in a deceitful or self-serving way."
  },
  {
    "name": "King of Wands",
    "description": "This King is the master of **vision**, entrepreneurship, and natural leadership, inspiring others with his integrity and energy. Upright, he signifies an honorable, conscientious, and friendly man, often a good leader or **businessman**, bringing unexpected success or news. Reversed, watch out for an overbearing leader, severity, impatience, or an overall lack of **tolerance** and austerity."
  },
  {
    "name": "Ace of Wands",
    "description": "The Ace of Wands is the pure, raw energy of **creation**, a sudden burst of enthusiasm, and the potential for a new venture. Upright, it heralds a new beginning, invention, a powerful drive for a project, or a creative **opportunity** ready to be seized. Reversed, it warns of delayed starts, fizzled-out enthusiasm, falling into **ruin**, or feeling uninspired and a lack of **initiative**."
  },
  {
    "name": "Two of Wands",
    "description": "This card is about planning the next step, evaluating your options, and making a **decision** about your future direction. Upright, you are looking over your achievements, planning big moves, and deciding on a partnership or trade that leads to **riches**. Reversed, it suggests fear of the unknown, unexpected surprise, emotional **turmoil**, or abandoning plans due to a lack of courage."
  },
  {
    "name": "Three of Wands",
    "description": "The Three of Wands signifies **expansion**, foresight, and waiting for the ships you sent out to come back with their bounty. Upright, you have a solid foundation, your initial efforts are paying off, and you can expect successful **partnerships** and further travel or commerce. Reversed, it marks the end of troubles, finding relief, or a need to stop and **reassess** your current ventures and effort."
  },
  {
    "name": "Four of Wands",
    "description": "This is a card of celebration, **stability**, and finding a happy, peaceful environment or home base. Upright, it often represents a harvest-home, happy marriage, community celebration, or reaching a **haven** of refuge and domestic harmony. Reversed, the meaning remains largely positive, reinforcing **prosperity** and increase, though perhaps with a slight emphasis on superficial enjoyment."
  },
  {
    "name": "Five of Wands",
    "description": "The Five of Wands shows **competition**, playful disagreement, or the struggle involved in a healthy rivalry or brainstorming session. Upright, it suggests energetic competition, a mock fight that may become serious, or the strenuous **battle** of life for wealth and success. Reversed, it warns of serious litigation, intense disputes, trickery, or conflicts becoming truly **antagonistic** and harmful."
  },
  {
    "name": "Six of Wands",
    "description": "This card is the ultimate symbol of **public recognition**, triumph, and receiving great news after a long effort. Upright, you are the victor, receiving accolades, achieving a **milestone**, and your hopes are now crowned with their own desire. Reversed, it cautions against delayed success, apprehension, fear of the future, or the possibility of **treachery** and disloyalty from a trusted source."
  },
  {
    "name": "Seven of Wands",
    "description": "The Seven of Wands indicates holding your ground, maintaining the **advantage**, and being ready to defend your position against challenges. Upright, you are exhibiting **valour** and success despite strong opposition, often winning through negotiation, discussion, or trade competition. Reversed, it suggests feeling overwhelmed, anxiety, **embarrassment**, or being too indecisive to defend your necessary boundaries."
  },
  {
    "name": "Eight of Wands",
    "description": "This card is all about **swiftness**, rapid movement, action, and things speeding toward a quick resolution or goal. Upright, expect great haste, messages, air travel, or the arrows of **love** indicating fast-paced activity in undertakings. Reversed, it warns of internal disputes, domestic quarrels, jealousy, or a sudden **halt** in progress and unwanted stingings of conscience."
  },
  {
    "name": "Nine of Wands",
    "description": "The Nine of Wands symbolizes **resilience**, the last stand, and having the strength to endure the final push after a long fight. Upright, you are nearly at the end of a long struggle, showing **courage** and preparation, ready to meet any final onslaught with caution. Reversed, it indicates obstacles, severe adversity, delays, or being too **defensive** and expecting catastrophe around every corner."
  },
  {
    "name": "Ten of Wands",
    "description": "This card signifies being **overburdened**, feeling the weight of responsibility, or taking on too many commitments at once. Upright, you are carrying a heavy load of oppression, stress, or the consequences of **success**, but you are nearing your goal. Reversed, it indicates intrigue, chronic difficulties, or a need to release a heavy burden and simplify your life to find **relief**."
  },
  {
    "name": "Page of Cups",
    "description": "The Page of Cups is the messenger of **emotional** news, a gentle soul, and the beginning of intuitive insights and creative flow. Upright, expect a creative invitation, romantic message, or encounter a sensitive, **studious** young person with a reflective nature. Reversed, it cautions against deception, artifice, a manipulative person, or emotional **immaturity** leading to instability and seduction."
  },
  {
    "name": "Knight of Cups",
    "description": "This Knight represents a heartfelt **invitation**, romantic advances, and the graceful, charming energy of emotions in motion. Upright, a lover, messenger, or a proposition is approaching with **sincerity**, often suggesting a romantic proposal or offer. Reversed, be wary of fraud, trickery, a smooth-talker who is insincere, or a sensitive soul who is **duplicitous** and passive-aggressive."
  },
  {
    "name": "Queen of Cups",
    "description": "She is the Queen of **empathy**, intuition, and nurturing love, holding a deep connection to her emotional life and vision. Upright, you encounter or embody a fair, devoted woman who is emotionally stable, artistic, and a source of deep **wisdom** and love. Reversed, the warning is against untrustworthiness, emotional codependence, **perversity**, or being overwhelmed by sorrow and emotional confusion."
  },
  {
    "name": "King of Cups",
    "description": "This King is the master of emotional **stability**, creative intelligence, and a balanced, compassionate authority figure. Upright, he signifies a mature, fair-minded man, often a lawyer or artist, who is responsible and a source of **creative** counsel and equity. Reversed, he warns of a double-dealing, unjust, or dishonest person, or allowing emotions to lead to **scandal** and considerable loss."
  },
  {
    "name": "Ace of Cups",
    "description": "The Ace of Cups is the fountainhead of **emotion**, love, joy, and the beginning of deep spiritual and emotional fulfillment. Upright, it signifies new beginnings in love, abundance, the true heart's desires, and great spiritual and emotional **contentment**. Reversed, it points to a false heart, emotional instability, **mutation**, or repressing feelings leading to a revolution of the heart."
  },
  {
    "name": "Two of Cups",
    "description": "This card is about **union**, mutual attraction, and the harmonious balance of two individuals or forces in partnership. Upright, it represents a deep friendship, the beginning of a passionate **love** or affinity, and a perfect concord and sympathy between two parties. Reversed, it suggests a broken friendship, **lust**, jealousy, or a wish/desire that is not in harmony with natural emotional flow."
  },
  {
    "name": "Three of Cups",
    "description": "The Three of Cups is the card of **celebration**, friendship, community, and the happy conclusion of a shared effort. Upright, expect a victory party, a joyous reunion, emotional healing, and **abundance** resulting from collaborative effort or a successful project. Reversed, it warns of overindulgence, excess in physical enjoyment, **gossip**, or a delay in your expected positive outcome."
  },
  {
    "name": "Four of Cups",
    "description": "This card indicates **apathy**, feeling bored or dissatisfied, and a refusal to acknowledge the gifts already offered or available opportunities. Upright, you may feel weariness, imaginary vexations, or be too focused on what you lack to see the **consolation** of a new offer. Reversed, it suggests receiving a new **instruction**, a new relationship, or a break from the monotony and embracing novelty."
  },
  {
    "name": "Five of Cups",
    "description": "The Five of Cups speaks of **loss**, regret, and dwelling on what is gone rather than appreciating what still remains. Upright, you are mourning a setback or disappointment, focusing on the three spilled cups while missing the two **upright** ones, indicating partial loss or bitter inheritance. Reversed, it hints at unexpected good **news**, new alliances, a return home, or moving past initial disappointment."
  },
  {
    "name": "Six of Cups",
    "description": "This is the card of **nostalgia**, childhood memories, and returning to the familiar or enjoying the simple happiness of the past. Upright, it signifies revisiting old memories, the return of a past person or feeling, or a period of **innocence** and enjoyment in a familiar setting. Reversed, it encourages focusing on the **future**, planning, seeking new knowledge, or being burdened by past issues."
  },
  {
    "name": "Seven of Cups",
    "description": "The Seven of Cups highlights **fantasy**, wishful thinking, and an abundance of confusing options that may be mere illusions. Upright, you are confronted with too many tempting choices, often leading to scattered focus, sentimentality, or difficulty discerning **reality** from imagination. Reversed, it brings clear focus, strong **determination**, the realization of desire, or finally committing to a project or path."
  },
  {
    "name": "Eight of Cups",
    "description": "This card represents **abandonment**, walking away from what is emotionally unfulfilling, and searching for a deeper meaning. Upright, a person is leaving behind past emotional attachments, seeking something more profound, or acknowledging that a situation is no longer **important**. Reversed, it can indicate great **joy**, happiness, and emotional feasting, or returning to a situation you previously left."
  },
  {
    "name": "Nine of Cups",
    "description": "The Nine of Cups is often called the 'wish card,' signifying deep emotional **satisfaction**, contentment, and material well-being. Upright, you are experiencing success, physical comfort, and a sense of **victory** and contentment where your desires are met. Reversed, it warns of mistakes, emotional imperfections, smugness, or finding temporary **liberty** that is not lasting or true."
  },
  {
    "name": "Ten of Cups",
    "description": "This card represents ultimate **emotional fulfillment**, domestic bliss, and perfect harmony within family and community. Upright, it signifies the highest state of human love, deep friendship, and a happy, stable **home** life filled with contentment and repose of the heart. Reversed, it suggests family conflict, emotional **violence**, indignation, or finding a sense of repose in a deceptive, false situation."
  },
  {
    "name": "Page of Pentacles",
    "description": "The Page of Pentacles is the energy of new beginnings in the **material** world, a focused, grounded student, or important news about finances. Upright, it heralds new opportunities for learning, reflection, a message about money, or a youthful figure who is diligent and focused on **scholarship**. Reversed, it suggests prodigality, dissipation of funds, bad **unfavourable** news, or being too focused on luxury and material things."
  },
  {
    "name": "Knight of Pentacles",
    "description": "This Knight is slow, **steady**, and dependable, embodying patience, thoroughness, and practicality in work and responsibility. Upright, he signifies a reliable, serious, and practical person who is focused on duty, utility, and long-term **planning** and interest. Reversed, he warns of **inertia**, idleness, stagnation, or a lack of care and discouragement that leads to missed opportunities."
  },
  {
    "name": "Queen of Pentacles",
    "description": "She is the Queen of **abundance**, earthly comforts, and a generous spirit that nurtures both home and business. Upright, you encounter or embody a magnificent, secure, and generous woman who is opulent and possesses a **greatness** of soul and intelligence. Reversed, it cautions against suspicion, mistrust, **fear**, or allowing material wealth to lead to pettiness and insecurity."
  },
  {
    "name": "King of Pentacles",
    "description": "This King is the epitome of **financial** success, material stability, and a reliable, grounded man of business and intellectual aptitude. Upright, he signifies a successful entrepreneur, a man of valor and **courage**, achieving great success through intellect and hard work. Reversed, beware of **corruption**, weakness, perversity, or an overemphasis on material wealth leading to moral decay and peril."
  },
  {
    "name": "Ace of Pentacles",
    "description": "The Ace of Pentacles is the seed of **prosperity**, security, and a glorious new beginning in the physical and financial realm. Upright, it signifies a fresh start with money, a lucrative new job, or a feeling of complete **felicity** and perfect contentment in your material life. Reversed, it warns of an unstable financial beginning, great riches that lead to **evil**, or an intelligence that brings bad news or misfortune."
  },
  {
    "name": "Two of Pentacles",
    "description": "This card deals with **balance**, managing competing demands, and skillfully juggling two or more responsibilities. Upright, you are managing your time, money, or projects with dexterity, enjoying the **gaiety** of recreation while handling obstacles and messages. Reversed, it suggests a loss of balance, being overwhelmed by **agitation** or trouble, or trying to force joy in a stressful situation."
  },
  {
    "name": "Three of Pentacles",
    "description": "The Three of Pentacles represents teamwork, **skilled** labor, and receiving recognition and reward for your craftsmanship or effort. Upright, you are collaborating successfully on a project, receiving a **commission**, and gaining renown or nobility for your quality work. Reversed, it warns of substandard work, lack of **glory**, mediocrity, or a project failing due to poor teamwork or a lack of dedication."
  },
  {
    "name": "Four of Pentacles",
    "description": "This card symbolizes **security**, holding onto possessions, and the potential pitfalls of clinging too tightly to material wealth. Upright, you are securing your assets, receiving a legacy, or demonstrating **prudence** and stability in your finances and possessions. Reversed, it cautions against **avarice**, delays, resistance to generosity, or a fixation on wealth that causes personal stagnation."
  },
  {
    "name": "Five of Pentacles",
    "description": "The Five of Pentacles foretells **destitution**, material hardship, feeling left out in the cold, or a need for outside help. Upright, it foretells material trouble, isolation, or focusing on feelings of **poverty** and being abandoned by the spiritual or emotional life. Reversed, it suggests the easing of material troubles, a movement out of **chaos** and disorder, or a new, positive alliance forming after a difficult time."
  },
  {
    "name": "Six of Pentacles",
    "description": "This card is about **charity**, generosity, and the equitable sharing of resources between the wealthy and the needy. Upright, you are either receiving or giving a gift, expecting **present** prosperity, or demonstrating a good heart and vigilance in your community. Reversed, it warns of debt, envy, **cupidity**, or an imbalance in giving and receiving, often suggesting a need for caution with money."
  },
  {
    "name": "Seven of Pentacles",
    "description": "The Seven of Pentacles shows a time of **pause** and evaluation, checking the growth of your investments and being patient for the final harvest. Upright, you are assessing your progress in business or money, considering a new investment, and reflecting on your **ingenuity** and work. Reversed, it signals anxiety about finances, a potential issue with a **loan**, or a need for a change in your current strategy."
  },
  {
    "name": "Eight of Pentacles",
    "description": "This card is the essence of **dedication**, apprenticeship, and developing true craftsmanship and skill through diligence and focused work. Upright, you are mastering a skill, finding **employment**, or focusing intently on the preparatory stage of a business or craft project. Reversed, it warns of voided ambition, vanity, a lack of **skill**, or using your cleverness for cunning, intrigue, and usury."
  },
  {
    "name": "Nine of Pentacles",
    "description": "The Nine of Pentacles represents **luxury**, self-sufficiency, and enjoying the fruits of your labor with grace and well-deserved independence. Upright, you have achieved material well-being, success, safety, and are enjoying quiet **discernment** and accomplishment in a wide domain. Reversed, it warns of a voided project, bad faith, possible **theft**, or acting with roguery or deception regarding your wealth."
  },
  {
    "name": "Ten of Pentacles",
    "description": "This card is about **generational** wealth, family inheritance, and long-term security and stability within a family line. Upright, it signifies great riches, family archives, a happy home abode, and the ultimate financial and social **gain** of a family. Reversed, it suggests family disputes, a risky venture or **loss** through gambling, or an unexpected change in a family's financial security."
  },
  {
    "name": "Page of Swords",
    "description": "The Page of Swords brings news, sharp **intellect**, and the energy of vigilance, curiosity, and rapid observation. Upright, you are approaching a situation with alertness, authority, or you are acting as a spy or messenger of challenging **news**. Reversed, it signals unforeseen danger, bad news, an unprepared state, or a deceitful or gossipy person who uses their mind for **malice**."
  },
  {
    "name": "Knight of Swords",
    "description": "This Knight is all about quick action, **ambition**, and rushing headlong into a situation with skill, bravery, and a competitive edge. Upright, expect a swift, decisive move, great **capacity** and skill, or a sudden, forceful arrival that can mean war or destruction. Reversed, it warns of **imprudence**, extravagance, incapacity to plan, or destructive tendencies leading to failure and folly."
  },
  {
    "name": "Queen of Swords",
    "description": "She is the Queen of sharp **truth**, clear thinking, and often represents a woman familiar with loss, possessing a keen, objective mind. Upright, she signifies an independent woman, often a widow, who is intelligent, honest, and can cut through emotional **confusion** with her intellect. Reversed, be cautious of malice, bigotry, deceit, or a cold, **prudish** woman using her sharp mind to inflict pain or manipulate."
  },
  {
    "name": "King of Swords",
    "description": "This King embodies the power of **judgment**, militant intelligence, and an ultimate, decisive authority in matters of law and reason. Upright, he signifies a powerful, commanding, intellectual man—a lawyer or judge—who rules with **logic**, authority, and an honest mind. Reversed, he warns of cruelty, **perversity**, evil intention, or a man whose immense power is used with barbarity and prejudice."
  },
  {
    "name": "Ace of Swords",
    "description": "The Ace of Swords is the pure power of the intellect, a sudden, piercing **clarity**, and the ability to cut through illusion. Upright, it signals a triumph of force, great **conquest**, a mental breakthrough, or the intellectual aptitude to achieve great heights. Reversed, this immense force can be disastrous, leading to a major setback, destruction, or extreme difficulty in a birth or **conception**."
  },
  {
    "name": "Two of Swords",
    "description": "This card represents a difficult **truce**, a stalemate, or the need to block out external forces to make a balanced, rational decision. Upright, you are at an impasse, needing to find **equipoise** and courage to choose, though the final choice is often hard. Reversed, it suggests falsehood, imposture, two-faced actions, or a difficult decision is made based on **duplicity** or disloyalty."
  },
  {
    "name": "Three of Swords",
    "description": "The Three of Swords signifies emotional **pain**, heartbreak, separation, and the sharp, undeniable truth of sorrow or loss. Upright, this is a card of rupture, division, and emotional **grief**, where the design itself illustrates the deep pain of absence or removal. Reversed, it may suggest recovering from loss, a delay in inevitable pain, or emotional confusion and **mental** alienation that prevents healing."
  },
  {
    "name": "Four of Swords",
    "description": "This card indicates a need for rest, **retreat**, convalescence, and a temporary period of quiet solitude to recover from a struggle. Upright, you should embrace vigilance in your downtime, find the **hermit's** repose, and allow yourself to heal after a period of conflict or exile. Reversed, it suggests a return to activity, careful **economy**, wise administration, or leaving a tomb of isolation to face the world."
  },
  {
    "name": "Five of Swords",
    "description": "The Five of Swords highlights a hollow **victory**, a feeling of defeat, or a conflict where everyone ultimately loses something of value. Upright, someone is collecting the spoils after a bitter dispute, marking **dishonour**, loss, and degradation for all involved, including the 'master in possession.' Reversed, the result is the same: loss and **infamy**, or a prolonged funeral/obsequies for what was destroyed in the conflict."
  },
  {
    "name": "Six of Swords",
    "description": "This card represents a literal or figurative **journey** away from difficulty, a transition, or finding an expedient way out of trouble. Upright, you are moving to calmer waters, seeking a better route, or using a commissioned **envoy** to ease a burdened situation. Reversed, the journey is delayed, or it suggests a sudden, clear **declaration** or confession that makes the matter public."
  },
  {
    "name": "Seven of Swords",
    "description": "The Seven of Swords warns of **deception**, sneaking away, or attempting to get away with something by cutting corners or evasion. Upright, you are attempting a plan that may fail, trying to avoid conflict, or engaging in a covert **design** that requires stealth and confidence. Reversed, it suggests good **advice** is needed, a plan is revealed as faulty, or caution against slander and uncontrolled gossip."
  },
  {
    "name": "Eight of Swords",
    "description": "This card symbolizes **restriction**, feeling trapped, or being bound by your own mental limitations and bad news. Upright, you are experiencing a crisis, feeling **powerless** and temporarily stuck, often due to self-imposed mental chains or censure from others. Reversed, it suggests overcoming mental obstacles, gaining **liberation** from disquiet, or a sudden, unexpected revelation of hidden treachery."
  },
  {
    "name": "Nine of Swords",
    "description": "The Nine of Swords is the card of **anxiety**, worry, nightmares, and feeling the deep desolation of despair and failure. Upright, you are experiencing sleepless nights, **miscarriage** of plans, disappointment, or the deepest sense of sorrow and mental torment. Reversed, it can indicate the easing of worries, overcoming **shame**, or a reasonable fear, often pointing to temporary darkness before the dawn."
  },
  {
    "name": "Ten of Swords",
    "description": "This card is the ultimate low point, signifying absolute **endings**, severe pain, betrayal, and the completion of a traumatic cycle. Upright, it represents the finality of a situation, severe **affliction**, profound sadness, and a feeling of having been stabbed in the back and left prostrate. Reversed, it suggests a positive turn is possible, but any gain or **advantage** achieved will be fleeting or non-permanent."
  }
]

let selectedCards = [] // { name, position }
let currentView = 'form' // 'form' or 'detail'
let currentDetailEntry = null

// Initialize function
function init() {
  console.log('Initializing app...')
  
  // Select all form elements
  cardSearch = document.querySelector('#cardSearch')
  autocompleteDropdown = document.querySelector('#autocompleteDropdown')
  positionContainer = document.querySelector('#positionContainer')
  cardPosition = document.querySelector('#cardPosition')
  selectedTags = document.querySelector('#selectedTags')
  spreadSelect = document.querySelector('#spreadSelect')
  entryDate = document.querySelector('#entryDate')
  notes = document.querySelector('#notes')
  saveEntry = document.querySelector('#saveEntry')
  clearForm = document.querySelector('#clearForm')
  addCardBtn = document.querySelector('#addCardBtn')
  
  console.log('Elements found:', { cardSearch, calendarContainer, saveEntry })
  
  console.log('Setting up event listeners...')
  setupEventListeners()
  
  console.log('Rendering tags...')
  renderTags()
  
  console.log('Rendering calendar...')
  renderCalendar()
}

// Set up all event listeners
function setupEventListeners() {
  // Save entry handler
  saveEntry.addEventListener('click', async (e) => {
  e.preventDefault()
  console.log('Save button clicked')
  console.log('Selected cards:', selectedCards)
  if (selectedCards.length === 0) return alert('Add at least one card to the reading.')
  
  // Convert date string to ISO-8601 DateTime for Prisma
  const dateStr = entryDate.value || new Date().toISOString().substring(0, 10)
  const dateTime = new Date(dateStr + 'T00:00:00.000Z').toISOString()
  
  const entry = {
    cards: selectedCards.slice(),
    spread: spreadSelect.options[spreadSelect.selectedIndex].text,
    spreadValue: spreadSelect.value,
    date: dateTime,
    notes: notes.value
  }
  
  console.log('Saving entry:', entry)
  const result = await saveEntryToDatabase(entry)
  console.log('Save result:', result)
  if (result) {
    // reset form
    selectedCards = []
    renderTags()
    spreadSelect.value = 'single'
    entryDate.value = ''
    notes.value = ''
    await renderCalendar()
    alert('Entry saved to database!')
  } else {
    alert('Failed to save entry. Check console for errors.')
  }
})

  // Clear form handler
  clearForm.addEventListener('click', () => {
    selectedCards = []
    renderTags()
    spreadSelect.value = 'single'
    entryDate.value = ''
    notes.value = ''
  })
  
  // Card search input handler for autocomplete
  cardSearch.addEventListener('input', (e) => {
    const val = e.target.value.trim()
    if (!val) {
      hideAutocomplete()
      return
    }
    
    const matches = tarotCards.filter(c => 
      c.name.toLowerCase().includes(val.toLowerCase())
    )
    
    showAutocomplete(matches)
  })
  
  // Click outside to close dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-container')) {
      hideAutocomplete()
    }
  })
  
  // Add card button handler
  addCardBtn.addEventListener('click', async () => {
    const name = cardSearch.value.trim()
    const pos = cardPosition.value
    if (!name) return
    
    // Show animation
    try {
      await showCardAnimation(name, pos)
      
      // After animation completes, add card to selection
      selectedCards.push({ name, position: pos })
      renderTags()
      cardSearch.value = ''
      cardPosition.value = 'upright'
      hidePositionSelector()
    } catch (error) {
      console.error('Animation error:', error)
      // Still add the card even if animation fails
      selectedCards.push({ name, position: pos })
      renderTags()
      cardSearch.value = ''
      cardPosition.value = 'upright'
      hidePositionSelector()
    }
  })
  
  // Keyboard navigation for autocomplete
  cardSearch.addEventListener('keydown', (e) => {
    const dropdown = autocompleteDropdown
    const items = dropdown.querySelectorAll('.autocomplete-item')
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedAutocompleteIndex = Math.min(selectedAutocompleteIndex + 1, items.length - 1)
      updateAutocompleteSelection(items)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedAutocompleteIndex = Math.max(selectedAutocompleteIndex - 1, -1)
      updateAutocompleteSelection(items)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedAutocompleteIndex >= 0 && items[selectedAutocompleteIndex]) {
        items[selectedAutocompleteIndex].click()
      } else {
        const val = cardSearch.value.trim()
        const found = tarotCards.find(c => c.name.toLowerCase() === val.toLowerCase())
        if (found) {
          cardSearch.value = found.name
          hideAutocomplete()
          showPositionSelector()
          cardPosition.focus()
        } else {
          alert('Card not found. Please choose a card from the suggestions.')
        }
      }
    } else if (e.key === 'Escape') {
      hideAutocomplete()
    }
  })
}


function showPositionSelector() {
  positionContainer.style.display = 'block'
}

function hidePositionSelector() {
  positionContainer.style.display = 'none'
}

function showAutocomplete(matches) {
  selectedAutocompleteIndex = -1
  
  if (matches.length === 0) {
    hideAutocomplete()
    return
  }
  
  autocompleteDropdown.innerHTML = ''
  matches.slice(0, 10).forEach((card, index) => {
    const item = document.createElement('div')
    item.className = 'autocomplete-item'
    item.textContent = card.name
    item.addEventListener('click', () => {
      cardSearch.value = card.name
      hideAutocomplete()
      showPositionSelector()
      cardPosition.focus()
    })
    autocompleteDropdown.appendChild(item)
  })
  
  autocompleteDropdown.classList.add('show')
}

function hideAutocomplete() {
  autocompleteDropdown.classList.remove('show')
  selectedAutocompleteIndex = -1
}

function updateAutocompleteSelection(items) {
  items.forEach((item, index) => {
    if (index === selectedAutocompleteIndex) {
      item.classList.add('selected')
      item.scrollIntoView({ block: 'nearest' })
    } else {
      item.classList.remove('selected')
    }
  })
}

function renderTags() {
  selectedTags.innerHTML = ''
  selectedCards.forEach((c, idx) => {
    const chip = document.createElement('span')
    chip.className = 'tag'
    chip.textContent = `${c.name} (${c.position})`
    const removeBtn = document.createElement('button')
    removeBtn.className = 'tag-remove'
    removeBtn.textContent = '×'
    removeBtn.addEventListener('click', () => {
      selectedCards.splice(idx, 1)
      renderTags()
    })
    chip.appendChild(removeBtn)
    selectedTags.appendChild(chip)
  })
}

// Load entries from MongoDB via API
async function loadEntries() {
  try {
    const response = await fetch('/data')
    if (response.ok) {
      const entries = await response.json()
      return entries
    } else {
      console.error('Failed to load entries from server')
      return []
    }
  } catch (err) {
    console.error('Failed to load entries', err)
    return []
  }
}

// Save entry to MongoDB via API
async function saveEntryToDatabase(entry) {
  try {
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error:', errorData)
      alert(errorData.error || 'Failed to save entry')
      return null
    }
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('Save error:', err)
    alert('An error occurred while saving')
    return null
  }
}

// Delete entry from MongoDB via API
async function deleteEntry(id) {
  try {
    const response = await fetch(`/data/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      alert(errorData.error || 'Failed to delete entry')
      return false
    }
    
    return true
  } catch (err) {
    console.error('Delete error:', err)
    alert('An error occurred while deleting')
    return false
  }
}

// Get entries by date (YYYY-MM-DD format)
async function getEntriesByDate(dateStr) {
  const entries = await loadEntries()
  return entries.filter(e => {
    const entryDate = new Date(e.date).toISOString().substring(0, 10)
    return entryDate === dateStr
  })
}

// Render calendar for the current month
async function renderCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay() // 0=Sunday
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  
  let html = `<div class="calendar-header">${monthNames[month]} ${year}</div>`
  html += `<div class="calendar-grid">`
  html += `<div class="calendar-day-name">Sun</div>`
  html += `<div class="calendar-day-name">Mon</div>`
  html += `<div class="calendar-day-name">Tue</div>`
  html += `<div class="calendar-day-name">Wed</div>`
  html += `<div class="calendar-day-name">Thu</div>`
  html += `<div class="calendar-day-name">Fri</div>`
  html += `<div class="calendar-day-name">Sat</div>`
  
  // Empty cells before the first day
  for (let i = 0; i < startDayOfWeek; i++) {
    html += `<div class="calendar-day empty"></div>`
  }
  
  // Days of the month
  const entries = await loadEntries()
  const todayStr = new Date().toISOString().substring(0, 10)
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    // Check if any entry has this date (comparing just the date portion)
    const hasEntry = entries.some(e => {
      const entryDate = new Date(e.date).toISOString().substring(0, 10)
      return entryDate === dateStr
    })
    
    let className = hasEntry ? 'calendar-day has-entry' : 'calendar-day'
    if (dateStr === todayStr) className += ' today'
    
    html += `<div class="${className}" data-date="${dateStr}">${day}</div>`
  }
  
  html += `</div>`
  calendarContainer.innerHTML = html
  
  // Add click handlers to calendar days
  document.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
    dayEl.addEventListener('click', async () => {
      // Remove selected class from all days
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'))
      // Add selected class to clicked day
      dayEl.classList.add('selected')
      
      const dateStr = dayEl.getAttribute('data-date')
      const dayEntries = await getEntriesByDate(dateStr)
      if (dayEntries.length > 0) {
        showEntryDetail(dayEntries[0])
      }
    })
  })
}

// Show entry detail view
function showEntryDetail(entry) {
  currentView = 'detail'
  currentDetailEntry = entry
  
  const dateObj = new Date(entry.date)
  const dateText = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const tagsHtml = entry.cards.map(c => 
    `<span class="tag static">${c.name} (${c.position})</span>`
  ).join(' ')
  
  detailView.innerHTML = DOMPurify.sanitize(`
    <button id="backToForm" class="back-btn">← Back to Create Entry</button>
    <h2>Entry - ${dateText}</h2>
    
    <h3>You pulled...</h3>
    <div class="tags">${tagsHtml}</div>
    
    <h3>With a card spread of...</h3>
    <div class="detail-spread">${entry.spread}</div>
    
    <h3>Your Journal Notes</h3>
    <div class="detail-notes"><pre>${entry.notes || ''}</pre></div>
    
    <div class="form-actions">
      <button id="editEntry" class="save">Edit Entry</button>
      <button id="deleteEntry" class="delete-btn">Delete Entry</button>
    </div>
  `)
  
  // Toggle views
  formView.style.display = 'none'
  detailView.style.display = 'block'
  
  document.querySelector('#backToForm').addEventListener('click', showFormView)
  document.querySelector('#editEntry').addEventListener('click', () => showEditView(entry))
  document.querySelector('#deleteEntry').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const success = await deleteEntry(entry.id)
      if (success) {
        alert('Entry deleted!')
        showFormView()
        await renderCalendar()
      }
    }
  })
}

// Show form view
function showFormView() {
  currentView = 'form'
  currentDetailEntry = null
  
  // Clear the form
  selectedCards = []
  renderTags()
  spreadSelect.value = 'single'
  entryDate.value = ''
  notes.value = ''
  
  // Toggle views
  formView.style.display = 'block'
  detailView.style.display = 'none'
}

// Show edit view - populate form with existing entry
function showEditView(entry) {
  currentView = 'form'
  currentDetailEntry = entry
  
  // Populate form with existing data
  selectedCards = [...entry.cards]
  renderTags()
  
  // Set spread
  spreadSelect.value = entry.spreadValue || 'single'
  
  // Set date
  const dateStr = new Date(entry.date).toISOString().substring(0, 10)
  entryDate.value = dateStr
  
  // Set notes
  notes.value = entry.notes || ''
  
  // Change save button to update button
  saveEntry.textContent = 'Update Entry'
  saveEntry.onclick = async (e) => {
    e.preventDefault()
    console.log('Update button clicked')
    if (selectedCards.length === 0) return alert('Add at least one card to the reading.')
    
    const dateStr = entryDate.value || new Date().toISOString().substring(0, 10)
    const dateTime = new Date(dateStr + 'T00:00:00.000Z').toISOString()
    
    const updatedEntry = {
      cards: selectedCards.slice(),
      spread: spreadSelect.options[spreadSelect.selectedIndex].text,
      spreadValue: spreadSelect.value,
      date: dateTime,
      notes: notes.value
    }
    
    console.log('Updating entry:', updatedEntry)
    const result = await updateEntry(entry.id, updatedEntry)
    console.log('Update result:', result)
    
    if (result) {
      alert('Entry updated successfully!')
      showFormView()
      await renderCalendar()
      // Reset save button
      saveEntry.textContent = 'Save Entry'
      saveEntry.onclick = null
      init() // Reinitialize to restore original handlers
    } else {
      alert('Failed to update entry. Check console for errors.')
    }
  }
  
  // Toggle views
  formView.style.display = 'block'
  detailView.style.display = 'none'
}

// Update entry in MongoDB via API
async function updateEntry(id, entry) {
  try {
    const response = await fetch(`/data/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error:', errorData)
      alert(errorData.error || 'Failed to update entry')
      return null
    }
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('Update error:', err)
    alert('An error occurred while updating')
    return null
  }
}

// Animation functions for card shuffle and flip
function showCardAnimation(cardName, position) {
  const modal = document.querySelector('#cardAnimationModal')
  const shuffleCardsNodeList = modal.querySelectorAll('.shuffle-card')
  const shuffleCards = Array.from(shuffleCardsNodeList) // Convert to array
  const flipCard = modal.querySelector('.flip-card')
  const cardNameEl = modal.querySelector('.card-name')
  const cardDescriptionEl = modal.querySelector('.card-description')
  const cardFront = flipCard.querySelector('.cardFront')
  const cardBack = flipCard.querySelector('.cardBack')
  
  // Find the card data
  const cardData = tarotCards.find(c => c.name === cardName)
  if (!cardData) {
    console.error('Card not found:', cardName)
    return Promise.reject('Card not found')
  }
  
  // Set card text content
  cardNameEl.textContent = `${cardData.name} (${position})`
  
  // Remove markdown bold markers (**text**) from description
  const cleanDescription = cardData.description.replace(/\*\*(.*?)\*\*/g, '$1')
  cardDescriptionEl.textContent = cleanDescription
  
  // Reset all cards
  gsap.set(shuffleCards, { x: 0, y: 0, rotation: 0, zIndex: 1, opacity: 1, scale: 1 })
  gsap.set(flipCard, { rotationY: 0, z: 0, scale: 1 })
  gsap.set(cardFront, { rotationY: 0 })
  gsap.set(cardBack, { rotationY: -180 })
  
  // Hide flip card initially, show shuffle cards
  flipCard.classList.remove('active')
  shuffleCards.forEach(card => card.style.display = 'block')
  
  // Show modal
  modal.classList.add('show')
  
  return new Promise((resolve) => {
    // Store resolve function for later use when user closes modal
    modal.dataset.resolveFunction = 'pending'
    
    // Create timeline for overhand shuffle animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Animation complete - card is now displayed and waiting for user to close
        // Show the exit button after flip completes
        const closeBtn = document.querySelector('#closeAnimationBtn')
        if (closeBtn) {
          gsap.to(closeBtn, { opacity: 1, duration: 0.3, delay: 0.5 })
        }
      }
    })
    
    // Setup one-time close handler
    const closeHandler = () => {
      const closeBtn = document.querySelector('#closeAnimationBtn')
      closeBtn.removeEventListener('click', closeHandler)
      
      // Hide close button
      gsap.set(closeBtn, { opacity: 0 })
      
      // Hide modal
      modal.classList.remove('show')
      
      // Reset all shuffle cards and flip card
      shuffleCards.forEach(card => card.style.display = 'block')
      flipCard.classList.remove('active')
      
      resolve()
    }
    
    const closeBtn = document.querySelector('#closeAnimationBtn')
    if (closeBtn) {
      gsap.set(closeBtn, { opacity: 0 }) // Hide initially
      closeBtn.addEventListener('click', closeHandler)
    }
    
    // Initial card stack position with slight offsets (all visible)
    tl.set(shuffleCards[0], { zIndex: 3, x: 0, y: 0 })
    tl.set(shuffleCards[1], { zIndex: 2, x: -3, y: -3 })
    tl.set(shuffleCards[2], { zIndex: 1, x: -6, y: -6 })
    
    // Overhand shuffle animation - repeat 6 times (3 left, 3 right)
    // Track which card is currently on top
    let cardOrder = [0, 1, 2]
    
    for (let i = 0; i < 6; i++) {
      const topCardIdx = cardOrder[0] // Get current top card index
      const middleCardIdx = cardOrder[1]
      const bottomCardIdx = cardOrder[2]
      
      const topCard = shuffleCards[topCardIdx]
      const middleCard = shuffleCards[middleCardIdx]
      const bottomCard = shuffleCards[bottomCardIdx]
      const direction = i % 2 === 0 ? 1 : -1 // Alternate left and right
      
      // Ensure top card is on top at start
      tl.set(topCard, { zIndex: 10 })
      
      // Move top card to the side (slide out from front)
      tl.to(topCard, {
        x: 150 * direction,
        y: -30,
        rotation: 15 * direction,
        duration: 0.3,
        ease: "power2.out"
      })
      
      // Move it to the other side
      tl.to(topCard, {
        x: -150 * direction,
        y: 0,
        rotation: -10 * direction,
        duration: 0.4,
        ease: "power2.inOut"
      })
      
      // Send it to the BACK (z-index 0) and bring it back to center
      tl.to(topCard, {
        x: -6,
        y: -6,
        rotation: 0,
        duration: 0.3,
        ease: "power2.in"
      })
      
      // Set z-index to back BEFORE it arrives
      tl.set(topCard, { zIndex: 0 }, "-=0.15")
      
      // Promote the other cards forward in the stack
      tl.to(middleCard, { 
        zIndex: 3, 
        x: 0, 
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3")
      tl.to(bottomCard, { 
        zIndex: 2, 
        x: -3, 
        y: -3,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3")
      
      // Rotate the card order
      cardOrder = [cardOrder[1], cardOrder[2], cardOrder[0]]
    }
    
    // Final gather - all cards come together
    tl.to(shuffleCards, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    })
    
    // Fade out shuffle cards and show flip card
    tl.to(shuffleCards, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        shuffleCards.forEach(card => card.style.display = 'none')
        flipCard.classList.add('active')
      }
    })
    
    // Card flip animation (based on the reference code)
    tl.to(cardFront, { 
      duration: 1, 
      rotationY: 180,
      ease: "power2.inOut"
    })
    tl.to(cardBack, { 
      duration: 1, 
      rotationY: 0,
      ease: "power2.inOut"
    }, "-=1")
    tl.to(flipCard, { 
      z: 50,
      duration: 0.5,
      ease: "power2.out"
    }, "-=1")
    tl.to(flipCard, { 
      z: 0,
      duration: 0.5,
      ease: "power2.in"
    }, "-=0.5")
    
    // Scale up slightly for emphasis
    tl.to(flipCard, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.7)"
    })
    
    // Scale back to normal
    tl.to(flipCard, {
      scale: 1,
      duration: 0.2
    })
  })
}

// Call init when DOM is ready
init() 
